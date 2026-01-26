const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
    apiKey: "AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ",
    authDomain: "k-spirits-club.firebaseapp.com",
    projectId: "k-spirits-club",
    storageBucket: "k-spirits-club.firebasestorage.app",
    messagingSenderId: "65395658426",
    appId: "1:65395658426:web:4f7010f68d3475dffbbc83",
    measurementId: "G-0QF9WTQFF2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportSummaries() {
    try {
        console.log('Fetching data for summary...\n');
        const spiritsRef = collection(db, 'spirits');
        const snapshot = await getDocs(spiritsRef);

        const subcategories = {};
        const regions = {};

        snapshot.forEach(doc => {
            const data = doc.data();

            // Subcategory
            const sub = data.subcategory !== undefined ? String(data.subcategory) : 'undefined';
            subcategories[sub] = (subcategories[sub] || 0) + 1;

            // Region
            const reg = data.region !== undefined ? String(data.region) : 'undefined';
            regions[reg] = (regions[reg] || 0) + 1;
        });

        // Generate Subcategory MD
        let subMd = '# Subcategory Summary\n\nTotal Unique Values: ' + Object.keys(subcategories).length + '\n\n| Subcategory | Count |\n|---|---|\n';
        Object.entries(subcategories)
            .sort((a, b) => b[1] - a[1])
            .forEach(([key, count]) => {
                subMd += `| ${key} | ${count} |\n`;
            });

        fs.writeFileSync(path.join(process.cwd(), 'SUBCATEGORY_SUMMARY.md'), subMd);
        console.log('Created SUBCATEGORY_SUMMARY.md');

        // Generate Region MD
        let regMd = '# Region Summary\n\nTotal Unique Values: ' + Object.keys(regions).length + '\n\n| Region | Count |\n|---|---|\n';
        Object.entries(regions)
            .sort((a, b) => b[1] - a[1])
            .forEach(([key, count]) => {
                regMd += `| ${key} | ${count} |\n`;
            });

        fs.writeFileSync(path.join(process.cwd(), 'REGION_SUMMARY.md'), regMd);
        console.log('Created REGION_SUMMARY.md');

    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

exportSummaries();
