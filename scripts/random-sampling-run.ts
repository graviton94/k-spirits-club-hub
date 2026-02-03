
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars explicitly
console.log('Loading .env...');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const geminiKey = process.env.GEMINI_API_KEY;

console.log('Environment Check:');
console.log(`- FIREBASE_PROJECT_ID: ${projectId ? 'OK (' + projectId + ')' : 'MISSING'}`);
console.log(`- GEMINI_API_KEY: ${geminiKey ? 'OK (Starts with ' + geminiKey.substring(0, 4) + '...)' : 'MISSING'}`);

async function randomSamplingRun() {
    // Dynamic import to ensure env vars are loaded first
    const { spiritsDb } = await import('../lib/db/firestore-rest');
    const { enrichSpiritWithAI } = await import('../lib/services/gemini-translation');
    type SpiritEnrichmentInput = import('../lib/services/gemini-translation').SpiritEnrichmentInput;

    const SAMPLE_SIZE = 10; // Adjust the sample size as needed

    console.log(`\nFetching all published spirits...`);
    const allSpirits = await spiritsDb.getAll({
        status: 'PUBLISHED'
    });

    console.log(`✅ Total Published Spirits: ${allSpirits.length}`);

    if (allSpirits.length === 0) {
        console.error('No published spirits found to sample.');
        return;
    }

    // Random Sampling
    const shuffled = allSpirits.sort(() => 0.5 - Math.random());
    const selectedSpirits = shuffled.slice(0, SAMPLE_SIZE);

    console.log(`🎲 Selected ${selectedSpirits.length} spirits for random sampling:`);
    selectedSpirits.forEach(s => console.log(`   - ${s.name} (${s.id})`));

    // Ensure output directory exists
    const outputDir = 'random_sampling_results';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    for (const spirit of selectedSpirits) {
        console.log(`\n=============================================================`);
        console.log(`Processing Spirit: ${spirit.name} (${spirit.id})`);

        try {
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

            // Save Result
            const filename = path.join(outputDir, `result_${spirit.id}.json`);
            fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
            console.log(`✅ Saved result to ${filename}`);

            // Optional: Update Database (Dry Run mode usually doesn't update, but if you want to apply changes, uncomment below)
            /*
            await spiritsDb.update(spirit.id, {
                 name_en: result.name_en,
                 description_ko: result.description_ko,
                 description_en: result.description_en,
                 metadata: {
                     ...spirit.metadata,
                     nose_tags: result.nose_tags,
                     palate_tags: result.palate_tags,
                     finish_tags: result.finish_tags,
                     pairing_guide_en: result.pairing_guide_en,
                     pairing_guide_ko: result.pairing_guide_ko
                 }
            });
            console.log(`💾 Database Updated for ${spirit.name}`);
            */

        } catch (error: any) {
            console.error(`❌ Error processing ${spirit.id}:`);
            console.error(error?.message || error);
        }
    }
}

randomSamplingRun().catch(e => console.error("Fatal Error:", e));
