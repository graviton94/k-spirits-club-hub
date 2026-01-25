# Run Pipeline Sequence
$python = "c:\k-spirits-club-hub\.venv\Scripts\python.exe"
$script = "scripts/run_pipeline.py"

Write-Host "🚀 Starting Sequential Pipeline Run..." -ForegroundColor Cyan

# 1. Whisky
Write-Host "`n🥃 Processing Whisky (100 items)..." -ForegroundColor Yellow
& $python $script --source "data/raw_imported/imported_위스키.json" --limit 100
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Whisky Failed"; exit 1 }

# 2. Fruit Wine
Write-Host "`n🍇 Processing Fruit Wine (100 items)..." -ForegroundColor Yellow
& $python $script --source "data/raw_imported/imported_과실주.json" --limit 100
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Fruit Wine Failed"; exit 1 }

# 3. Soju (Targeting spirits_소주.json as requested)
# Note: Checking if file exists in data/ or data/raw_imported/ logic implies providing relative path
Write-Host "`n🍶 Processing Soju (100 items)..." -ForegroundColor Yellow
if (Test-Path "data/spirits_소주.json") {
    & $python $script --source "data/spirits_소주.json" --limit 100
} else {
    Write-Host "⚠️ 'data/spirits_소주.json' not found, trying 'data/raw_imported/imported_소주.json'..."
    & $python $script --source "data/raw_imported/imported_소주.json" --limit 100
}
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Soju Failed"; exit 1 }

# 4. General Spirits (Targeting spirits_일반증류주.json as requested)
Write-Host "`n🏺 Processing General Spirits (100 items)..." -ForegroundColor Yellow
if (Test-Path "data/spirits_일반증류주.json") {
    & $python $script --source "data/spirits_일반증류주.json" --limit 100
} else {
     Write-Host "⚠️ 'data/spirits_일반증류주.json' not found, trying 'data/raw_imported/imported_일반증류주.json'..."
    & $python $script --source "data/raw_imported/imported_일반증류주.json" --limit 100
}
if ($LASTEXITCODE -ne 0) { Write-Host "❌ General Spirits Failed"; exit 1 }

Write-Host "`n✅ All Sequence Completed!" -ForegroundColor Green
