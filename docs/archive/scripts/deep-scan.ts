import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

function init() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}

async function deep() {
  init();
  const db = admin.firestore();
  
  // Checking taste_data
  const tSnap = await db.collection('users').doc('fiO8qf1PjLZAPBNcJmvy1cpqrY52').collection('taste_data').get();
  console.log("taste_data sample:", tSnap.docs[0]?.data());

  // Checking worldcup_results
  const wSnap = await db.collection('worldcup_results').limit(1).get();
  console.log("root worldcup_results sample:", wSnap.docs[0]?.data());

  // Traversing Artifacts completely
  const artifactsBase = db.collection('artifacts').doc('k-spirits-club-hub');
  
  const publicRef = artifactsBase.collection('public').doc('data');
  const pColls = await publicRef.listCollections();
  console.log("Public Data Subcollections:", pColls.map(c => c.id));
  
  const adminRef = artifactsBase.collection('admin').doc('logs');
  const aColls = await adminRef.listCollections();
  console.log("Admin Logs Subcollections:", aColls.map(c => c.id));
  
}

deep().catch(console.error);
