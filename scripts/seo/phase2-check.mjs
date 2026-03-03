import https from 'https';
import http from 'http';

const BASE_URL = process.env.BASE_URL || 'https://kspiritsclub.com';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', err => reject(err));
    });
}

async function runChecks() {
    console.log(`Starting SEO Phase 2 Checks against ${BASE_URL}...\n`);
    let hasErrors = false;

    // 1. Check Sitemap
    console.log('--- 1. Sitemap Check ---');
    try {
        const { status, data } = await fetchUrl(`${BASE_URL}/sitemap.xml`);
        if (status !== 200) {
            console.error(`❌ Sitemap returned status ${status} (Expected 200)`);
            hasErrors = true;
        } else {
            console.log('✅ Sitemap returns 200 OK');

            const urls = [...data.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
            console.log(`Found ${urls.length} URLs in sitemap`);

            const nonCanonical = urls.filter(u => !u.includes('/ko/') && !u.includes('/en/') && !u.includes('/ko') && !u.includes('/en'));

            // Filter out root base URL in case it's there
            const genuineNonCanonical = nonCanonical.filter(u => u !== BASE_URL && u !== `${BASE_URL}/`);

            if (genuineNonCanonical.length > 0) {
                console.error(`❌ Found non-canonical URLs (missing /ko or /en):\n`, genuineNonCanonical.slice(0, 5));
                hasErrors = true;
            } else {
                console.log('✅ All URLs are canonical (start with host and /ko or /en)');
            }

            const duplicates = urls.filter((item, index) => urls.indexOf(item) !== index);
            if (duplicates.length > 0) {
                console.error(`❌ Found ${duplicates.length} duplicate URLs:\n`, duplicates.slice(0, 5));
                hasErrors = true;
            } else {
                console.log('✅ No duplicate URLs');
            }

            const withQueryParams = urls.filter(u => u.includes('?'));
            if (withQueryParams.length > 0) {
                console.error(`❌ Found URLs with query strings:\n`, withQueryParams.slice(0, 5));
                hasErrors = true;
            } else {
                console.log('✅ No query strings in URLs');
            }

            const disallowedPaths = urls.filter(u => u.match(/\/[a-z]{2}\/(cabinet|me|admin)($|\/)/) || u.includes('/api/'));
            if (disallowedPaths.length > 0) {
                console.error(`❌ Found disallowed paths in sitemap:\n`, disallowedPaths.slice(0, 5));
                hasErrors = true;
            } else {
                console.log('✅ No disallowed paths (/cabinet, /me, /admin) in sitemap');
            }
        }
    } catch (err) {
        console.error(`❌ Failed to fetch sitemap: ${err.message}`);
        hasErrors = true;
    }

    // 2. Check Robots.txt
    console.log('\n--- 2. Robots.txt Check ---');
    try {
        const { status, data } = await fetchUrl(`${BASE_URL}/robots.txt`);
        if (status !== 200) {
            console.error(`❌ Robots.txt returned status ${status} (Expected 200)`);
            hasErrors = true;
        } else {
            console.log('✅ Robots.txt returns 200 OK');

            if (!data.includes('Sitemap:')) {
                console.error(`❌ Missing Sitemap directive`);
                hasErrors = true;
            } else {
                console.log('✅ Sitemap directive found');
            }

            if (!data.includes('Disallow: /ko/cabinet') || !data.includes('Disallow: /en/cabinet')) {
                console.error(`❌ Missing strict Disallow rules for private routes`);
                hasErrors = true;
            } else {
                console.log('✅ Disallow rules for private routes found');
            }

            if (data.includes('Disallow: /*?*')) {
                console.error(`❌ Found overly broad Disallow: /*?* which blocks Next.js images`);
                hasErrors = true;
            } else {
                console.log('✅ No overly broad Disallow: /*?* found');
            }
        }
    } catch (err) {
        console.error(`❌ Failed to fetch robots.txt: ${err.message}`);
        hasErrors = true;
    }

    const tierA = process.env.TEST_TIER_A;
    const tierB = process.env.TEST_TIER_B;

    if (tierA || tierB) {
        console.log('\n--- 3. Spirit pages robots meta check ---');
        if (tierA) {
            try {
                const { status, data } = await fetchUrl(`${BASE_URL}/ko/spirits/${tierA}`);
                if (status === 200 && !data.includes('noindex')) {
                    console.log(`✅ Tier A spirit (${tierA}) does NOT contain noindex`);
                } else {
                    console.error(`❌ Tier A spirit (${tierA}) failed: status ${status}, or contained 'noindex'`);
                    hasErrors = true;
                }
            } catch (e) { console.error('❌ Failed tierA fetch', e); hasErrors = true; }
        }
        if (tierB) {
            try {
                const { status, data } = await fetchUrl(`${BASE_URL}/ko/spirits/${tierB}`);
                if (status === 200 && data.includes('noindex')) {
                    console.log(`✅ Tier B spirit (${tierB}) contained noindex`);
                } else {
                    console.error(`❌ Tier B spirit (${tierB}) failed: status ${status}, or missing 'noindex'`);
                    hasErrors = true;
                }
            } catch (e) { console.error('❌ Failed tierB fetch', e); hasErrors = true; }
        }
    }

    if (hasErrors) {
        console.error('\n❌ SEO Phase 2 Checks FAILED');
        process.exit(1);
    } else {
        console.log('\n✅ SEO Phase 2 Checks PASSED!');
        process.exit(0);
    }
}

runChecks();
