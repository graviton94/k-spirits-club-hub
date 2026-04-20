import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';
import { getDataConnect } from 'firebase-admin/data-connect';
import { getAppPath } from '../lib/db/path-config';

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
const paths = getAppPath(APP_ID);

const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';
const KSC_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

async function executeQuery(name: string, variables: any = {}) {
  try {
    const dataConnect = getDataConnect({
      serviceId: DC_SERVICE_ID,
      location: DC_LOCATION,
      connector: 'main'
    });
    const result = await dataConnect.executeQuery(name, variables);
    return result.data;
  } catch (error: any) {
    throw new Error(`Error in query ${name}: ${error.message}`);
  }
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

async function wipeGhostReviews() {
  console.log('--- 🧹 Starting Ghost Review Cleanup ---');
  
  // 1. Build a Set of all valid deterministic UUIDs mapped from Firestore
  const validUuids = new Set<string>();
  const legacySnap = await db.collection(paths.reviews).get();
  legacySnap.forEach(doc => {
    let docId = doc.id;
    if (!(docId.length === 36 && docId.split('-').length === 5)) {
       docId = uuidv5(docId, KSC_NAMESPACE);
    }
    validUuids.add(docId);
  });

  console.log(`✅ Calculated ${validUuids.size} deterministic valid UUIDs from legacy Firestore.`);

  // 2. Fetch all reviews sitting in PostgreSQL right now
  const result = await executeQuery('auditAllReviews');
  const allPgReviews = result.spiritReviews || [];
  console.log(`🔍 Found ${allPgReviews.length} total reviews currently in PostgreSQL.`);

  // 3. Find impostors / broken random UUIDs
  const ghostIds = allPgReviews
    .map((r: any) => r.id)
    .filter((id: string) => !validUuids.has(id));

  console.log(`💀 Detected ${ghostIds.length} ghost/broken reviews to exterminate.`);

  // 4. Delete them
  let deletedCount = 0;
  for (const ghostId of ghostIds) {
    try {
      await executeMutation('deleteReview', { id: ghostId });
      deletedCount++;
    } catch (err: any) {
      console.error(`❌ Failed to delete ghost ID ${ghostId}: ${err.message}`);
    }
  }

  console.log('================================================================');
  console.log(`🧹 Cleanup Complete! Wiped ${deletedCount} ghost records.`);
  console.log('================================================================');
}

wipeGhostReviews().catch(console.error);
