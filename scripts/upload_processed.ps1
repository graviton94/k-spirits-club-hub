# Upload All Processed Batches
$node_exe = "node"
$script = "scripts/migrate_to_firestore.js"
$batch_dir = "data/processed_batches"

if (-not (Test-Path $batch_dir)) {
    Write-Host "❌ Directory not found: $batch_dir" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem -Path $batch_dir -Filter "*.json"

if ($files.Count -eq 0) {
    Write-Host "⚠️ No processed batch files found in $batch_dir" -ForegroundColor Yellow
    exit
}

Write-Host "🚀 Found $($files.Count) batch files. Starting upload..." -ForegroundColor Cyan

foreach ($file in $files) {
    Write-Host "`n📦 Uploading $($file.Name)..." -ForegroundColor Yellow
    & $node_exe $script --file $file.FullName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to upload $($file.Name)" -ForegroundColor Red
        # Optional: Continue or Exit? Let's continue.
    }
    else {
        Write-Host "✅ Uploaded $($file.Name)" -ForegroundColor Green
        # Optional: Move to 'uploaded' folder?
        # For safety, we keep them here. The migration script has valid-dupe checks (deduplication by ID) usually?
        # Checking migration script... yes, checks deduplicate by ID map, but log skipping is based on ID log.
    }
}

Write-Host "`n🎉 All Uploads Completed!" -ForegroundColor Green
