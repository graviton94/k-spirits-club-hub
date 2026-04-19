import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getAppPath } from '../lib/db/path-config';

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
const paths = getAppPath('k-spirits-club-hub');

async function debug() {
  console.log('--- FIRESTORE DEBUG ---');
  
  const usersCount = (await db.collection('users').count().get()).data().count;
  console.log(`Global users count: ${usersCount}`);
  
  const newsId1 = 'global-news-2025-04-16';
  const newsId2 = 'korea-whisky-expo-2026';
  
  const doc1 = await db.collection(paths.news).doc(newsId1).get();
  console.log(`${newsId1} exists: ${doc1.exists}`);
  
  const doc2 = await db.collection(paths.news).doc(newsId2).get();
  console.log(`${newsId2} exists: ${doc2.exists}`);

  const spiritId1 = 'fsk-2003001503616';
  const spiritId2 = 'fsk-manual-entry-001';
  
  const sdoc1 = await db.collection(paths.spirits).doc(spiritId1).get();
  console.log(`${spiritId1} exists: ${sdoc1.exists}`);
  
  const sdoc2 = await db.collection(paths.spirits).doc(spiritId2).get();
  console.log(`${spiritId2} exists: ${sdoc2.exists}`);
}

debug();
