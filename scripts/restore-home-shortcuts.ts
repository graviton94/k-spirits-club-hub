import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getDataConnect } from 'firebase-admin/data-connect';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'k-spirits-club',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const APP_ID = 'k-spirits-club-hub';

async function executeMutation(name: string, variables: any) {
  const dataConnect = getDataConnect({
    serviceId: 'k-spirits-club-hub',
    location: 'asia-northeast3',
    connector: 'main'
  });
  await dataConnect.executeMutation(name, variables);
}

async function restoreShortcuts() {
    console.log("🚀 RESTORING HOME SCREEN SHORTCUTS (NEW ARRIVALS) 🚀");
    
    const legacyNARef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('new_arrivals');
    const naSnap = await legacyNARef.get();
    
    console.log(`Found ${naSnap.size} legacy snapshots to process.`);

    for (const doc of naSnap.docs) {
        const d = doc.data();
        const spiritId = String(d.id || d.spiritId);
        const displayOrder = parseInt(doc.id, 10) || 0;

        console.log(`  > Processing [Order: ${displayOrder}] Spirit: ${spiritId}...`);

        // 1. Sync potentially "newer" data from snapshot back to Spirit root
        // The user pointed out that new_arrivals holds the "Admin Published" version.
        const corrections = d.corrections || {};
        const meta = d.metadata || {};

        const spiritUpdatePayload = {
            id: spiritId,
            name: d.name || 'Unnamed',
            nameEn: d.name_en || null,
            category: d.category || 'Unknown',
            imageUrl: d.imageUrl || d.thumbnail_url || 'https://placehold.co/400',
            descriptionKo: corrections.description_ko || d.description_ko || null,
            descriptionEn: corrections.description_en || d.description_en || null,
            pairingGuideKo: corrections.pairing_guide_ko || d.pairing_guide_ko || null,
            pairingGuideEn: corrections.pairing_guide_en || d.pairing_guide_en || null,
            importer: d.importer || null,
            rawCategory: d.raw_category || d.category || null,
            isPublished: true, 
            rating: Number(d.rating || 0),
            reviewCount: 0 
        };

        try {
            await executeMutation('upsertSpirit', spiritUpdatePayload);
            console.log(`    ✅ Spirit root updated with snapshot fields.`);
        } catch (err: any) {
            console.error(`    ❌ Spirit update failed: ${err.message}`);
        }

        // 2. Create the NewArrival link
        try {
            await executeMutation('upsertNewArrival', {
                id: `na-${displayOrder}-${spiritId}`,
                spiritId: spiritId,
                displayOrder: displayOrder,
                tags: d.tags || []
            });
            console.log(`    ✅ NewArrival shortcut link created.`);
        } catch (err: any) {
            console.error(`    ❌ NewArrival link failed: ${err.message}`);
        }
    }

    console.log("✨ HOME SCREEN RESTORATION COMPLETE ✨");
}

restoreShortcuts().catch(console.error);
