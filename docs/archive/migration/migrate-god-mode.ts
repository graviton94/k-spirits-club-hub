import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';
import { getDataConnect } from 'firebase-admin/data-connect';

dotenv.config({ path: '.env.local' });
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'k-spirits-club',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const APP_ID = 'k-spirits-club-hub';
const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';
const KSC_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

function cleanTime(obj: any): any {
  if (!obj) return new Date().toISOString();
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (obj._seconds) return new Date(obj._seconds * 1000).toISOString();
  return new Date(obj).toISOString();
}

function docIdToUuid(docId: string) {
  if (docId && docId.length === 36 && docId.split('-').length === 5) return docId; 
  return uuidv5(docId, KSC_NAMESPACE);
}

async function executeMutation(name: string, variables: any) {
  try {
    const dataConnect = getDataConnect({
      serviceId: DC_SERVICE_ID,
      location: DC_LOCATION,
      connector: 'main'
    });
    await dataConnect.executeMutation(name, variables);
    return true;
  } catch (error: any) {
    console.error(`❌ Field Match Error in ${name}:`, error.message);
    // console.log(JSON.stringify(variables, null, 2));
    return false;
  }
}

async function migrateGodMode() {
    console.log("🔥 STARTING PHASE 1.8: GOD MODE MIGRATION 🔥");

    // 1. PUBLIC RICH REVIEWS
    console.log("--- 🕵️ Crawling Public Global Reviews (Rich Content) ---");
    const publicReviewsRef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('reviews');
    const pubSnap = await publicReviewsRef.get();
    let revCount = 0;
    for (const doc of pubSnap.docs) {
        const d = doc.data();
        // ID is usually {spiritId}_{userId}
        let spiritId = d.spiritId;
        let userId = d.userId;
        if (!spiritId || !userId) {
            const parts = doc.id.split('_');
            if (parts.length >= 2) {
                spiritId = parts[0];
                userId = parts[1];
            }
        }

        if (!spiritId || !userId) continue;

        let urls: string[] = [];
        if (Array.isArray(d.imageUrls)) urls = d.imageUrls;
        else if (d.imageUrl) urls = [d.imageUrl];

        const payload = {
            id: docIdToUuid(doc.id),
            spiritId: String(spiritId),
            userId: String(userId),
            rating: Math.round(Number(d.rating || 0)),
            title: d.title || (d.spiritName ? `${d.spiritName} 리뷰` : 'Spirit Review'),
            content: String(d.notes || d.reviewBody || d.content || (d.tagsN ? `[Flavor Tags] ${d.tagsN} ${d.tagsP} ${d.tagsF}` : '내용 없음')),
            nose: d.tagsN || (d.ratingN ? String(d.ratingN) : null),
            palate: d.tagsP || (d.ratingP ? String(d.ratingP) : null),
            finish: d.tagsF || (d.ratingF ? String(d.ratingF) : null),
            likes: Number(d.likes || 0),
            likedBy: Array.isArray(d.likedBy) ? d.likedBy : [],
            isPublished: d.isPublished !== false,
            imageUrls: urls,
            createdAt: cleanTime(d.createdAt),
            updatedAt: cleanTime(d.updatedAt || d.createdAt)
        };

        if (await executeMutation('upsertReview', payload)) revCount++;
    }
    console.log(`✅ ${revCount} Rich Reviews Restored.`);

    // 2. AI SOMMELIER LOGS
    console.log("--- 🤖 Crawling AI Sommelier Logs ---");
    const aiLogsRef = db.collection('artifacts').doc(APP_ID).collection('admin').doc('logs').collection('sommelier');
    const aiSnap = await aiLogsRef.get();
    let aiCount = 0;
    for (const doc of aiSnap.docs) {
        const d = doc.data();
        const payload = {
            id: doc.id,
            userId: d.userId || 'guest',
            analysis: d.analysis || null,
            recommendations: d.recommendations || [],
            messageHistory: d.messageHistory || []
        };
        if (await executeMutation('upsertAiDiscoveryLog', payload)) aiCount++;
    }
    console.log(`✅ ${aiCount} AI Discovery Logs Restored.`);

    // 3. WORLDCUP RESULTS
    console.log("--- 🏆 Crawling WorldCup Results ---");
    const wcSnap = await db.collection('worldcup_results').get();
    let wcCount = 0;
    for (const doc of wcSnap.docs) {
        const d = doc.data();
        const winnerId = d.winnerId || (d.winner && d.winner.id);
        if (!winnerId) continue;

        const payload = {
            id: docIdToUuid(doc.id),
            winnerId: String(winnerId),
            category: String(d.category || 'ALL'),
            subcategory: String(d.subcategory || 'ALL'),
            initialRound: Number(d.initialRound || 32)
        };
        if (await executeMutation('upsertWorldCupResult', payload)) wcCount++;
    }
    console.log(`✅ ${wcCount} WorldCup Results Restored.`);

    // 4. SPIRITS FIELD RECOVERY (Importer, rawCategory)
    console.log("--- 🧊 Patching Spirits (importer, rawCategory) ---");
    const spiritsSnap = await db.collection('spirits').get();
    let spCount = 0;
    for (const doc of spiritsSnap.docs) {
        const d = doc.data();
        if (d.importer || d.category) {
            const payload = {
                id: doc.id,
                name: d.name || 'Unnamed',
                category: d.category || 'Unknown',
                imageUrl: d.imageUrl || d.image_url || 'https://placehold.co/400',
                importer: d.importer || null,
                rawCategory: d.category || null,
                isPublished: d.isPublished !== false,
                rating: Number(d.rating || 0),
                reviewCount: Number(d.reviewCount || 0)
            };
            if (await executeMutation('upsertSpirit', payload)) spCount++;
        }
    }
    console.log(`✅ ${spCount} Spirits Patched with Importer/Categories.`);

    console.log("\n🎊 PHASE 1.8: GOD MODE COMPLETE 🎊");
}

migrateGodMode().catch(console.error);
