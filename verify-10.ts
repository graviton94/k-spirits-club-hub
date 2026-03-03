import fs from 'fs';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env', override: false });
process.env.FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'k-spirits-club';

function fetchUrl(url: any): Promise<any> {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

async function run() {
    const { getPublishedSpiritMetaWithQuality } = await import('./lib/db/firestore-rest');
    console.log('Fetching local sitemap...');
    const data = await fetchUrl('http://localhost:3000/sitemap.xml');

    const urls = [...data.matchAll(/<loc>(.*?\/ko\/spirits\/.*?)<\/loc>/g)].map(m => m[1]);
    console.log(`Found ${urls.length} spirit URLs in sitemap`);

    // Fetch all meta straight from Firestore the same way sitemap does
    const allMeta = await getPublishedSpiritMetaWithQuality();

    const samples = [];
    for (let i = 0; i < 10; i++) {
        const idx = Math.floor(Math.random() * urls.length);
        samples.push(urls[idx]);
    }

    console.log('\n--- 10 Random Spirit Sample Check ---');
    let passCount = 0;

    for (const url of samples) {
        const id = url.split('/').pop();
        const spirit = allMeta.find(s => s.id === id);
        if (!spirit) {
            console.log(`❌ [${id}] Not found in DB`);
            continue;
        }

        const descKoLen = spirit.descriptionKoLength || 0;
        const descEnLen = spirit.descriptionEnLength || 0;
        const maxLen = Math.max(descKoLen, descEnLen);
        const hasImage = !!(spirit.imageUrl || spirit.thumbnailUrl);
        const hasAbv = typeof spirit.abv === 'number';

        if (maxLen >= 300 && hasImage && hasAbv) {
            console.log(`✅ [${id}] len: ${maxLen}, img: true, abv: true`);
            passCount++;
        } else {
            console.log(`❌ [${id}] FAILS Tier A constraints. len: ${maxLen}, img: ${hasImage}, abv: ${hasAbv}`);
        }
    }

    console.log(`\nResult: ${passCount}/10 met Tier A criteria.`);
}

run();
