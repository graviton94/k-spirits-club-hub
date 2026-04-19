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
const query = process.argv[2];

async function findSpiritId() {
  console.log(`Searching for spirits with ID containing: ${query}`);
  const snapshot = await db.collection('spirits').get();
  const matches = snapshot.docs.filter(doc => doc.id.includes(query));
  
  if (matches.length === 0) {
    console.log('No matches found.');
  } else {
    matches.forEach(m => console.log(`- ${m.id}`));
  }
}

findSpiritId();
