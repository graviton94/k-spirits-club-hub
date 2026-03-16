import fetch from 'node-fetch';

const PROJECT_ID = "k-spirits-club";
const API_KEY = "AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/artifacts/k-spirits-club-hub/public/data/spirits?key=${API_KEY}`;

async function checkData() {
    console.log("Fetching spirits...");

    const subCategories = new Set<string>();
    const countries = new Set<string>();
    const mixedEntries = [];

    let pageToken = "";
    let hasMore = true;

    while (hasMore) {
        const url = pageToken ? `${BASE_URL}&pageToken=${pageToken}` : BASE_URL;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${await res.text()}`);
        }
        const json: any = await res.json();
        const documents = json.documents || [];

        for (const doc of documents) {
            const fields = doc.fields || {};

            const subCategory = fields.subcategory?.stringValue || fields.subCategory?.stringValue || "";
            const country = fields.country?.stringValue || "";
            const name = fields.name?.stringValue || "";

            if (subCategory) subCategories.add(subCategory);
            if (country) countries.add(country);

            // Let's identify "레드 와인 (쇼비뇽 블랑)" or mixed korean/english
            if (subCategory.includes('(') || subCategory.includes(')') || /[a-zA-Z]/.test(subCategory)) {
                mixedEntries.push({ name, subCategory, country });
            } else if (/[a-zA-Z]/.test(country)) {
                mixedEntries.push({ name, subCategory, country });
            }
        }

        if (json.nextPageToken) {
            pageToken = json.nextPageToken;
        } else {
            hasMore = false;
        }
    }

    console.log("=== Unique Subcategories ===");
    Array.from(subCategories).sort().forEach(s => console.log(s));
    console.log("\n=== Unique Countries ===");
    Array.from(countries).sort().forEach(c => console.log(c));

    console.log("\n=== Suspicious/Mixed Entries ===");
    mixedEntries.slice(0, 50).forEach(e => console.log(`${e.name} | subCategory: ${e.subCategory} | country: ${e.country}`));
}

checkData().catch(console.error);
