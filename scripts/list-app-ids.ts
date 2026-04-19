import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function listAppIds() {
  const snapshot = await db.collection('artifacts').get();
  console.log('App IDs in artifacts:');
  snapshot.forEach(doc => console.log(`- ${doc.id}`));
}

listAppIds();
