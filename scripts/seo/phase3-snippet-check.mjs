import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const BASE_URL = process.argv[2] || 'http://localhost:3000';

const testUrls = [
    // Spirits (Indexable)
    '/ko/spirits/2m31x8T5sO', // 진도홍주
    '/en/spirits/2m31x8T5sO',
    '/ko/spirits/1yP7xL9vQ2', // 일품진로
    '/en/spirits/1yP7xL9vQ2',
    '/ko/spirits/tU7rR7nQ1',  // 참이슬
    '/en/spirits/tU7rR7nQ1',

    // Explore 
    '/ko/explore',
    '/en/explore',

    // Hub Pages
    '/ko/contents/wiki/소주-가이드',
    '/en/contents/wiki/korean-soju',
    '/ko/contents',
    '/en/contents'
];

async function checkUrl(path) {
    const url = `${BASE_URL}${path}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`❌ [${res.status}] ${url}`);
            return false;
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        const ogImage = $('meta[property="og:image"]').attr('content') || '';

        console.log(`\n🔍 Checking: ${url}`);

        // Check Titles
        if (!title) {
            console.error('  ❌ Title missing');
        } else {
            const titleLen = title.length;
            if (titleLen > 75) {
                console.warn(`  ⚠️ Title too long (${titleLen} chars): ${title}`);
            } else {
                console.log(`  ✅ Title (${titleLen} chars): ${title.length > 50 ? title.substring(0, 50) + '...' : title}`);
            }
        }

        // Check Description
        if (!description) {
            console.error('  ❌ Description missing');
        } else if (description.length > 160) {
            console.warn(`  ⚠️ Description too long (${description.length} chars)`);
        } else {
            console.log(`  ✅ Description: ${description.substring(0, 50)}... (${description.length} chars)`);
        }

        // Check OG Tags
        if (!ogTitle || !ogImage) {
            console.error(`  ❌ Missing OG Tags (Title: ${!!ogTitle}, Image: ${!!ogImage})`);
        } else if (!ogImage.startsWith('http')) {
            console.error(`  ❌ OG Image is not absolute: ${ogImage}`);
        } else {
            console.log(`  ✅ OG Image: ${ogImage}`);
        }

        // Check for Related Spirits Component (only on spirit detail pages)
        if (path.includes('/spirits/')) {
            const relatedLinks = $('a[href*="/spirits/"]').length;
            if (relatedLinks < 2) { // Just checking if they exist, not exactly 6 since test db varies
                console.warn(`  ⚠️ Related spirit links might be missing (found ${relatedLinks})`);
            } else {
                console.log(`  ✅ Found ${relatedLinks - 1} Related Spirit internal links`);
            }
        }

        return true;
    } catch (err) {
        console.error(`❌ Error fetching ${url}: ${err.message}`);
        return false;
    }
}

async function runTests() {
    console.log(`Starting Phase 3 SEO Snippet Checks against ${BASE_URL}...`);
    let passed = 0;
    for (const path of testUrls) {
        const ok = await checkUrl(path);
        if (ok) passed++;
    }
    console.log(`\n🏁 Completed: ${passed}/${testUrls.length} pages passed basic checks.`);
}

runTests();
