
const API_BASE = 'http://localhost:3000';
const BATCH_SIZE = 1; // Ultra-safe mode: 1 item per request

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Batch Process ALL Published Spirits (AI + Norm)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        // 1. Fetch all PUBLISHED spirits IDs
        console.log('📡 Fetching list of published spirits...');

        let allIds: string[] = [];
        let page = 1;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
            const res = await fetch(`${API_BASE}/api/admin/spirits?status=PUBLISHED&page=${page}&pageSize=${pageSize}`);
            if (!res.ok) throw new Error(`Failed to fetch spirits: ${res.statusText}`);

            const data: any = await res.json();
            const ids = data.data.map((s: any) => s.id);
            allIds = [...allIds, ...ids];

            console.log(`   Fetched Page ${page}: ${ids.length} items`);

            if (ids.length < pageSize) hasMore = false;
            page++;
        }

        console.log(`\n📋 Target Count: ${allIds.length} spirits`);
        if (allIds.length === 0) {
            console.log('⚠️ No published spirits found. Exiting.');
            return;
        }

        const confirm = true; // Auto-confirm for script
        console.log(`\n⚙️  Processing in batches of ${BATCH_SIZE}...\n`);

        // 2. Process in batches
        let processed = 0;
        let successes = 0;
        let failures = 0;
        const totalBatches = Math.ceil(allIds.length / BATCH_SIZE);

        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
            const batch = allIds.slice(i, i + BATCH_SIZE);
            const batchNum = Math.floor(i / BATCH_SIZE) + 1;

            process.stdout.write(`⏳ Batch ${batchNum}/${totalBatches} (${batch.length} items)... `);

            try {
                const res = await fetch(`${API_BASE}/api/admin/spirits/bulk-patch`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        spiritIds: batch,
                        enrich: true,
                        normalize: true,
                        updates: {
                            // No status change, just update content
                            updatedAt: new Date().toISOString()
                        }
                    })
                });

                if (res.ok) {
                    const result: any = await res.json();
                    successes += result.updatedCount || 0;
                    console.log(`✅ OK (${result.enrichedCount} enriched)`);
                    if (result.enrichmentErrors && result.enrichmentErrors.length > 0) {
                        console.log('   ⚠️ Enrichment Errors:');
                        result.enrichmentErrors.slice(0, 3).forEach((e: any) => console.log(`      - ${e.id}: ${e.error}`));
                        if (result.enrichmentErrors.length > 3) console.log(`      ... and ${result.enrichmentErrors.length - 3} more`);
                    }
                } else {
                    failures += batch.length;
                    console.log(`❌ Failed: ${res.status} ${res.statusText}`);
                }
            } catch (err: any) {
                failures += batch.length;
                console.log(`❌ Error: ${err.message}`);
            }

            processed += batch.length;
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 processing Complete');
        console.log(`Total: ${allIds.length}`);
        console.log(`Success: ${successes}`);
        console.log(`Failed: ${failures}`);

    } catch (error) {
        console.error('\n❌ Fatal Error:', error);
    }
}

main();
