const fs = require('fs');
const cp = require('child_process');
const path = require('path');

function loadSecretsEnv() {
  const src = fs.readFileSync('scripts/vault/set_secrets.js', 'utf8');
  const match = src.match(/const variables = (\{[\s\S]*?\n\});/);
  if (!match) throw new Error('variables object not found in scripts/vault/set_secrets.js');
  const vars = Function('return ' + match[1])();
  return { ...process.env, ...vars };
}

function main() {
  const reportPath = process.argv[2] || 'output/firestore-tag-migration-2026-05-03T06-27-11-994Z.json';
  const batchSize = Number(process.argv[3] || 500);

  const env = loadSecretsEnv();
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const ids = (report.changes || []).map((c) => c.id).filter(Boolean);

  if (!ids.length) {
    throw new Error('No candidate ids found in report: ' + reportPath);
  }

  const stamp = new Date().toISOString().replace(/[\:\.]/g, '-');
  const batchDir = path.join('output', 'migration-batches-' + stamp);
  fs.mkdirSync(batchDir, { recursive: true });

  const totalBatches = Math.ceil(ids.length / batchSize);
  const summary = {
    reportPath,
    totalCandidates: ids.length,
    batchSize,
    totalBatches,
    startedAt: new Date().toISOString(),
    batches: [],
  };

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchNo = Math.floor(i / batchSize) + 1;
    const slice = ids.slice(i, i + batchSize);
    const idsFile = path.join(batchDir, `ids-batch-${String(batchNo).padStart(3, '0')}.json`);
    fs.writeFileSync(idsFile, JSON.stringify({ ids: slice }, null, 2));

    console.log(`\n=== BATCH ${batchNo}/${totalBatches} size=${slice.length} ===`);
    const result = cp.spawnSync(
      'npx',
      ['tsx', 'scripts/migrate-firestore-tags-to-dataconnect.ts', '--apply', `--ids-file=${idsFile}`],
      { stdio: 'inherit', env, shell: true }
    );

    summary.batches.push({
      batchNo,
      size: slice.length,
      idsFile,
      exitCode: result.status,
    });

    if (result.status !== 0) {
      console.error(`Batch ${batchNo} failed with exit code ${result.status}`);
    }
  }

  summary.finishedAt = new Date().toISOString();
  summary.succeededBatches = summary.batches.filter((b) => b.exitCode === 0).length;
  summary.failedBatches = summary.batches.filter((b) => b.exitCode !== 0).length;

  const summaryPath = path.join(batchDir, 'batch-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('\n=== ALL BATCHES COMPLETED ===');
  console.log('summary:', summaryPath);

  process.exit(summary.failedBatches > 0 ? 2 : 0);
}

try {
  main();
} catch (error) {
  console.error('[run-migration-batches] Fatal:', error.message || error);
  process.exit(1);
}
