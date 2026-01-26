const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// Initialize Firebase
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is not set in environment variables.");
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
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';

async function resetArtifacts() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🗑️  DELETING ALL DATA UNDER artifacts/${APP_ID}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const artifactsRef = db.collection('artifacts').doc(APP_ID);

    try {
        console.log(`Target: artifacts/${APP_ID}`);
        console.log("Starting recursive delete...");

        await db.recursiveDelete(artifactsRef);

        console.log(`\n✅ Successfully deleted all data under artifacts/${APP_ID}.`);
        console.log("The namespace is now clean and ready for new structure.");

    } catch (error) {
        console.error("\n❌ Error during recursive delete:", error);
        process.exit(1);
    }
}

// Ask for confirmation mechanism? 
// In automated environment, we'll just run it if they execute the script.
// But added a safety 5s delay just in case of manual interrupt.

console.log("⚠️  WARNING: THIS WILL PERMANENTLY DELETE ALL DATA IN THIS ARTIFACTS NAMESPACE.");
console.log(`Target: artifacts/${APP_ID}`);
console.log("Starting in 5 seconds... Press Ctrl+C to cancel.");

setTimeout(() => {
    resetArtifacts();
}, 5000);
