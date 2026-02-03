import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();

async function getExample() {
    console.log('🔍 Fetching an example published spirit...');
    try {
        const snapshot = await db.collection('spirits')
            .where('isPublished', '==', true)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('❌ No published spirits found.');
            return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        console.log('\n==================================================');
        console.log(`🆔 ID: ${doc.id}`);
        console.log(`🏷️  Name: ${data.name}`);
        console.log(`🌐 Name (EN): ${data.name_en}`);
        console.log(`📅 UpdatedAt: ${data.updatedAt}`);
        console.log(`📝 Description (KO): ${data.description_ko?.substring(0, 100)}...`);
        console.log('==================================================\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

getExample();
