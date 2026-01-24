const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// Initialize Firebase
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is not set in environment variables.");
    process.exit(1);
}

// Handle private key newlines
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

async function setAdmin(email) {
    if (!email) {
        console.error("Please provide an email address.");
        process.exit(1);
    }

    console.log(`🔍 Finding user with email: ${email}...`);

    try {
        // Query users by email (Note: This assumes 'email' field exists in 'users' collection)
        // If 'email' is only in Auth, we need to find UID from Auth first.

        let uid;

        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            uid = userRecord.uid;
            console.log(`✅ Found Auth User: ${uid} (${userRecord.displayName})`);
        } catch (authError) {
            if (authError.code === 'auth/user-not-found') {
                console.error(`❌ User not found in Firebase Auth: ${email}`);
                console.error(`   Please sign up first in the app.`);
                process.exit(1);
            }
            throw authError;
        }

        const userRef = db.collection('users').doc(uid);
        console.log(`Getting user doc for ${uid}...`);
        const userDoc = await userRef.get();
        console.log(`User doc exists: ${userDoc.exists}`);

        if (!userDoc.exists) {
            console.log(`⚠️ User document not found in Firestore. Creating one...`);
            await userRef.set({
                email: email,
                role: 'ADMIN',
                updatedAt: new Date().toISOString()
            }, { merge: true });
            console.log(`Created user doc.`);
        } else {
            console.log(`Updating user role to ADMIN (using SET)...`);
            await userRef.set({
                role: 'ADMIN',
                updatedAt: new Date().toISOString()
            }, { merge: true });
            console.log(`Updated user role.`);
        }

        console.log(`🎉 Success! User ${email} is now an ADMIN.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error setting admin role:", error);
        process.exit(1);
    }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
    console.log("Usage: node scripts/set_admin.js <email>");
    process.exit(1);
} else {
    setAdmin(targetEmail).catch(err => {
        console.error(err);
        process.exit(1);
    });
}
