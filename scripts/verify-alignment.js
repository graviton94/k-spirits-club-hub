const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

const db = admin.firestore();

async function verify() {
    console.log('--- Subcategory Alignment Verification ---');
    const spiritsRef = db.collection('spirits');
    const snapshot = await spiritsRef.get();

    console.log(`Total spirits in DB: ${snapshot.size}`);

    const stats = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        const cat = data.category || 'Unknown';
        const sub = data.subcategory || 'None';

        const key = `${cat} > ${sub}`;
        stats[key] = (stats[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(stats).sort();

    console.log('\n--- Distribution ---');
    sortedKeys.forEach(key => {
        console.log(`${key}: ${stats[key]}`);
    });

    console.log('\nVerification Complete.');
}

verify().catch(console.error);
