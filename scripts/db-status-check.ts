
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || '{}');
    if (!serviceAccount.project_id) {
        // Handle newline characters in private key if loaded from .env
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        serviceAccount.private_key = privateKey;
        serviceAccount.project_id = process.env.FIREBASE_PROJECT_ID;
        serviceAccount.client_email = process.env.FIREBASE_CLIENT_EMAIL;
    }

    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function checkDatabaseStatus() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Status Breakdown');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const spiritsRef = db.collection('spirits');
        const snapshot = await spiritsRef.get();

        const total = snapshot.size;
        const statusCounts: Record<string, number> = {};
        const publishedTrueCount = snapshot.docs.filter(d => d.data().isPublished === true).length;
        const publishedFalseCount = snapshot.docs.filter(d => d.data().isPublished === false).length;
        const publishedUndefinedCount = snapshot.docs.filter(d => d.data().isPublished === undefined).length;

        snapshot.forEach(doc => {
            const data = doc.data();
            const status = data.status || 'UNDEFINED';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        console.log(`\n📦 Total Spirits: ${total.toLocaleString()}`);

        console.log('\n📌 By Status Field:');
        Object.entries(statusCounts)
            .sort(([, a], [, b]) => b - a)
            .forEach(([status, count]) => {
                console.log(`   - ${status.padEnd(20)}: ${count.toLocaleString()}`);
            });

        console.log('\n📌 By isPublished Field:');
        console.log(`   - true                : ${publishedTrueCount.toLocaleString()}`);
        console.log(`   - false               : ${publishedFalseCount.toLocaleString()}`);
        console.log(`   - undefined           : ${publishedUndefinedCount.toLocaleString()}`);

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

checkDatabaseStatus();
