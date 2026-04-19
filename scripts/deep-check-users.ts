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

async function deepCheckUsers() {
  const snapshot = await db.collection('users').get();
  console.log(`Total documents in 'users' collection: ${snapshot.size}`);
  snapshot.docs.slice(0, 5).forEach(doc => {
    console.log(`- ID: ${doc.id}, Nickname: ${doc.data().nickname || 'N/A'}, Role: ${doc.data().role || 'N/A'}`);
  });
  
  // also check if appId might be something else?
}

deepCheckUsers();
