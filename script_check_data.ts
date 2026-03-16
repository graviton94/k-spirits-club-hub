import { config } from 'dotenv';
config({ path: '.env' });
import { db } from './lib/firebase-admin';

async function checkData() {
    console.log("Fetching spirits...");

    const allSnapshot = await db.collection('spirits').get();

    const subCategories = new Set<string>();
    const countries = new Set<string>();

    allSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'published' || data.is_published === true || true) {
            if (data.subcategory) subCategories.add(data.subcategory);
            if (data.subCategory) subCategories.add(data.subCategory);
            if (data.country) countries.add(data.country);
        }
    });

    console.log("=== Unique Subcategories ===");
    Array.from(subCategories).sort().forEach(s => console.log(s));
    console.log("\n=== Unique Countries ===");
    Array.from(countries).sort().forEach(c => console.log(c));
}

checkData().catch(console.error);
