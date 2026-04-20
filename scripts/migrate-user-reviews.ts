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
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';
const KSC_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

function cleanTimestamps(obj: any): any {
  if (!obj) return new Date().toISOString();
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  return new Date(obj).toISOString();
}

function docIdToUuid(docId: string) {
  if (docId && docId.length === 36 && docId.split('-').length === 5) {
     return docId; 
  }
  return uuidv5(docId, KSC_NAMESPACE);
}

// -------------------------------------------------------------
// [PHASE 2 DIRECTIVE] Explicit Field Mapping Interface
// -------------------------------------------------------------
function mapReviewToSQL(legacyData: any, docId: string, userIdArg: string) {
  // Safe Image Array Extraction
  let parsedImageUrls: string[] = [];
  if (Array.isArray(legacyData.imageUrls)) {
    parsedImageUrls = legacyData.imageUrls;
  } else if (typeof legacyData.imageUrl === 'string' && legacyData.imageUrl.trim() !== '') {
    parsedImageUrls = [legacyData.imageUrl];
  } else if (typeof legacyData.image_url === 'string' && legacyData.image_url.trim() !== '') {
    parsedImageUrls = [legacyData.image_url];
  }

  const spiritId = legacyData.spiritId || legacyData.spirit_id;
  if (!spiritId) return null;

  return {
    id: docIdToUuid(docId), 
    spiritId: String(spiritId),
    userId: String(legacyData.userId || legacyData.user_id || userIdArg),
    rating: Math.round(Number(legacyData.rating || 0)), 
    title: legacyData.title || (legacyData.spiritName ? `${legacyData.spiritName} 리뷰` : null),
    content: String(legacyData.notes || legacyData.content || legacyData.reviewBody || '내용 없음'),
    nose: legacyData.tagsN || legacyData.nose || (legacyData.ratingN ? String(legacyData.ratingN) : null),
    palate: legacyData.tagsP || legacyData.palate || (legacyData.ratingP ? String(legacyData.ratingP) : null),
    finish: legacyData.tagsF || legacyData.finish || (legacyData.ratingF ? String(legacyData.ratingF) : null),
    likes: Number(legacyData.likes || 0),
    likedBy: Array.isArray(legacyData.likedBy) ? legacyData.likedBy : [],
    isPublished: legacyData.isPublished !== false,
    imageUrls: parsedImageUrls,
    createdAt: cleanTimestamps(legacyData.createdAt),
    updatedAt: cleanTimestamps(legacyData.updatedAt || legacyData.createdAt)
  };
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
    throw new Error(`Admin SDK error in mutation ${name}: ${error.message}`);
  }
}

async function migrateUserReviewsIsolated() {
  // FIX: Due to Firestore's ghost document nature, we cannot query artifacts/.../users directly. 
  // We must obtain explicit valid IDs from the root users collection first.
  const rootUsersSnap = await db.collection('users').get();
  
  console.log(`Found ${rootUsersSnap.size} real user IDs in the system. Probing for isolated reviews...`);

  let totalDeepMined = 0;
  let skippedMined = 0;

  for (const userDoc of rootUsersSnap.docs) {
    const userId = userDoc.id;
    const isolatedReviewsRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId).collection('reviews');
    const isolatedSnap = await isolatedReviewsRef.get();

    if (isolatedSnap.empty) continue; 
    console.log(`  > Found ${isolatedSnap.size} isolated reviews for User: ${userId}`);

    for (const reviewDoc of isolatedSnap.docs) {
      const sqlPayload = mapReviewToSQL(reviewDoc.data(), reviewDoc.id, userId);

      if (!sqlPayload) {
        console.warn(`    ⚠️ Review ${reviewDoc.id} is missing critical map fields. Skipping.`);
        skippedMined++;
        continue;
      }

      try {
        await executeMutation('upsertReview', sqlPayload);
        totalDeepMined++;
        if (totalDeepMined % 50 === 0) console.log(`  Processed ${totalDeepMined} reviews...`);
      } catch (err: any) {
        console.error(`    ❌ Failed to upsert review ${reviewDoc.id}: ${err.message}`);
        skippedMined++;
      }
    }
  }

  console.log('================================================================');
  console.log(`✅ Priority 0: Isolated Review Migration Complete`);
  console.log(`✅ Total Successfully Mined & Ingested: ${totalDeepMined}`);
  console.log(`⚠️ Skipped/Failed: ${skippedMined}`);
  console.log('================================================================');
}

migrateUserReviewsIsolated().catch(console.error);
