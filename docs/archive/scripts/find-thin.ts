import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env', override: false });
process.env.FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'k-spirits-club';

async function run() {
    const { getPublishedSpiritMetaWithQuality } = await import('./lib/db/firestore-rest');

    // Fetch all meta straight from Firestore the same way sitemap does
    const allMeta = await getPublishedSpiritMetaWithQuality();

    const thin = allMeta.find(s => {
        const descKoLen = s.descriptionKoLength || 0;
        const descEnLen = s.descriptionEnLength || 0;
        const maxLen = Math.max(descKoLen, descEnLen);
        const hasImage = !!(s.imageUrl || s.thumbnailUrl);
        const hasAbv = typeof s.abv === 'number';

        return maxLen < 300 || !hasImage || !hasAbv;
    });

    if (thin) {
        console.log('True Tier B Spirit:', thin.id);
        console.log(`Details: maxLen=${Math.max(thin.descriptionKoLength, thin.descriptionEnLength)}, img=${!!(thin.imageUrl || thin.thumbnailUrl)}, abv=${typeof thin.abv === 'number'}`);
    } else {
        console.log('No Tier B spirits found in the entire DB!');
    }
}

run();
