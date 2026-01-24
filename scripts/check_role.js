const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

if (!process.env.FIREBASE_PROJECT_ID) { process.exit(1); }

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
const uid = process.argv[2];

async function check() {
    console.log(`Checking UID: ${uid}...`);
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            console.log('Role:', doc.data().role);
        } else {
            console.log('User Doc does not exist.');
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
