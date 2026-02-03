
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';

// Load env vars explicitly
console.log('Loading .env...');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin SDK Initialization
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
        throw new Error('Missing Firebase Admin credentials in .env');
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
    console.log('🔥 Firebase Admin Initialized.');
}

const db = admin.firestore();
const geminiKey = process.env.GEMINI_API_KEY;

console.log('Environment Check:');
console.log(`- GEMINI_API_KEY: ${geminiKey ? 'OK' : 'MISSING'}`);

// Delay helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// N-gram generator (Custom min length)
function generateNgramKeywords(text: string, minLength: number = 2): string[] {
    if (!text) return [];
    const normalized = text.toLowerCase().replace(/\s+/g, '');
    const keywords: Set<string> = new Set();

    for (let i = 0; i < normalized.length; i++) {
        for (let j = i + minLength; j <= normalized.length; j++) {
            keywords.add(normalized.substring(i, j));
        }
    }
    return Array.from(keywords);
}

async function theGreatMigration() {
    // Dynamic import for AI function only (DB connection is handled above)
    const { enrichSpiritWithAI } = await import('../lib/services/gemini-translation');
    type SpiritEnrichmentInput = import('../lib/services/gemini-translation').SpiritEnrichmentInput;

    console.log(`\n============== THE GREAT MIGRATION (ADMIN SDK) ==============`);
    console.log(`Loading all PUBLISHED spirits...`);

    const snapshot = await db.collection('spirits').where('status', '==', 'PUBLISHED').get();
    const allSpirits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    console.log(`✅ Total Published Spirits: ${allSpirits.length}`);
    console.log(`Policy: 3 seconds delay per CALL. (Avoid 429 Error)`);
    console.log(`Action: AI Enrich -> Schema Relocation -> Hard Cleanup (Delete)\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 15; i < allSpirits.length; i++) {
        const spirit = allSpirits[i];
        const currentCount = i + 1;
        const total = allSpirits.length;

        console.log(`[${currentCount}/${total}] Migrating: ${spirit.name} (${spirit.id})`);

        try {
            // 1. AI ENRICHMENT
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

            // 2. SEARCH OPTIMIZATION
            // Independent N-gram generation without merging strings
            const keywordSet = new Set<string>();

            // Name (KO): Min 2 chars
            if (spirit.name) {
                generateNgramKeywords(spirit.name, 2).forEach(k => keywordSet.add(k));
            }
            // Name (EN): Min 3 chars
            if (result.name_en) {
                generateNgramKeywords(result.name_en, 3).forEach(k => keywordSet.add(k));
            }
            // Distillery: Min 2 chars
            if (spirit.distillery) {
                generateNgramKeywords(spirit.distillery, 2).forEach(k => keywordSet.add(k));
            }

            const searchKeywords = Array.from(keywordSet);

            // 3. PREPARE CLEAN METADATA
            // We will REPLACE the metadata object entirely or carefully construct it.
            // But since we want to delete fields from deep nested objects, using Dot Notation is better for atomic updates.
            // HOWEVER, to ensure 'metadata' is clean, let's READ it, MODIFY it locally, and overwrite it.

            const cleanMetadata = {
                ...(spirit.metadata || {}),
                // New Location for Text
                description_ko: result.description_ko,
                description_en: result.description_en,
                pairing_guide_ko: result.pairing_guide_ko,
                pairing_guide_en: result.pairing_guide_en,
                enriched_at: new Date().toISOString()
            };

            // Delete unwanted keys from local metadata object
            delete cleanMetadata.name_en;
            delete cleanMetadata.tasting_note;
            delete cleanMetadata.nose_tags;
            delete cleanMetadata.palate_tags;
            delete cleanMetadata.finish_tags;

            // 4. CONSTRUCT UPDATE PAYLOAD WITH DELETES
            const updatePayload: any = {
                // Root fields (Upsert/Merge)
                name_en: result.name_en,
                tasting_note: result.tasting_note,
                searchKeywords: searchKeywords,

                // [MOVED] Tags to ROOT
                nose_tags: result.nose_tags,
                palate_tags: result.palate_tags,
                finish_tags: result.finish_tags,

                // Overwrite Metadata with Clean Version
                metadata: cleanMetadata,

                // [DELETE] Redundant Root Fields
                description: admin.firestore.FieldValue.delete(),
                description_ko: admin.firestore.FieldValue.delete(),
                description_en: admin.firestore.FieldValue.delete(),
                pairing_guide_ko: admin.firestore.FieldValue.delete(),
                pairing_guide_en: admin.firestore.FieldValue.delete(),
            };

            // 5. EXECUTE DB UPDATE
            // Need to ignore undefined values in payload if any (Firestore throws on undefined)
            // JSON.parse(JSON.stringify) is a cheap way to remove undefined, but FieldValue.delete() is an object/class, it might be lost.
            // Typescript prevents undefined nicely usually.

            await db.collection('spirits').doc(spirit.id).update(updatePayload);

            console.log(`   ✅ Complete (${duration}s) | Tags: ${result.nose_tags.length}`);
            successCount++;

        } catch (e: any) {
            console.error(`   ❌ Failed: ${e.message}`);
            failCount++;

            // Retry Logic immediately for 429
            if (e.message.includes('429')) {
                console.log('   ⚠️ Rate Limited. Pausing for 120s and retrying...');
                await sleep(120000);
                i--; // Retry this index
                continue;
            }
        }

        // Buffer
        if (i < allSpirits.length - 1) {
            process.stdout.write('   ⏳ Cooling down (20s)... ');
            await sleep(20000); // 20 Seconds Safety Buffer
            console.log('Next.');
        }
    }

    console.log(`\n=============================================================`);
    console.log(`🎉 MIGRATION COMPLETE.`);
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Failed: ${failCount}`);
}

theGreatMigration().catch(e => console.error("Fatal Error:", e));
