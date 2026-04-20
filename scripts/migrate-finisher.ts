import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';
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
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const KSC_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

function docIdToUuid(docId: string) {
  if (docId && docId.length === 36 && docId.split('-').length === 5) return docId; 
  return uuidv5(docId, KSC_NAMESPACE);
}

async function executeMutation(name: string, variables: any) {
  const dataConnect = getDataConnect({
    serviceId: 'k-spirits-club-hub',
    location: 'asia-northeast3',
    connector: 'main'
  });
  await dataConnect.executeMutation(name, variables);
}

async function finish() {
    console.log("🏁 FINISHING PHASE 1.5 (NEWS & WORLDCUP) 🏁");

    // 4. Global News
    console.log("--- 📰 Migrating News ---");
    const newsRef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('news');
    const newsSnap = await newsRef.get();
    for (const nDoc of newsSnap.docs) {
        const d = nDoc.data();
        const ko = d.translations?.ko || {};
        await executeMutation('upsertNews', {
            id: String(nDoc.id),
            title: ko.title || d.originalTitle || 'News',
            content: ko.content || '내용 없음',
            imageUrl: d.imageUrl || d.image_url || null,
            category: d.category || 'Global News',
            source: d.source || 'News',
            link: d.link || '',
            date: d.date || d.createdAt || new Date().toISOString(),
            translations: d.translations || null,
            tags: d.tags || null
        });
    }
    console.log(`✅ ${newsSnap.size} News Articles Migrated.`);

    // 5. WorldCup Results
    console.log("--- 🏆 Migrating WorldCup Results ---");
    const wcSnap = await db.collection('worldcup_results').get();
    for (const wDoc of wcSnap.docs) {
        const wd = wDoc.data();
        if(!wd.winnerId && !wd.winner_id) continue;
        await executeMutation('upsertWorldCupResult', {
            id: docIdToUuid(wDoc.id),
            winnerId: String(wd.winnerId || wd.winner_id),
            category: String(wd.category || 'ALL'),
            subcategory: String(wd.subcategory || 'ALL'),
            initialRound: Number(wd.initialRound || 32)
        });
    }
    console.log(`✅ ${wcSnap.size} WorldCup Results Migrated.`);

    console.log("\n✨ ALL DATA PARITY ACHIEVED! ✨");
}

finish().catch(console.error);
