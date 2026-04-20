import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
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

async function getDocSample(path: string) {
    const snap = await db.collection(path).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data();
}

async function getSubCollectionSamples(docRef: admin.firestore.DocumentReference, parentPath: string) {
    const subCollections = await docRef.listCollections();
    for (const sub of subCollections) {
        const subPath = `${parentPath}/${sub.id}`;
        const sample = await getDocSample(subPath);
        console.log(`\n[PATH] ${subPath}`);
        console.log(`[SAMPLE]`, JSON.stringify(sample, null, 2));
        
        const subSnap = await sub.limit(1).get();
        if (!subSnap.empty) {
            await getSubCollectionSamples(subSnap.docs[0].ref, `${subPath}/${subSnap.docs[0].id}`);
        }
    }
}

async function discover() {
    console.log("=== EXHAUSTIVE FIRESTORE DISCOVERY ===");
    
    // Root collections
    const rootCollections = await db.listCollections();
    for (const coll of rootCollections) {
        if (coll.id === 'artifacts') continue; // Handle artifacts separately
        const sample = await getDocSample(coll.id);
        console.log(`\n[ROOT PATH] ${coll.id}`);
        console.log(`[SAMPLE]`, JSON.stringify(sample, null, 2));
        
        const snap = await coll.limit(1).get();
        if (!snap.empty) {
            await getSubCollectionSamples(snap.docs[0].ref, `${coll.id}/${snap.docs[0].id}`);
        }
    }

    console.log("\n=== ARTIFACTS DEEP SCAN ===");
    const artifactRoot = db.collection('artifacts').doc(APP_ID);
    await getSubCollectionSamples(artifactRoot, `artifacts/${APP_ID}`);
}

discover().catch(console.error);
