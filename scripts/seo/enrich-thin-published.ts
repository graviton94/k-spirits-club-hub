import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env', override: false });
process.env.FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'k-spirits-club';

// Delay helper to avoid hitting Gemini API rate limits
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runEnrichment() {
    console.log('🚀 Starting Thin Content (Tier B) Rescue Operation...');

    // Import required modules
    const { getPublishedSpiritMetaWithQuality, spiritsDb } = await import('../../lib/db/firestore-rest');
    // We only need the Sensory/Descriptions to bypass the thin content filters effectively,
    // but enrichSpiritWithAI is comprehensive. We will use enrichSpiritWithAI to truly boost to Tier A.
    const { enrichSpiritWithAI } = await import('../../lib/services/gemini-translation');

    console.log('🔍 Fetching all published spirits from Firestore...');
    const allMeta = await getPublishedSpiritMetaWithQuality();

    // Replicate the isIndexableSpiritMeta logic from sitemap.ts
    const thinSpirits = allMeta.filter(spirit => {
        const hasName = !!spirit.name;
        const hasAbv = typeof spirit.abv === 'number';
        const hasCategory = !!spirit.category;
        const hasImage = !!(spirit.imageUrl || spirit.thumbnailUrl);

        const qualitySignalCount = [
            hasImage,
            spirit.descriptionKoLength >= 160 || spirit.descriptionEnLength >= 160,
            spirit.pairingKoLength >= 120 || spirit.pairingEnLength >= 120,
            spirit.tastingNoteLength >= 24 || spirit.sensoryTagCount >= 4,
        ].filter(Boolean).length;

        const isTierA = hasName && hasAbv && hasCategory && qualitySignalCount >= 2;
        return !isTierA; // Find the ones that failed (Tier B)
    });

    console.log(`📊 Found ${thinSpirits.length} Thin Content (Tier B) spirits that are published but NOT indexing.`);

    if (thinSpirits.length === 0) {
        console.log('✅ All published spirits are officially Tier A. No rescue needed!');
        return;
    }

    console.log('======================================================');
    console.log('⚠️ WARNING: This will call Gemini API and update Firestore.');
    console.log('Press Ctrl+C to abort, or wait 5 seconds to proceed...');
    console.log('======================================================');
    await delay(5000);

    let successCount = 0;
    let failCount = 0;

    for (const [index, spiritMeta] of thinSpirits.entries()) {
        console.log(`\n[${index + 1}/${thinSpirits.length}] 🩺 Rescuing: ${spiritMeta.name} (ID: ${spiritMeta.id})`);

        try {
            // First, fetch the full spirit data from DB
            const fullSpirit = await spiritsDb.getById(spiritMeta.id);
            if (!fullSpirit) {
                console.error(`❌ Could not find full DB document for ID: ${spiritMeta.id}`);
                failCount++;
                continue;
            }

            // Map it to SpiritEnrichmentInput format
            const inputPayload = {
                name: fullSpirit.name,
                category: fullSpirit.category || 'Unknown',
                subcategory: fullSpirit.subcategory,
                distillery: fullSpirit.distillery,
                abv: fullSpirit.abv,
                region: fullSpirit.region,
                country: fullSpirit.country,
                name_en: fullSpirit.name_en,
                description_en: fullSpirit.description_en,
                description_ko: fullSpirit.description_ko,
                nose_tags: fullSpirit.nose_tags,
                palate_tags: fullSpirit.palate_tags,
                finish_tags: fullSpirit.finish_tags,
                metadata: fullSpirit.metadata
            };

            console.log('🤖 Requesting Gemini Enrichment...');
            const enrichedData = await enrichSpiritWithAI(inputPayload as any);

            // Merge metadata properly
            const updatedMetadata = {
                ...fullSpirit.metadata,
                tasting_note: enrichedData.tasting_note || fullSpirit.metadata?.tasting_note || '',
                description_ko: enrichedData.description_ko || fullSpirit.metadata?.description_ko || '',
                description_en: enrichedData.description_en || fullSpirit.metadata?.description_en || '',
                pairing_guide_ko: enrichedData.pairing_guide_ko || fullSpirit.metadata?.pairing_guide_ko || '',
                pairing_guide_en: enrichedData.pairing_guide_en || fullSpirit.metadata?.pairing_guide_en || ''
            };

            const updatePayload = {
                ...enrichedData,
                metadata: updatedMetadata,
                isPublished: true // Ensure it stays published
            };

            // Ensure we don't accidentally overwrite the ID
            delete updatePayload.id;

            console.log('💾 Saving enriched data to Firestore...');
            await spiritsDb.upsert(fullSpirit.id, updatePayload);

            console.log(`✅ Successfully boosted ${fullSpirit.name} to Tier A!`);
            successCount++;

            // Wait 5 seconds to avoid rate limiting
            await delay(5000);

        } catch (error: any) {
            console.error(`❌ Failed to enrich ${spiritMeta.name}: ${error.message}`);
            failCount++;
        }
    }

    console.log('\n🎉 Rescue Operation Complete!');
    console.log(`Total Successful: ${successCount}`);
    console.log(`Total Failed: ${failCount}`);
    if (successCount > 0) {
        console.log('💡 Note: Google Search Console will automatically discover the upgraded pages via the dynamic Sitemap on its next crawl cycle.');
    }
}

runEnrichment().catch(console.error);
