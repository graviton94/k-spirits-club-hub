import { config } from 'dotenv';
config({ path: '.env.local' });

// We must provide a mock environment for NEXT_PUBLIC variables if they aren't loaded correctly by dotenv into process.env 
// But dotenv should do that.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAppPath } from './lib/db/paths';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "k-spirits-club.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "k-spirits-club",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "k-spirits-club.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "65395658426",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:65395658426:web:4f7010f68d3475dffbbc83",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0QF9WTQFF2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
    console.log("Fetching published spirits using Client SDK...");
    const spiritsPath = getAppPath().spirits;
    console.log("Path:", spiritsPath);

    // Fetch all explicitly published 
    const q = query(collection(db, spiritsPath), where("isPublished", "==", true));
    const snapshot = await getDocs(q);

    const subCategories = new Set<string>();
    const countries = new Set<string>();
    const mixedEntries: any[] = [];
    const missingKorean: any[] = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        const subCategory = data.subcategory || data.subCategory || "";
        const country = data.country || "";
        const name = data.name || "";

        if (subCategory) subCategories.add(subCategory);
        if (country) countries.add(country);

        // Check for mixed subCategories like "레드 와인 (쇼비뇽 블랑)"
        if (subCategory.includes('(') || subCategory.includes(')')) {
            mixedEntries.push({ id: doc.id, name, subCategory, country });
        }

        // English-only or weird country names
        if (/[a-zA-Z]/.test(country) && country.toLowerCase() !== 'rtm' && country.toLowerCase() !== 'rtd') {
            missingKorean.push({ id: doc.id, name, subCategory, country });
        }
    });

    console.log(`\n=== Unique SubCategories (${subCategories.size}) ===`);
    Array.from(subCategories).sort().forEach(s => console.log(s));

    console.log(`\n=== Unique Countries (${countries.size}) ===`);
    Array.from(countries).sort().forEach(c => console.log(c));

    console.log(`\n=== Subcategories with Parentheses (mixed category/variety) (${mixedEntries.length}) ===`);
    mixedEntries.slice(0, 30).forEach(e => console.log(`[${e.id}] ${e.name} | subCategory: ${e.subCategory}`));

    console.log(`\n=== Countries with English characters (${missingKorean.length}) ===`);
    missingKorean.slice(0, 30).forEach(e => console.log(`[${e.id}] ${e.name} | country: ${e.country}`));
}

checkData().catch(console.error);
