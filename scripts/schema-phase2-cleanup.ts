
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Admin SDK Initialization
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
    console.log('🔥 Firebase Admin Initialized.');
}

const db = admin.firestore();

async function structuralMigration() {
    console.log(`\n============== SCHEMA PHASE 2: STRUCTURAL MIGRATION ==============`);
    console.log(`Target: Everything EXCEPT currently processing PUBLISHED data.`);

    // We target UNPUBLISHED, DRAFT, MODIFICATION_REQUEST, etc.
    // Or just fetch all and filter locally for safety.
    const snapshot = await db.collection('spirits').get();
    const allSpirits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    console.log(`✅ Total Spirits in DB: ${allSpirits.length}`);

    let successCount = 0;

    for (const spirit of allSpirits) {
        // Skip if it's likely being handled by the AI script right now (PUBLISHED)
        // OR if it's already in the new schema (optional check)
        if (spirit.status === 'PUBLISHED') continue;

        console.log(`Migrating Structurally: ${spirit.name} (${spirit.id}) [${spirit.status}]`);

        try {
            const metadata = spirit.metadata || {};

            // 1. Move Descriptions/Pairings to Metadata (if they exist at root)
            const description_ko = spirit.description_ko || spirit.description || metadata.description_ko || metadata.description || "";
            const description_en = spirit.description_en || metadata.description_en || "";
            const pairing_guide_ko = spirit.pairing_guide_ko || metadata.pairing_guide_ko || "";
            const pairing_guide_en = spirit.pairing_guide_en || metadata.pairing_guide_en || "";

            // 2. Move Tags/Notes to Root (if they exist in metadata)
            const nose_tags = spirit.nose_tags || metadata.nose_tags || [];
            const palate_tags = spirit.palate_tags || metadata.palate_tags || [];
            const finish_tags = spirit.finish_tags || metadata.finish_tags || [];
            const tasting_note = spirit.tasting_note || spirit.metadata?.tasting_note || "";

            const cleanMetadata = {
                ...metadata,
                description_ko,
                description_en,
                pairing_guide_ko,
                pairing_guide_en,
                // Remove legacy keys from metadata
                name_en: metadata.name_en || spirit.name_en || null
            };

            // Remove relocated items from metadata
            delete (cleanMetadata as any).nose_tags;
            delete (cleanMetadata as any).palate_tags;
            delete (cleanMetadata as any).finish_tags;
            delete (cleanMetadata as any).tasting_note;
            delete (cleanMetadata as any).description; // Legacy flat key

            const updatePayload: any = {
                // Root fields
                nose_tags,
                palate_tags,
                finish_tags,
                tasting_note,
                name_en: cleanMetadata.name_en,

                // Metadata
                metadata: cleanMetadata,

                // Cleanup Root Legacy
                description: admin.firestore.FieldValue.delete(),
                description_ko: admin.firestore.FieldValue.delete(),
                description_en: admin.firestore.FieldValue.delete(),
                pairing_guide_ko: admin.firestore.FieldValue.delete(),
                pairing_guide_en: admin.firestore.FieldValue.delete(),
            };

            await db.collection('spirits').doc(spirit.id).update(updatePayload);
            successCount++;

        } catch (e: any) {
            console.error(`   ❌ Failed: ${spirit.id} - ${e.message}`);
        }
    }

    console.log(`\n=============================================================`);
    console.log(`🎉 PHASE 2 STRUCTURAL MIGRATION COMPLETE.`);
    console.log(`   - Successfully Realigned: ${successCount}`);
}

structuralMigration().catch(console.error);
