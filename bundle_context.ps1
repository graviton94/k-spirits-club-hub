Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$reportsDir = Join-Path $projectRoot "ai_improvement_machine/reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

$repomixOut = Join-Path $reportsDir "1_repomix_bundle.xml"
$graphifyOut = Join-Path $reportsDir "2_graphify_architecture.md"
$sqlOut = Join-Path $reportsDir "3_sql_lineage_report.txt"
$markitdownOut = Join-Path $reportsDir "4_docs_bundle.md"

function Write-Section([string]$title) {
    Write-Host ""
    Write-Host "==== $title ====" -ForegroundColor Cyan
}

function Ensure-Command([string]$name, [string]$installHint) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Required command '$name' is not available. $installHint"
    }
}

function Ensure-PythonPackage([string]$moduleName, [string]$pipSpec) {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        throw "python command is required but not found in PATH."
    }

    $check = & python -c "import importlib.util,sys;sys.exit(0 if importlib.util.find_spec('$moduleName') else 1)" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing Python package: $pipSpec"
        & python -m pip install $pipSpec
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install Python package '$pipSpec'."
        }
    }
}

function Import-DotEnvForGraphify {
    $envFile = Join-Path $projectRoot ".env"
    if (-not (Test-Path $envFile)) {
        return
    }

    $rawLines = Get-Content -Path $envFile -ErrorAction SilentlyContinue
    foreach ($line in $rawLines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $trimmed = $line.Trim()
        if ($trimmed.StartsWith("#")) { continue }
        if (-not $trimmed.Contains("=")) { continue }

        $parts = $trimmed.Split("=", 2)
        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"').Trim("'")
        if ([string]::IsNullOrWhiteSpace($key)) { continue }

        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }

    if (-not [string]::IsNullOrWhiteSpace($env:claude_api_key) -and [string]::IsNullOrWhiteSpace($env:ANTHROPIC_API_KEY)) {
        [Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $env:claude_api_key, "Process")
    }
}

function Invoke-Graphify {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $graphifyCmd = Get-Command graphify -ErrorAction SilentlyContinue
    if ($graphifyCmd) {
        & graphify @Arguments
        return
    }

    & python -m graphify @Arguments
}

function Get-PythonScriptsDirs {
    $result = New-Object System.Collections.Generic.List[string]

    $sysScripts = (& python -c "import sysconfig; print(sysconfig.get_path('scripts'))" 2>$null)
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($sysScripts)) {
        $result.Add($sysScripts.Trim())
    }

    $userScripts = (& python -c "import site, os; p=site.getusersitepackages(); print(os.path.join(os.path.dirname(p), 'Scripts'))" 2>$null)
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($userScripts)) {
        $result.Add($userScripts.Trim())
    }

    return $result | Select-Object -Unique
}

function Invoke-SQLLineage {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $cmd = Get-Command sqllineage -ErrorAction SilentlyContinue
    if ($cmd) {
        & sqllineage @Arguments
        return
    }

    $scriptsDirs = Get-PythonScriptsDirs
    foreach ($scriptsDir in $scriptsDirs) {
        $exe = Join-Path $scriptsDir "sqllineage.exe"
        if (Test-Path $exe) {
            & $exe @Arguments
            return
        }
    }

    throw "sqllineage command is unavailable and no sqllineage.exe found in Python scripts directory."
}

function Invoke-MarkItDown {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $cmd = Get-Command markitdown -ErrorAction SilentlyContinue
    if ($cmd) {
        & markitdown @Arguments
        return
    }

    $scriptsDirs = Get-PythonScriptsDirs
    foreach ($scriptsDir in $scriptsDirs) {
        $exe = Join-Path $scriptsDir "markitdown.exe"
        if (Test-Path $exe) {
            & $exe @Arguments
            return
        }
    }

    throw "markitdown command is unavailable and no markitdown.exe found in Python scripts directory."
}

Write-Section "1) Repomix"
Ensure-Command "npx" "Install Node.js/npm so npx is available."

$repomixInclude = "app/**/*.ts,app/**/*.tsx,components/**/*.ts,components/**/*.tsx,lib/**/*.ts,lib/**/*.tsx,dataconnect/**/*.gql,middleware.ts"
$repomixIgnore = "**/node_modules/**,**/.next/**,**/dist/**,**/build/**,**/*.log,**/package-lock.json,**/tsconfig*.json,**/next.config.*,**/tailwind.config.*,**/postcss.config.*,**/wrangler.jsonc"

& npx -y repomix@latest . --compress --style xml -o $repomixOut --include $repomixInclude --ignore $repomixIgnore
if ($LASTEXITCODE -ne 0) {
    throw "Repomix step failed."
}

Write-Section "2) Graphify"
Import-DotEnvForGraphify
Ensure-PythonPackage "graphify" "graphifyy"

$graphifySucceeded = $false

Invoke-Graphify -Arguments @("update", ".")
if ($LASTEXITCODE -eq 0) {
    $graphifySucceeded = $true
}

if (-not $graphifySucceeded) {
    Invoke-Graphify -Arguments @(".", "--update")
    if ($LASTEXITCODE -eq 0) {
        $graphifySucceeded = $true
    }
}

if (-not $graphifySucceeded) {
    Invoke-Graphify -Arguments @(".")
    if ($LASTEXITCODE -eq 0) {
        $graphifySucceeded = $true
    }
}

if (-not $graphifySucceeded) {
    throw "Graphify step failed."
}

$graphifyReport = Join-Path $projectRoot "graphify-out/GRAPH_REPORT.md"
if (-not (Test-Path $graphifyReport)) {
    throw "Graphify finished but graphify-out/GRAPH_REPORT.md was not found."
}
Copy-Item $graphifyReport $graphifyOut -Force

Write-Section "3) SQLLineage"
Ensure-PythonPackage "sqllineage" "sqllineage"

$sqlCandidates = @()
$sqlCandidates += Get-ChildItem -Path (Join-Path $projectRoot "dataconnect/schema") -Recurse -File -Include *.sql,*.gql -ErrorAction SilentlyContinue
$sqlCandidates += Get-ChildItem -Path (Join-Path $projectRoot "dataconnect/main") -Recurse -File -Include *.sql,*.gql -ErrorAction SilentlyContinue
$sqlCandidates = @($sqlCandidates | Sort-Object FullName -Unique)

if ($sqlCandidates.Count -eq 0) {
    "No SQL or GQL files were found under dataconnect/schema or dataconnect/main." | Set-Content -Path $sqlOut -Encoding utf8
} else {
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("SQLLineage report generated at $(Get-Date -Format s)")
    $lines.Add("Files analyzed: $($sqlCandidates.Count)")
    $lines.Add("")

    foreach ($file in $sqlCandidates) {
        $lines.Add(("=" * 100))
        $lines.Add("FILE: $($file.FullName)")
        $lines.Add(("-" * 100))

        $output = Invoke-SQLLineage -Arguments @("-f", $file.FullName, "-v") 2>&1
        if ($LASTEXITCODE -eq 0) {
            foreach ($row in $output) {
                $lines.Add([string]$row)
            }
        } else {
            $lines.Add("Lineage parse failed for this file.")
            foreach ($row in $output) {
                $lines.Add([string]$row)
            }
        }
        $lines.Add("")
    }

    Set-Content -Path $sqlOut -Value $lines -Encoding utf8
}

Write-Section "4) MarkItDown"
Ensure-PythonPackage "markitdown" "markitdown"

$unstructuredPatterns = @("*.pdf", "*.doc", "*.docx", "*.ppt", "*.pptx", "*.xls", "*.xlsx", "*.html", "*.htm", "*.xml", "*.csv", "*.json")
$docCandidates = @()
foreach ($pattern in $unstructuredPatterns) {
    $docCandidates += Get-ChildItem -Path (Join-Path $projectRoot "docs") -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue
}

$docCandidates = @($docCandidates | Sort-Object FullName -Unique)

if ($docCandidates.Count -eq 0) {
    "SKIPPED: no unstructured files found under docs/ for MarkItDown conversion." | Set-Content -Path $markitdownOut -Encoding utf8
} else {
    $firstDoc = $docCandidates[0]
    Invoke-MarkItDown -Arguments @($firstDoc.FullName, "-o", $markitdownOut)
    if ($LASTEXITCODE -ne 0) {
        throw "MarkItDown failed for file: $($firstDoc.FullName)"
    }
}

Write-Section "Final Verification"
$artifacts = @(
    @{ Name = "Repomix"; Path = $repomixOut },
    @{ Name = "Graphify"; Path = $graphifyOut },
    @{ Name = "SQLLineage"; Path = $sqlOut },
    @{ Name = "MarkItDown"; Path = $markitdownOut }
)

$results = foreach ($a in $artifacts) {
    [PSCustomObject]@{
        Step = $a.Name
        Exists = Test-Path $a.Path
        SizeBytes = if (Test-Path $a.Path) { (Get-Item $a.Path).Length } else { 0 }
        File = $a.Path
    }
}

$results | Format-Table -AutoSize

$missing = @($results | Where-Object { -not $_.Exists })
if ($missing.Count -gt 0) {
    throw "One or more output artifacts are missing."
}

Write-Host ""
Write-Host "All bundle tasks completed successfully." -ForegroundColor Green