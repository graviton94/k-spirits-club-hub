# K-Spirits Reorientation Script
# Usage: .\bin\reorient.ps1

Write-Host "🚀 Starting AI Reorientation Pipeline..." -ForegroundColor Cyan

# 1. Context Bundling (Repomix)
Write-Host "📦 Packing Codebase with Repomix (Compressed)..." -ForegroundColor Yellow
npx -y repomix@latest --compress --output ai_improvement_machine/reports/context_bundle.xml

# 2. Structural Analysis (Graphify)
Write-Host "📊 Refreshing Knowledge Graph with Graphify..." -ForegroundColor Yellow
# Run graphify silently to update report
graphify --update --no-viz

# 3. Memory Consolidation
Write-Host "🧠 Consolidating Session Memory..." -ForegroundColor Yellow
$latest_report = Get-Content graphify-out/GRAPH_REPORT.md -Raw
$session_log = Get-Content ai_improvement_machine/logs/SESSION_LOG.md -Raw
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$final_context = @"
# PROJECT REORIENTATION SNAPSHOT ($timestamp)

## 📍 Structural Map (Graphify)
$latest_report

## 🧠 Recent Memory (Session Log)
$session_log

## 📦 Context Manifest
Repomix Bundle updated at ai_improvement_machine/reports/context_bundle.xml
"@

Set-Content -Path ai_improvement_machine/reports/LATEST_REORIENTATION.md -Value $final_context

Write-Host "✅ Reorientation Complete. Read reports/LATEST_REORIENTATION.md to get started." -ForegroundColor Green
