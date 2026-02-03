
import dotenv from 'dotenv';
import path from 'path';

// Load env vars explicitly
console.log('Loading .env...');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const geminiKey = process.env.GEMINI_API_KEY;

console.log('Environment Check:');
console.log(`- FIREBASE_PROJECT_ID: ${projectId ? 'OK (' + projectId + ')' : 'MISSING'}`);
console.log(`- GEMINI_API_KEY: ${geminiKey ? 'OK (Starts with ' + geminiKey.substring(0, 4) + '...)' : 'MISSING'}`);

// Delay helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function enrichPoorQualitySpirits() {
    // Dynamic import
    const { spiritsDb } = await import('../lib/db/firestore-rest');
    const { enrichSpiritWithAI } = await import('../lib/services/gemini-translation');
    type SpiritEnrichmentInput = import('../lib/services/gemini-translation').SpiritEnrichmentInput;

    console.log(`\nFetching all published spirits...`);
    const allSpirits = await spiritsDb.getAll({
        status: 'PUBLISHED'
    });

    console.log(`✅ Total Published Spirits: ${allSpirits.length}`);

    // Filter Logic: Nose tags < 4
    const targets = allSpirits.filter(spirit => {
        const noseTags = spirit.metadata?.nose_tags || [];
        return noseTags.length < 4;
    });

    console.log(`🎯 Found ${targets.length} spirits with inadequate nose tags (< 4).`);

    if (targets.length === 0) {
        console.log('No spirits need enrichment. Exiting.');
        return;
    }

    console.log(`\nStarting Batch Enrichment for ${targets.length} items...`);
    console.log(`Policy: 2 seconds delay between calls to simulate human pace and avoid Rate Limits.\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < targets.length; i++) {
        const spirit = targets[i];
        const currentCount = i + 1;
        const total = targets.length;

        console.log(`[${currentCount}/${total}] Processing: ${spirit.name} (${spirit.id})`);

        try {
            // Prepare input
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

            const startTime = Date.now();
            const result = await enrichSpiritWithAI(input);
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);

            // Update Database using upsert (which performs a PATCH deep merge)
            await spiritsDb.upsert(spirit.id, {
                ...spirit,
                name_en: result.name_en,
                description_ko: result.description_ko,
                description_en: result.description_en,
                pairing_guide_ko: result.pairing_guide_ko,
                pairing_guide_en: result.pairing_guide_en,
                metadata: {
                    ...spirit.metadata,
                    nose_tags: result.nose_tags,
                    palate_tags: result.palate_tags,
                    finish_tags: result.finish_tags,
                    pairing_guide_en: result.pairing_guide_en,
                    pairing_guide_ko: result.pairing_guide_ko,
                    enriched_at: new Date().toISOString() // Track when this happened
                }
            });

            console.log(`   ✅ Enriched & Saved (${duration}s) | Nose Tags: ${result.nose_tags.length}`);
            successCount++;

        } catch (error: any) {
            console.error(`   ❌ Failed: ${error?.message || 'Unknown error'}`);
            failCount++;
        }

        // Buffer Time: 2000ms delay between calls
        if (i < targets.length - 1) {
            process.stdout.write('   ⏳ Cooling down (10s)... ');
            await sleep(10000);
            console.log('Next.');
        }
    }

    console.log(`\n=============================================================`);
    console.log(`🎉 Job Complete.`);
    console.log(`   - Total Processed: ${targets.length}`);
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Failed: ${failCount}`);
}

enrichPoorQualitySpirits().catch(e => console.error("Fatal Error:", e));
