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

async function listCollections() {
  const collections = await db.listCollections();
  console.log('Root Collections:');
  collections.forEach(c => console.log(`- ${c.id}`));
  
  // Also check artifacts deep path
  const appId = 'k-spirits-club-hub';
  console.log('\nChecking artifacts/k-spirits-club-hub/public/data:');
  const publicData = await db.doc(`artifacts/${appId}/public/data`).listCollections();
  publicData.forEach(c => console.log(`  - ${c.id}`));

  console.log('\nChecking artifacts/k-spirits-club-hub/users:');
  const userRoot = await db.collection(`artifacts/${appId}/users`).limit(5).get();
  console.log(`  - Count in artifacts/.../users collection: ${userRoot.size} (sampled)`);
  // Not a collection if size is 0 and no listCollections?
  // Actually artifacts/appId/users is likely a collection of documents (userIds).
}

listCollections();
