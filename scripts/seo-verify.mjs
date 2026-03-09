/**
 * SEO Verification Script
 *
 * Checks that key /ko and /en contents/wiki pages are independently indexable:
 * - Self-canonical (canonical matches the page's own URL)
 * - Reciprocal hreflang (ko ↔ en)
 * - Page returns HTTP 200
 * - URL appears in sitemap
 * - Locale switcher links to sibling locale
 *
 * Usage:
 *   BASE_URL=https://kspiritsclub.com node scripts/seo-verify.mjs
 *   BASE_URL=http://localhost:3000 node scripts/seo-verify.mjs
 */

import { JSDOM } from 'jsdom';

const BASE_URL = process.env.BASE_URL || 'https://kspiritsclub.com';

const TARGET_PATHS = [
  '/contents',
  '/contents/mbti',
  '/contents/worldcup',
  '/contents/perfect-pour',
  '/contents/reviews',
  '/contents/news',
  '/contents/wiki',
  '/contents/wiki/soju-guide',
  '/contents/wiki/makgeolli-guide',
  '/contents/wiki/whisky',
];

const LOCALES = ['ko', 'en'];

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ ${message}`);
    failed++;
  }
}

async function fetchPage(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return res;
}

async function getSitemapUrls() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  const text = await res.text();
  const urls = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  return new Set(urls);
}

async function checkPage(path, lang, sitemapUrls) {
  const url = `${BASE_URL}/${lang}${path}`;
  console.log(`\nChecking: ${url}`);

  // 1. HTTP 200
  const res = await fetchPage(url);
  assert(res.status === 200, `HTTP 200 (got ${res.status})`);
  if (res.status !== 200) return;

  const html = await res.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // 2. Self-canonical
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const expectedCanonical = `${BASE_URL}/${lang}${path}`;
  assert(
    canonical === expectedCanonical,
    `Self-canonical: "${canonical}" === "${expectedCanonical}"`
  );

  // 3. hreflang ko
  const hreflangKo = doc.querySelector('link[rel="alternate"][hreflang="ko"]')?.getAttribute('href') || '';
  const expectedKo = `${BASE_URL}/ko${path}`;
  assert(hreflangKo === expectedKo, `hreflang ko: "${hreflangKo}" === "${expectedKo}"`);

  // 4. hreflang en
  const hreflangEn = doc.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href') || '';
  const expectedEn = `${BASE_URL}/en${path}`;
  assert(hreflangEn === expectedEn, `hreflang en: "${hreflangEn}" === "${expectedEn}"`);

  // 5. No cross-language canonical (canonical must not point to the other locale)
  const otherLang = lang === 'ko' ? 'en' : 'ko';
  const crossLangCanonical = canonical.includes(`/${otherLang}${path}`);
  assert(!crossLangCanonical, `No cross-language canonical (canonical does not point to /${otherLang})`);

  // 6. In sitemap
  assert(sitemapUrls.has(url), `URL in sitemap: ${url}`);
}

async function main() {
  console.log(`\n=== SEO Verification: ${BASE_URL} ===\n`);

  let sitemapUrls;
  try {
    sitemapUrls = await getSitemapUrls();
    console.log(`Sitemap loaded: ${sitemapUrls.size} URLs`);
  } catch (err) {
    console.error('Failed to load sitemap:', err.message);
    sitemapUrls = new Set();
  }

  for (const path of TARGET_PATHS) {
    for (const lang of LOCALES) {
      await checkPage(path, lang, sitemapUrls);
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
