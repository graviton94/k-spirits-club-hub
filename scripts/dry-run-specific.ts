
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars explicitly
console.log('Loading .env...');
// Load .env first as it contains the server-side keys
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const geminiKey = process.env.GEMINI_API_KEY;

console.log('Environment Check:');
console.log(`- FIREBASE_PROJECT_ID: ${projectId ? 'OK (' + projectId + ')' : 'MISSING'}`);
console.log(`- GEMINI_API_KEY: ${geminiKey ? 'OK (Starts with ' + geminiKey.substring(0, 4) + '...)' : 'MISSING'}`);

async function dryRun() {
    // Dynamic import to ensure env vars are loaded first
    const { spiritsDb } = await import('../lib/db/firestore-rest');
    const { enrichSpiritWithAI } = await import('../lib/services/gemini-translation');
    // Import type separately or just use 'any' if strictly needed for dynamic import limitations
    type SpiritEnrichmentInput = import('../lib/services/gemini-translation').SpiritEnrichmentInput;

    const targetIds = [
        'fsk-201300202477',
        'fsk-201400200622',
        'mfds-202500068857',
        'mfds-202500079407',
        'mfds-202500112227',
        'mfds-202500163898',
        'fsk-2013001905430',
        'fsk-201300190487'
    ];

    console.log(`\nStarting Dry Run for ${targetIds.length} spirits...`);

    for (const id of targetIds) {
        console.log(`\n=============================================================`);
        console.log(`Fetching Spirit ID: ${id}`);

        try {
            const spirit = await spiritsDb.getById(id);

            if (!spirit) {
                console.error(`❌ Spirit ${id} not found in Firestore.`);
                continue;
            }

            console.log(`✅ Found: ${spirit.name} (${spirit.category})`);
            console.log(`   Distillery: ${spirit.distillery}`);
            console.log(`   Region: ${spirit.region}, ${spirit.country}`);

            // Prepare input for enrichment
            const input: SpiritEnrichmentInput = {
                name: spirit.name,
                category: spirit.category,
                subcategory: spirit.subcategory || undefined,
                distillery: spirit.distillery || undefined,
                abv: spirit.abv,
                region: spirit.region || undefined,
                country: spirit.country || undefined,
                description_en: spirit.description_en || undefined,
                metadata: spirit.metadata
            };

            console.log(`🤖 Running AI Enrichment...`);
            const startTime = Date.now();
            const result = await enrichSpiritWithAI(input);
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);

            console.log(`✨ AI Enrichment Complete in ${duration}s!`);

            // Write individual result to file for inspection
            const filename = `dry_run_result_${id}.json`;
            fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
            console.log(`✅ Saved result to ${filename}`);

            console.log(`\n--- ENRICHMENT RESULT FOR ${spirit.name} ---`);
            console.log(JSON.stringify(result, null, 2));

        } catch (error: any) {
            console.error(`❌ Error processing ${id}:`);
            console.error(error?.message || error);
        }
    }
}

dryRun().catch(e => console.error("Fatal Error:", e));
