import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getDataConnect } from 'firebase-admin/data-connect';

dotenv.config({ path: '.env.local' });
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';

function cleanTimestamps(obj: any): any {
  if (!obj) return null;
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  return new Date(obj).toISOString();
}

async function executeMutation(name: string, variables: any) {
  try {
    const dataConnect = getDataConnect({
      serviceId: DC_SERVICE_ID,
      location: DC_LOCATION,
      connector: 'main'
    });
    const result = await dataConnect.executeMutation(name, variables);
    const anyResult = result as any;
    if (anyResult.errors && anyResult.errors.length > 0) {
      throw new Error(`Error in mutation ${name}: ${JSON.stringify(anyResult.errors, null, 2)}`);
    }
    return true;
  } catch (error: any) {
    throw new Error(`Admin SDK error in mutation ${name}: ${error.message}`);
  }
}

async function migrateUserCabinet() {
  console.log('--- 🔍 Starting Extract for User Cabinet ---');
  
  // FIX: Fetch actual root users because artifacts/.../users/{uid} are ghost documents
  const rootUsersSnap = await db.collection('users').get();
  
  console.log(`Found ${rootUsersSnap.size} real user IDs to inspect for cabinet items.`);

  let totalDeepMined = 0;
  let skippedMined = 0;

  for (const userDoc of rootUsersSnap.docs) {
    const userId = userDoc.id;
    // Explictly bypass ghost docs and hit the collection
    const cabinetRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId).collection('cabinet');
    const cabinetSnap = await cabinetRef.get();

    if (cabinetSnap.empty) continue; 
    console.log(`  > Found ${cabinetSnap.size} legacy cabinet items for User: ${userId}`);

    for (const itemDoc of cabinetSnap.docs) {
      const data = itemDoc.data();
      const spiritId = data.spiritId || data.spirit_id || itemDoc.id; // Some schemas use the doc ID as spiritId

      if (!spiritId || !userId) {
        console.warn(`    ⚠️ Cabinet item ${itemDoc.id} missing spiritId or userId. Skipping.`);
        skippedMined++;
        continue;
      }

      const variables = {
        userId: String(userId),
        spiritId: String(spiritId),
        notes: data.notes || null,
        rating: data.rating ? Math.round(Number(data.rating)) : null,
        isFavorite: data.isFavorite === true,
        addedAt: data.addedAt ? cleanTimestamps(data.addedAt) : (data.createdAt ? cleanTimestamps(data.createdAt) : new Date().toISOString())
      };

      try {
        await executeMutation('upsertCabinet', variables);
        totalDeepMined++;
      } catch (err: any) {
        console.error(`    ❌ Failed to upsert cabinet ${itemDoc.id} for user ${userId}: ${err.message}`);
        skippedMined++;
      }
    }
  }

  console.log('================================================================');
  console.log(`✅ Cabinet Migration Complete`);
  console.log(`✅ Total Successfully Mined & Ingested: ${totalDeepMined}`);
  console.log(`⚠️ Skipped/Failed: ${skippedMined}`);
  console.log('================================================================');
}

migrateUserCabinet().catch(console.error);
