const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('--- Debug Info ---');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID ? 'OK' : 'MISSING');
console.log('------------------');

if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is MISSING. Ensure .env exists and is populated.");
    process.exit(1);
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

const db = admin.firestore();

async function auditPublishStatus() {
    console.log('--- Spirit Publication Status Audit ---');
    const spiritsRef = db.collection('spirits');
    const snapshot = await spiritsRef.get();

    console.log(`Total spirits in DB: ${snapshot.size}`);

    const stats = {
        isPublished: { true: 0, false: 0, missing: 0 },
        status: {},
        byCategory: {}
    };

    snapshot.forEach(doc => {
        const data = doc.data();
        const cat = data.category || 'Unknown';
        const isPublished = data.isPublished;
        const status = data.status || 'MISSING';

        // Count isPublished
        if (isPublished === true) stats.isPublished.true++;
        else if (isPublished === false) stats.isPublished.false++;
        else stats.isPublished.missing++;

        // Count Status
        stats.status[status] = (stats.status[status] || 0) + 1;

        // Count by Category
        if (!stats.byCategory[cat]) {
            stats.byCategory[cat] = { total: 0, published: 0 };
        }
        stats.byCategory[cat].total++;
        if (isPublished === true) stats.byCategory[cat].published++;
    });

    console.log('\n[Summary: isPublished flag]');
    console.log(`- Published (true): ${stats.isPublished.true}`);
    console.log(`- Private (false): ${stats.isPublished.false}`);
    console.log(`- Missing field: ${stats.isPublished.missing}`);

    console.log('\n[Summary: status field]');
    Object.keys(stats.status).forEach(s => {
        console.log(`- ${s}: ${stats.status[s]}`);
    });

    console.log('\n[Details by Category (Published Rate)]');
    Object.keys(stats.byCategory).sort().forEach(cat => {
        const info = stats.byCategory[cat];
        const pubRate = ((info.published / info.total) * 100).toFixed(1);
        console.log(`- ${cat.padEnd(12)}: ${info.published.toString().padStart(4)} / ${info.total.toString().padStart(4)} (${pubRate}%)`);
    });

    console.log('\nAudit Complete.');
}

auditPublishStatus().catch(console.error);
