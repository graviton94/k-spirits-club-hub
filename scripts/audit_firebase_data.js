const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

/**
 * Audit Script: Analyze Firebase Data Quality (Client SDK Version)
 * 
 * This script audits the 'spirits' collection using the Client SDK (public read access).
 * 
 * Usage: node scripts/audit_firebase_data.js
 */

const firebaseConfig = {
    apiKey: "AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ",
    authDomain: "k-spirits-club.firebaseapp.com",
    projectId: "k-spirits-club",
    storageBucket: "k-spirits-club.firebasestorage.app",
    messagingSenderId: "65395658426",
    appId: "1:65395658426:web:4f7010f68d3475dffbbc83",
    measurementId: "G-0QF9WTQFF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function auditData() {
    try {
        console.log('Starting data audit (Client SDK)...\n');

        // Fetch all spirits
        const spiritsRef = collection(db, 'spirits');
        const snapshot = await getDocs(spiritsRef);

        console.log(`Total spirits found: ${snapshot.size}\n`);

        const stats = {
            urlMatch: {
                match: 0,
                mismatch: 0,
                bothNull: 0,
                onlyImage: 0,
                onlyThumb: 0
            },
            subcategory: {},
            category: {},
            status: {},
            region: {}
        };

        snapshot.forEach(doc => {
            const data = doc.data();

            // 1. Image URL vs Thumbnail URL
            const img = data.imageUrl;
            const thumb = data.thumbnailUrl;

            if (!img && !thumb) {
                stats.urlMatch.bothNull++;
            } else if (img && !thumb) {
                stats.urlMatch.onlyImage++;
            } else if (!img && thumb) {
                stats.urlMatch.onlyThumb++;
            } else if (img === thumb) {
                stats.urlMatch.match++;
            } else {
                stats.urlMatch.mismatch++;
            }

            // Helper to increment counter
            const increment = (obj, key) => {
                const k = key === null ? 'null' : (key === undefined ? 'undefined' : key);
                obj[k] = (obj[k] || 0) + 1;
            };

            // 2. Subcategory
            increment(stats.subcategory, data.subcategory);

            // 3. Category
            increment(stats.category, data.category);

            // 4. Status
            increment(stats.status, data.status);

            // 5. Region
            increment(stats.region, data.region);
        });

        console.log('=== Audit Results ===\n');

        console.log('1. Image URL vs Thumbnail URL Match Status:');
        console.log(`   - Match (Same URL): ${stats.urlMatch.match}`);
        console.log(`   - Mismatch (Different URLs): ${stats.urlMatch.mismatch}`);
        console.log(`   - Both Null/Undefined: ${stats.urlMatch.bothNull}`);
        console.log(`   - Only ImageUrl exists: ${stats.urlMatch.onlyImage}`);
        console.log(`   - Only ThumbnailUrl exists: ${stats.urlMatch.onlyThumb}`);
        console.log('');

        const printDistribution = (name, data) => {
            console.log(`${name} Distribution:`);
            const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
            sortedEntries.forEach(([key, count]) => {
                console.log(`   - ${key}: ${count}`);
            });
            console.log(`   (Total unique values: ${sortedEntries.length})`);
            console.log('');
        };

        printDistribution('2. Subcategory', stats.subcategory);
        printDistribution('3. Category', stats.category);
        printDistribution('4. Status', stats.status);
        printDistribution('5. Region', stats.region);

    } catch (error) {
        console.error('Audit failed:', error);
        process.exit(1);
    }
}

auditData();
