#!/usr/bin/env node
/**
 * SEO Regression Check Suite — K-Spirits Club
 *
 * Covers:
 *   A. Public HTML quality
 *   B. Metadata (title, description, canonical, hreflang, OG/Twitter)
 *   C. Sitemap / robots.txt
 *   D. Spirit route checks (indexable / thin / missing)
 *   E. Contents / archive pagination checks
 *   F. Crawlable internal links
 *   G. Private/auth route safety (code-inspection — no login required)
 *
 * Usage:
 *   node scripts/seo/regression-check.mjs [base-url]
 *   BASE_URL=https://kspiritsclub.com node scripts/seo/regression-check.mjs
 *
 * Exit code: 0 = pass, 1 = one or more BLOCKER failures detected
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../');

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';
const CANONICAL_DOMAIN = 'https://kspiritsclub.com';

// Thresholds — extracted as named constants for maintainability
/** Minimum characters in <main> text to consider a page has real SSR content (not just shell). */
const MIN_MAIN_CONTENT_LENGTH = 100;
/** Minimum characters in meta description to consider it meaningful. */
const MIN_DESCRIPTION_LENGTH = 50;
/** Minimum crawlable deep-section links expected in the contents hub. */
const MIN_EXPECTED_DEEP_LINKS = 3;

/**
 * Fixture IDs — replace with real values for staging/production runs.
 *
 * The default indexableSpiritId ('mfds-202600027635') is referenced in the issue spec.
 * This ID must remain a Tier A (indexable) spirit in the database; update the
 * SEO_INDEXABLE_SPIRIT_ID env var if the default record is ever removed or changed.
 */
const FIXTURES = {
  indexableSpiritId: process.env.SEO_INDEXABLE_SPIRIT_ID || 'mfds-202600027635',
  thinSpiritId: process.env.SEO_THIN_SPIRIT_ID || '',          // set if known
  missingSpiritId: process.env.SEO_MISSING_SPIRIT_ID || 'nonexistent-spirit-xyz-000',
  sampleWikiSlug: process.env.SEO_WIKI_SLUG || 'korean-soju',
};

// ─────────────────────────────────────────────────────────────────────────────
// Result tracking
// ─────────────────────────────────────────────────────────────────────────────

const RESULTS = [];
let blockerCount = 0;
let warnCount = 0;

function pass(section, label, detail = '') {
  RESULTS.push({ level: 'PASS', section, label, detail });
}
function warn(section, label, detail = '') {
  warnCount++;
  RESULTS.push({ level: 'WARN', section, label, detail });
}
function fail(section, label, detail = '') {
  blockerCount++;
  RESULTS.push({ level: 'FAIL', section, label, detail });
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helpers
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KSpiritsSEOBot/1.0 (regression-check)' },
      redirect: 'follow',
    });
    const text = await res.text();
    return { ok: true, status: res.status, html: text, finalUrl: res.url };
  } catch (err) {
    return { ok: false, status: 0, html: '', finalUrl: url, error: err.message };
  }
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KSpiritsSEOBot/1.0 (regression-check)' },
    });
    const text = await res.text();
    return { ok: true, status: res.status, text };
  } catch (err) {
    return { ok: false, status: 0, text: '', error: err.message };
  }
}

function parseHtml(html) {
  return cheerio.load(html);
}

// ─────────────────────────────────────────────────────────────────────────────
// A. Public HTML quality
// ─────────────────────────────────────────────────────────────────────────────

/** Strings that indicate a loading shell was served instead of SSR content. */
const LOADING_SHELL_PATTERNS = [
  /Loading Spirit Data/i,
  /Fetching tastes\.\.\./i,
  /Fetching latest news/i,
  /Fetching spirits\.\.\./i,
  /Loading\.\.\./i,
];

const PUBLIC_PAGES = [
  { path: '/ko', label: 'Korean homepage' },
  { path: '/en', label: 'English homepage' },
  { path: '/en/contents/mbti', label: 'MBTI page' },
  { path: '/en/contents/worldcup', label: 'Worldcup page' },
  { path: '/en/contents/reviews', label: 'Reviews archive' },
  { path: '/en/contents/news', label: 'News archive' },
  { path: '/en/contents/wiki', label: 'Wiki hub' },
  { path: `/en/contents/wiki/${FIXTURES.sampleWikiSlug}`, label: `Wiki category (${FIXTURES.sampleWikiSlug})` },
];

async function checkPublicHtmlQuality() {
  console.log('\n─── A. Public HTML quality ───');
  for (const page of PUBLIC_PAGES) {
    const url = `${BASE_URL}${page.path}`;
    const result = await fetchPage(url);

    if (!result.ok || result.status !== 200) {
      fail('A', `${page.label} — status`, `Expected 200, got ${result.status} (${url})`);
      continue;
    }
    pass('A', `${page.label} — status 200`, url);

    // Loading-shell leakage check
    let leaked = null;
    for (const pattern of LOADING_SHELL_PATTERNS) {
      if (pattern.test(result.html)) { leaked = pattern.toString(); break; }
    }
    if (leaked) {
      fail('A', `${page.label} — loading-shell leakage`, `Pattern matched: ${leaked}`);
    } else {
      pass('A', `${page.label} — no loading-shell leakage`);
    }

    // Main content exists (not just shell + footer)
    const $ = parseHtml(result.html);
    const mainContent = $('main').text().trim();
    if (mainContent.length < MIN_MAIN_CONTENT_LENGTH) {
      fail('A', `${page.label} — main content too thin`, `main text length: ${mainContent.length}`);
    } else {
      pass('A', `${page.label} — main content present`, `${mainContent.length} chars`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// B. Metadata checks
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_SUFFIX = 'K-Spirits Club';

async function checkMetadata() {
  console.log('\n─── B. Metadata ───');

  const metaPages = [
    { path: '/ko', lang: 'ko', label: 'Korean homepage', expectNoindex: false },
    { path: '/en', lang: 'en', label: 'English homepage', expectNoindex: false },
    { path: '/ko/contents', lang: 'ko', label: 'Contents hub (ko)', expectNoindex: false },
    { path: '/en/contents', lang: 'en', label: 'Contents hub (en)', expectNoindex: false },
    { path: '/en/contents/reviews', lang: 'en', label: 'Reviews page', expectNoindex: false },
    { path: '/en/contents/news', lang: 'en', label: 'News page', expectNoindex: false },
    { path: '/en/contents/wiki', lang: 'en', label: 'Wiki hub', expectNoindex: false },
    { path: '/en/contents/contact', lang: 'en', label: 'Contact (noindex)', expectNoindex: true },
  ];

  for (const page of metaPages) {
    const url = `${BASE_URL}${page.path}`;
    const result = await fetchPage(url);
    if (!result.ok || result.status !== 200) {
      warn('B', `${page.label} — skipped (status ${result.status})`);
      continue;
    }

    const $ = parseHtml(result.html);
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const hreflangKo = $('link[rel="alternate"][hreflang="ko"]').attr('href') || '';
    const hreflangEn = $('link[rel="alternate"][hreflang="en"]').attr('href') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDesc = $('meta[property="og:description"]').attr('content') || '';
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const noindex = /noindex/i.test(robotsMeta);

    const sec = 'B';

    // Title exists
    if (!title) {
      fail(sec, `${page.label} — title missing`);
    } else {
      pass(sec, `${page.label} — title exists`, title.slice(0, 60));
    }

    // No double brand suffix (e.g. "Foo | K-Spirits Club | K-Spirits Club")
    const brandCount = (title.split(BRAND_SUFFIX).length - 1);
    if (brandCount > 1) {
      fail(sec, `${page.label} — double brand suffix`, title);
    } else if (title && brandCount === 1) {
      pass(sec, `${page.label} — brand suffix OK`);
    }

    // Title locale alignment: KO pages should have Korean chars, EN pages should not be Korean-only
    if (page.lang === 'ko' && title && /[가-힣]/.test(title)) {
      pass(sec, `${page.label} — title has Korean chars as expected`);
    } else if (page.lang === 'en' && title && !/^[가-힣\s]+$/.test(title)) {
      pass(sec, `${page.label} — title is not purely Korean chars`);
    }

    // Description
    if (!description) {
      warn(sec, `${page.label} — description missing`);
    } else if (description.length < MIN_DESCRIPTION_LENGTH) {
      warn(sec, `${page.label} — description very short`, `"${description}"`);
    } else {
      pass(sec, `${page.label} — description present`, `${description.length} chars`);
    }

    // Canonical is absolute and matches expected domain (when running against prod)
    if (!canonical) {
      warn(sec, `${page.label} — canonical missing`);
    } else if (!canonical.startsWith('http')) {
      fail(sec, `${page.label} — canonical is not absolute`, canonical);
    } else {
      pass(sec, `${page.label} — canonical is absolute`, canonical);
    }

    // Self-canonical: canonical must match the page's own locale path (no cross-locale leak)
    if (canonical) {
      const canonicalPath = canonical.replace(CANONICAL_DOMAIN, '').replace(/^https?:\/\/[^/]+/, '');
      if (!canonicalPath.includes(`/${page.lang}/`)) {
        warn(sec, `${page.label} — canonical may not match page locale`, canonical);
      }
    }

    // Hreflang reciprocal: both ko and en alternates must exist
    if (!hreflangKo || !hreflangEn) {
      warn(sec, `${page.label} — hreflang incomplete (ko: ${!!hreflangKo}, en: ${!!hreflangEn})`);
    } else {
      pass(sec, `${page.label} — hreflang alternates present`);
    }

    // OG metadata
    if (!ogTitle) {
      warn(sec, `${page.label} — og:title missing`);
    } else {
      pass(sec, `${page.label} — og:title present`);
    }
    if (!ogDesc) {
      warn(sec, `${page.label} — og:description missing`);
    }

    // Noindex expectation
    if (page.expectNoindex && !noindex) {
      fail(sec, `${page.label} — expected noindex but not set`, robotsMeta || '(no robots meta)');
    } else if (!page.expectNoindex && noindex) {
      fail(sec, `${page.label} — unexpected noindex`, robotsMeta);
    } else {
      pass(sec, `${page.label} — noindex=${noindex} (as expected)`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// C. Sitemap / robots.txt
// ─────────────────────────────────────────────────────────────────────────────

const SITEMAP_MUST_INCLUDE = [
  '/ko',
  '/en',
  '/ko/contents',
  '/en/contents',
  '/ko/contents/wiki',
  '/en/contents/wiki',
  '/ko/contents/reviews',
  '/en/contents/reviews',
  '/ko/contents/news',
  '/en/contents/news',
];

const SITEMAP_MUST_EXCLUDE_PATTERNS = [
  /\/cabinet/,
  /\/me(?:\/|$)/,
  /\/admin/,
  /\?/,          // query strings
  /\/contact/,   // utility/noindex page
];

const ROBOTS_MUST_DISALLOW = ['/ko/cabinet', '/en/cabinet', '/ko/me', '/en/me', '/ko/admin', '/en/admin', '/api/'];

async function checkSitemapRobots() {
  console.log('\n─── C. Sitemap / robots.txt ───');

  // --- Sitemap ---
  const sitemapResult = await fetchText(`${BASE_URL}/sitemap.xml`);
  if (!sitemapResult.ok || sitemapResult.status !== 200) {
    fail('C', 'Sitemap returns 200', `Got ${sitemapResult.status}`);
    return;
  }
  pass('C', 'Sitemap returns 200');

  const sitemapUrls = [...sitemapResult.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  pass('C', `Sitemap URL count`, `${sitemapUrls.length} entries`);

  // Must-include checks
  for (const required of SITEMAP_MUST_INCLUDE) {
    const found = sitemapUrls.some(u => u.includes(required));
    if (found) {
      pass('C', `Sitemap includes ${required}`);
    } else {
      fail('C', `Sitemap missing required path`, required);
    }
  }

  // Must-exclude checks
  for (const pattern of SITEMAP_MUST_EXCLUDE_PATTERNS) {
    const violators = sitemapUrls.filter(u => pattern.test(u));
    if (violators.length > 0) {
      fail('C', `Sitemap contains excluded pattern ${pattern}`, violators.slice(0, 3).join(', '));
    } else {
      pass('C', `Sitemap excludes pattern ${pattern}`);
    }
  }

  // No duplicate URLs
  const unique = new Set(sitemapUrls);
  if (unique.size !== sitemapUrls.length) {
    fail('C', 'Sitemap contains duplicate URLs', `${sitemapUrls.length - unique.size} duplicates`);
  } else {
    pass('C', 'Sitemap has no duplicate URLs');
  }

  // All sitemap URLs have locale prefix
  const nonLocale = sitemapUrls.filter(u => {
    const parsed = u.replace(/^https?:\/\/[^/]+/, '');
    return parsed !== '' && !parsed.startsWith('/ko') && !parsed.startsWith('/en');
  });
  if (nonLocale.length > 0) {
    fail('C', 'Sitemap contains non-locale URLs', nonLocale.slice(0, 3).join(', '));
  } else {
    pass('C', 'All sitemap URLs have locale prefix (/ko or /en)');
  }

  // --- robots.txt ---
  const robotsResult = await fetchText(`${BASE_URL}/robots.txt`);
  if (!robotsResult.ok || robotsResult.status !== 200) {
    fail('C', 'robots.txt returns 200', `Got ${robotsResult.status}`);
    return;
  }
  pass('C', 'robots.txt returns 200');

  const robotsTxt = robotsResult.text;

  // Must reference sitemap
  if (/sitemap/i.test(robotsTxt)) {
    pass('C', 'robots.txt references sitemap');
  } else {
    warn('C', 'robots.txt does not reference sitemap');
  }

  // Must disallow private paths
  for (const disallowPath of ROBOTS_MUST_DISALLOW) {
    if (robotsTxt.includes(`Disallow: ${disallowPath}`)) {
      pass('C', `robots.txt disallows ${disallowPath}`);
    } else {
      fail('C', `robots.txt missing Disallow for ${disallowPath}`);
    }
  }

  // Must not over-disallow main public paths
  const overDisallowPatterns = [/Disallow:\s*\/$/m, /Disallow:\s*\/ko\s*$/m, /Disallow:\s*\/en\s*$/m];
  for (const pattern of overDisallowPatterns) {
    if (pattern.test(robotsTxt)) {
      fail('C', `robots.txt over-disallows public paths`, `Pattern matched: ${pattern}`);
    }
  }
  pass('C', 'robots.txt does not over-disallow public paths');
}

// ─────────────────────────────────────────────────────────────────────────────
// D. Spirit route checks
// ─────────────────────────────────────────────────────────────────────────────

async function checkSpiritRoutes() {
  console.log('\n─── D. Spirit routes ───');

  const indexableId = FIXTURES.indexableSpiritId;
  const thinId = FIXTURES.thinSpiritId;
  const missingId = FIXTURES.missingSpiritId;

  // D1. Indexable spirit — should return 200 with real content
  for (const lang of ['ko', 'en']) {
    const url = `${BASE_URL}/${lang}/spirits/${indexableId}`;
    const result = await fetchPage(url);
    if (!result.ok || result.status !== 200) {
      fail('D', `Indexable spirit (${lang}) — status 200`, `Got ${result.status}`);
      continue;
    }
    pass('D', `Indexable spirit (${lang}) — status 200`);

    const $ = parseHtml(result.html);
    const title = $('title').text();
    const robots = $('meta[name="robots"]').attr('content') || '';
    const noindex = /noindex/i.test(robots);

    // Must not be noindex
    if (noindex) {
      fail('D', `Indexable spirit (${lang}) — must not have noindex`, robots);
    } else {
      pass('D', `Indexable spirit (${lang}) — correctly indexable`);
    }

    // Title must not be generic fallback
    if (!title || title === 'Spirit | K-Spirits Club') {
      warn('D', `Indexable spirit (${lang}) — title looks like fallback`, title);
    } else {
      pass('D', `Indexable spirit (${lang}) — title is specific`, title.slice(0, 60));
    }

    // Loading shell check
    let leaked = null;
    for (const pattern of LOADING_SHELL_PATTERNS) {
      if (pattern.test(result.html)) { leaked = pattern.toString(); break; }
    }
    if (leaked) {
      fail('D', `Indexable spirit (${lang}) — loading-shell leakage`, leaked);
    } else {
      pass('D', `Indexable spirit (${lang}) — no loading-shell leakage`);
    }

    // EN page must not leak Korean-only taxonomy in title/description
    if (lang === 'en') {
      const desc = $('meta[name="description"]').attr('content') || '';
      const localeTitleKoOnly = /^[가-힣\s·\-()]+$/.test(title);
      if (localeTitleKoOnly) {
        fail('D', 'EN spirit — title is Korean-only (locale leakage)', title);
      }
      // Check description for explicit KO-only text (warn, not fail — mixed chars expected)
      if (/[가-힣]{10,}/.test(desc)) {
        warn('D', 'EN spirit — description contains extended Korean text', desc.slice(0, 80));
      }
    }
  }

  // D2. Thin spirit (noindex check) — only if fixture ID is provided
  if (thinId) {
    for (const lang of ['ko', 'en']) {
      const url = `${BASE_URL}/${lang}/spirits/${thinId}`;
      const result = await fetchPage(url);
      if (!result.ok || result.status !== 200) {
        warn('D', `Thin spirit (${lang}) — unexpected status`, `Got ${result.status}`);
        continue;
      }
      const $ = parseHtml(result.html);
      const robots = $('meta[name="robots"]').attr('content') || '';
      if (/noindex/i.test(robots)) {
        pass('D', `Thin spirit (${lang}) — correctly noindex`);
      } else {
        fail('D', `Thin spirit (${lang}) — expected noindex not found`, robots);
      }
    }
  } else {
    warn('D', 'Thin spirit check skipped — set SEO_THIN_SPIRIT_ID env var to enable');
  }

  // D3. Missing spirit — should return 404
  for (const lang of ['ko', 'en']) {
    const url = `${BASE_URL}/${lang}/spirits/${missingId}`;
    const result = await fetchPage(url);
    if (result.status === 404) {
      pass('D', `Missing spirit (${lang}) — correctly returns 404`);
    } else if (result.status === 200) {
      // Check if it's a noindex thin-content 200 (acceptable) or a misleading 200
      const $ = parseHtml(result.html);
      const robots = $('meta[name="robots"]').attr('content') || '';
      if (/noindex/i.test(robots)) {
        warn('D', `Missing spirit (${lang}) — returns 200+noindex instead of 404`, url);
      } else {
        fail('D', `Missing spirit (${lang}) — returns indexable 200 for nonexistent ID`, url);
      }
    } else {
      warn('D', `Missing spirit (${lang}) — unexpected status ${result.status}`, url);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// E. Contents / archive pagination checks
// ─────────────────────────────────────────────────────────────────────────────

async function checkArchives() {
  console.log('\n─── E. Contents / archive pagination ───');

  const archivePages = [
    { path: '/en/contents/reviews', label: 'Reviews page 1' },
    { path: '/en/contents/news', label: 'News page 1' },
  ];

  for (const page of archivePages) {
    const url = `${BASE_URL}${page.path}`;
    const result = await fetchPage(url);
    if (!result.ok || result.status !== 200) {
      fail('E', `${page.label} — status 200`, `Got ${result.status}`);
      continue;
    }
    pass('E', `${page.label} — status 200`);

    const $ = parseHtml(result.html);

    // Should SSR real list items (anchor links to individual items)
    const itemLinks = $('a[href]').filter((_, el) => {
      const href = $(el).attr('href') || '';
      return href.includes('/spirits/') || href.includes('/reviews/') || href.includes('/news/');
    });
    if (itemLinks.length === 0) {
      warn('E', `${page.label} — no SSR item links found (client-only render?)`);
    } else {
      pass('E', `${page.label} — SSR item links present`, `${itemLinks.length} links`);
    }

    // Should not be noindex on page 1
    const robots = $('meta[name="robots"]').attr('content') || '';
    if (/noindex/i.test(robots)) {
      fail('E', `${page.label} — page 1 should not be noindex`, robots);
    } else {
      pass('E', `${page.label} — page 1 is indexable`);
    }

    // Canonical on page 1 must not include ?page=
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    if (canonical.includes('?page=')) {
      fail('E', `${page.label} — page 1 canonical should not contain ?page=`, canonical);
    } else if (canonical) {
      pass('E', `${page.label} — page 1 canonical clean`, canonical);
    }
  }

  // Pagination page 2 — canonical should include ?page=2 and be indexable
  const paginationPage = '/en/contents/reviews?page=2';
  const p2Result = await fetchPage(`${BASE_URL}${paginationPage}`);
  if (p2Result.ok && p2Result.status === 200) {
    const $ = parseHtml(p2Result.html);
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    const noindex = /noindex/i.test(robots);

    if (canonical.includes('?page=2')) {
      pass('E', 'Reviews page 2 — canonical self-references ?page=2', canonical);
    } else {
      warn('E', 'Reviews page 2 — canonical may not reference pagination', canonical);
    }

    if (!noindex) {
      pass('E', 'Reviews page 2 — indexable (pagination page)');
    } else {
      warn('E', 'Reviews page 2 — noindex set (acceptable if policy), verify intent');
    }
  } else {
    warn('E', `Reviews page 2 — could not verify (status: ${p2Result.status})`);
  }

  // Search/filter variants should be noindex
  const filterVariants = [
    { path: '/en/contents/reviews?q=whisky', label: 'Reviews search query' },
    { path: '/en/contents/reviews?sort=popular', label: 'Reviews sort variant' },
    { path: '/en/contents/news?tag=trending', label: 'News tag filter' },
  ];

  for (const variant of filterVariants) {
    const url = `${BASE_URL}${variant.path}`;
    const result = await fetchPage(url);
    if (!result.ok || result.status !== 200) {
      warn('E', `${variant.label} — could not verify (status: ${result.status})`);
      continue;
    }
    const $ = parseHtml(result.html);
    const robots = $('meta[name="robots"]').attr('content') || '';
    if (/noindex/i.test(robots)) {
      pass('E', `${variant.label} — correctly noindex`);
    } else {
      fail('E', `${variant.label} — should be noindex to prevent duplicate content`, variant.path);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// F. Crawlable internal links
// ─────────────────────────────────────────────────────────────────────────────

async function checkCrawlableLinks() {
  console.log('\n─── F. Crawlable internal links ───');

  // Contents hub must have deep crawlable links to sub-sections
  const contentsUrl = `${BASE_URL}/en/contents`;
  const result = await fetchPage(contentsUrl);
  if (!result.ok || result.status !== 200) {
    warn('F', 'Contents hub — could not verify crawlable links');
    return;
  }

  const $ = parseHtml(result.html);
  const allLinks = $('a[href]').map((_, el) => $(el).attr('href')).get();

  const deepLinks = allLinks.filter(href =>
    href && (
      href.includes('/contents/reviews') ||
      href.includes('/contents/news') ||
      href.includes('/contents/wiki') ||
      href.includes('/contents/mbti') ||
      href.includes('/contents/worldcup')
    )
  );

  if (deepLinks.length < MIN_EXPECTED_DEEP_LINKS) {
    fail('F', 'Contents hub — fewer than 3 deep section links found', `Links: ${deepLinks.join(', ')}`);
  } else {
    pass('F', 'Contents hub — contains deep crawlable links', `${deepLinks.length} links`);
  }

  // Locale links must stay in locale
  const enLinks = allLinks.filter(href => href && (href.startsWith('/en/') || href.startsWith('https://kspiritsclub.com/en/')));
  const koLinksOnEn = allLinks.filter(href => href && (href.startsWith('/ko/') || href.startsWith('https://kspiritsclub.com/ko/')));
  if (koLinksOnEn.length > 0) {
    warn('F', 'EN contents hub — has links pointing to /ko/ paths', koLinksOnEn.slice(0, 3).join(', '));
  } else {
    pass('F', 'EN contents hub — locale links stay in /en/');
  }

  // Wiki hub must have links to individual category pages
  const wikiUrl = `${BASE_URL}/en/contents/wiki`;
  const wikiResult = await fetchPage(wikiUrl);
  if (wikiResult.ok && wikiResult.status === 200) {
    const $w = parseHtml(wikiResult.html);
    const wikiCategoryLinks = $w('a[href]').filter((_, el) => {
      const href = $w(el).attr('href') || '';
      return /\/contents\/wiki\/[^/]+/.test(href);
    });
    if (wikiCategoryLinks.length === 0) {
      fail('F', 'Wiki hub — no crawlable links to category pages found');
    } else {
      pass('F', 'Wiki hub — crawlable category links present', `${wikiCategoryLinks.length} links`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// G. Private/auth route safety (code inspection — no login required)
// ─────────────────────────────────────────────────────────────────────────────

function readSourceFile(relPath) {
  const absPath = path.join(REPO_ROOT, relPath);
  try {
    return fs.readFileSync(absPath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Returns true if a source file signals noindex via any of the standard patterns:
 *   robots: { index: false, ... }
 *   robots: { noindex: true }
 *   "noindex" string literal (robots meta string)
 */
function hasNoindexInSource(src) {
  return (
    /robots.*noindex/i.test(src) ||
    /noindex.*true/i.test(src) ||
    /index:\s*false/i.test(src)
  );
}

async function checkPrivateRouteSafety() {
  console.log('\n─── G. Private/auth route safety (code inspection) ───');

  // G1. robots.ts must block private paths at the crawl level
  const robotsSource = readSourceFile('app/robots.ts');
  if (!robotsSource) {
    fail('G', 'robots.ts source file not found');
  } else {
    const privatePaths = ['/ko/cabinet', '/en/cabinet', '/ko/me', '/en/me', '/ko/admin', '/en/admin'];
    for (const p of privatePaths) {
      if (robotsSource.includes(`'${p}'`) || robotsSource.includes(`"${p}"`)) {
        pass('G', `robots.ts disallows ${p}`);
      } else {
        fail('G', `robots.ts missing disallow for ${p}`);
      }
    }
  }

  // G2. sitemap.ts must not include private paths
  const sitemapSource = readSourceFile('app/sitemap.ts');
  if (!sitemapSource) {
    fail('G', 'sitemap.ts source file not found');
  } else {
    const bannedInSitemap = ['/cabinet', '/me', '/admin'];
    for (const p of bannedInSitemap) {
      // Look for path literal being added to routes array
      const leakPattern = new RegExp(`path:\\s*['"\`].*${p.replace('/', '\\/')}`, 'i');
      if (leakPattern.test(sitemapSource)) {
        fail('G', `sitemap.ts appears to include private path ${p}`);
      } else {
        pass('G', `sitemap.ts does not include private path ${p}`);
      }
    }
    // Confirm private pages comment is present (documentation guard)
    if (/NON-INDEXABLE|cabinet.*excluded|private/i.test(sitemapSource)) {
      pass('G', 'sitemap.ts has documented exclusion comment for private pages');
    } else {
      warn('G', 'sitemap.ts missing explicit comment about private page exclusion');
    }
  }

  // G3. Cabinet page must not have robots: { index: true }
  const cabinetSource = readSourceFile('app/[lang]/cabinet/page.tsx');
  if (!cabinetSource) {
    warn('G', 'Cabinet page source not found — skipping');
  } else {
    // Match only "index: true" (not "index: false" followed by "follow: true")
    if (/index\s*:\s*true/i.test(cabinetSource) && !/index\s*:\s*false/i.test(cabinetSource)) {
      fail('G', 'Cabinet page — explicitly sets robots index:true (should not be publicly indexable)');
    } else {
      pass('G', 'Cabinet page — does not explicitly set robots index:true');
    }
    // G3b. Cabinet page should have explicit noindex
    if (/index\s*:\s*false/i.test(cabinetSource)) {
      pass('G', 'Cabinet page — has explicit robots noindex');
    } else {
      fail('G', 'Cabinet page — missing explicit robots noindex (private page must be noindex)');
    }
    // Cabinet page should not have public-style meta description (generic site desc is fine)
    if (/generateMetadata/i.test(cabinetSource)) {
      pass('G', 'Cabinet page — has generateMetadata function');
    }
    // Check that the canonical is for /cabinet, not a public page path
    if (cabinetSource.includes('/cabinet')) {
      pass('G', 'Cabinet page — canonical references /cabinet path');
    } else {
      warn('G', 'Cabinet page — canonical path may not reference /cabinet');
    }
  }

  // G4. Me (profile) page must not have robots: { index: true }
  const meSource = readSourceFile('app/[lang]/me/page.tsx');
  if (!meSource) {
    warn('G', 'Me/profile page source not found — skipping');
  } else {
    // Match only "index: true" (not "index: false" followed by "follow: true")
    if (/index\s*:\s*true/i.test(meSource) && !/index\s*:\s*false/i.test(meSource)) {
      fail('G', 'Me page — explicitly sets robots index:true (should not be publicly indexable)');
    } else {
      pass('G', 'Me page — does not explicitly set robots index:true');
    }
    // G4b. Me page should have explicit noindex
    if (/index\s*:\s*false/i.test(meSource)) {
      pass('G', 'Me page — has explicit robots noindex');
    } else {
      fail('G', 'Me page — missing explicit robots noindex (private page must be noindex)');
    }
  }

  // G5. Verify the indexable-tier utility is used (not bypassed) in spirit pages
  const spiritPageSource = readSourceFile('app/[lang]/spirits/[id]/page.tsx');
  if (!spiritPageSource) {
    warn('G', 'Spirit detail page source not found — skipping');
  } else {
    if (/isIndexableSpirit|getSpiritRobotsMeta|FOUND_INDEXABLE|isIndexable/i.test(spiritPageSource)) {
      pass('G', 'Spirit page — uses indexable-tier classification');
    } else {
      fail('G', 'Spirit page — does not appear to use indexable-tier classification (regression risk)');
    }
    // Must set robots: noindex for Tier B spirits
    if (/robots.*index.*false|noindex/i.test(spiritPageSource)) {
      pass('G', 'Spirit page — has noindex path for thin content');
    } else {
      fail('G', 'Spirit page — no noindex code path found for thin spirits');
    }
  }

  // G6. Contact page must have noindex
  const contactSource = readSourceFile('app/[lang]/contents/contact/page.tsx');
  if (!contactSource) {
    warn('G', 'Contact page source not found — skipping');
  } else {
    if (hasNoindexInSource(contactSource)) {
      pass('G', 'Contact page — has noindex');
    } else {
      fail('G', 'Contact page — missing noindex (utility page should not be indexed)');
    }
  }

  // G7. Terms and privacy pages — should have noindex
  for (const utilityPage of ['terms', 'privacy']) {
    const src = readSourceFile(`app/[lang]/contents/${utilityPage}/page.tsx`);
    if (!src) {
      warn('G', `${utilityPage} page source not found — skipping`);
      continue;
    }
    if (hasNoindexInSource(src)) {
      pass('G', `${utilityPage} page — has noindex`);
    } else {
      warn('G', `${utilityPage} page — no explicit noindex found (utility page may be indexed)`);
    }
  }

  // G8. seo-url.ts utility must be used by main page types (shared code guard)
  const seoUrlSource = readSourceFile('lib/utils/seo-url.ts');
  if (!seoUrlSource) {
    fail('G', 'lib/utils/seo-url.ts not found — SEO URL utility missing');
  } else {
    pass('G', 'lib/utils/seo-url.ts exists');
    // Verify getCanonicalUrl and getHreflangAlternates are exported
    if (/export.*getCanonicalUrl/.test(seoUrlSource) && /export.*getHreflangAlternates/.test(seoUrlSource)) {
      pass('G', 'seo-url.ts exports getCanonicalUrl and getHreflangAlternates');
    } else {
      fail('G', 'seo-url.ts missing expected exports');
    }
  }

  // G9. Key public pages must import from seo-url (guard against refactor regression)
  const seoUrlUsers = [
    { file: 'app/[lang]/contents/reviews/page.tsx', label: 'Reviews page' },
    { file: 'app/[lang]/contents/news/page.tsx', label: 'News page' },
    { file: 'app/[lang]/contents/wiki/page.tsx', label: 'Wiki hub page' },
    { file: 'app/[lang]/contents/page.tsx', label: 'Contents hub page' },
  ];
  for (const { file, label } of seoUrlUsers) {
    const src = readSourceFile(file);
    if (!src) {
      warn('G', `${label} source not found — skipping seo-url import check`);
    } else if (/from.*seo-url/.test(src)) {
      pass('G', `${label} — imports from seo-url`);
    } else {
      fail('G', `${label} — does NOT import from seo-url (canonical/hreflang may be missing)`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// H. Phase 7-2 Re-audit: DOM order, locale leakage, loading-shell, code guards
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Korean taxonomy/value strings that must NOT appear in the visible text of
 * EN-locale pages. These are short-form category keys used in the database
 * that would be returned as-is when no EN mapping existed (locale leakage).
 *
 * Note: Common product-name terms like '소주' are intentionally excluded
 * because they appear legitimately as Korean product names on EN pages.
 * This list covers categories that have unambiguous English equivalents and
 * should never appear as raw Korean strings in EN routes.
 */
const KO_TAXONOMY_LEAK_PATTERNS = [
  /\b버번\b/,
  /\b데킬라\b/,
  /\b메스칼\b/,
  /\b쇼추\b/,
  /\b레드와인\b/,
  /\b화이트와인\b/,
  /\b리큐어\b/,
  /\b백주\b/,
];

async function checkPhase72() {
  console.log('\n─── H. Phase 7-2 Re-audit ───');

  // ── H1. DOM order: <main> must appear before <footer> in the HTML ──────────
  const domOrderPages = [
    { path: '/en', label: 'English homepage' },
    { path: '/ko', label: 'Korean homepage' },
  ];

  for (const page of domOrderPages) {
    const url = `${BASE_URL}${page.path}`;
    const result = await fetchPage(url);
    if (!result.ok || result.status !== 200) {
      warn('H', `${page.label} DOM order — could not verify (status ${result.status})`);
      continue;
    }

    const html = result.html;
    const mainIdx = html.indexOf('<main');
    const footerIdx = html.indexOf('<footer');

    if (mainIdx === -1) {
      fail('H', `${page.label} — no <main> element found in HTML`);
    } else if (footerIdx === -1) {
      warn('H', `${page.label} — no <footer> element found (cannot verify DOM order)`);
    } else if (mainIdx < footerIdx) {
      pass('H', `${page.label} — <main> appears before <footer> in DOM`);
    } else {
      fail('H', `${page.label} — <footer> appears before <main> in DOM (SEO structure issue)`,
        `main at char ${mainIdx}, footer at char ${footerIdx}`);
    }
  }

  // ── H2. Loading-shell leakage on spirit detail (EN) ───────────────────────
  const indexableId = FIXTURES.indexableSpiritId;
  const spiritEnUrl = `${BASE_URL}/en/spirits/${indexableId}`;
  const spiritEnResult = await fetchPage(spiritEnUrl);

  if (!spiritEnResult.ok || spiritEnResult.status !== 200) {
    warn('H', `EN spirit (${indexableId}) — could not verify (status ${spiritEnResult.status})`);
  } else {
    let leaked = null;
    for (const pattern of LOADING_SHELL_PATTERNS) {
      if (pattern.test(spiritEnResult.html)) { leaked = pattern.toString(); break; }
    }
    if (leaked) {
      fail('H', `EN spirit — loading-shell text in SSR HTML`, `Pattern: ${leaked}`);
    } else {
      pass('H', `EN spirit — no loading-shell text in SSR HTML`);
    }

    // H3. EN spirit page — Korean taxonomy strings must not appear in visible body text
    const $ = parseHtml(spiritEnResult.html);
    // Remove script/style content from body text inspection
    $('script, style, [type="application/ld+json"]').remove();
    const bodyText = $('body').text();

    let koLeakPattern = null;
    for (const pattern of KO_TAXONOMY_LEAK_PATTERNS) {
      if (pattern.test(bodyText)) { koLeakPattern = pattern.toString(); break; }
    }
    if (koLeakPattern) {
      warn('H', `EN spirit — Korean taxonomy string found in body text`, `Pattern: ${koLeakPattern}`);
    } else {
      pass('H', `EN spirit — no Korean taxonomy leakage in body text`);
    }
  }

  // ── H4. EN spirit JSON-LD must not contain raw Korean category strings ──────
  if (spiritEnResult.ok && spiritEnResult.status === 200) {
    const $ = parseHtml(spiritEnResult.html);
    const jsonLdScripts = $('script[type="application/ld+json"]').map((_, el) => $(el).html()).get();
    let jsonLdKoLeak = false;
    for (const scriptContent of jsonLdScripts) {
      try {
        const parsed = JSON.parse(scriptContent || '{}');
        const jsonStr = JSON.stringify(parsed);
        for (const pattern of KO_TAXONOMY_LEAK_PATTERNS) {
          if (pattern.test(jsonStr)) { jsonLdKoLeak = true; break; }
        }
      } catch { /* ignore parse errors */ }
      if (jsonLdKoLeak) break;
    }
    if (jsonLdKoLeak) {
      warn('H', `EN spirit — Korean taxonomy string found in JSON-LD structured data`);
    } else {
      pass('H', `EN spirit — no Korean taxonomy leakage in JSON-LD`);
    }
  }

  // ── H5. Reviews archive must not expose loading shell text ────────────────
  const reviewsResult = await fetchPage(`${BASE_URL}/en/contents/reviews`);
  if (reviewsResult.ok && reviewsResult.status === 200) {
    let leaked = null;
    for (const pattern of LOADING_SHELL_PATTERNS) {
      if (pattern.test(reviewsResult.html)) { leaked = pattern.toString(); break; }
    }
    if (leaked) {
      fail('H', `Reviews archive — loading-shell text in SSR HTML`, `Pattern: ${leaked}`);
    } else {
      pass('H', `Reviews archive — no loading-shell text in SSR HTML`);
    }
  } else {
    warn('H', `Reviews archive — could not verify loading shell (status ${reviewsResult.status})`);
  }

  // ── H6. News archive must not expose loading shell text ───────────────────
  const newsResult = await fetchPage(`${BASE_URL}/en/contents/news`);
  if (newsResult.ok && newsResult.status === 200) {
    let leaked = null;
    for (const pattern of LOADING_SHELL_PATTERNS) {
      if (pattern.test(newsResult.html)) { leaked = pattern.toString(); break; }
    }
    if (leaked) {
      fail('H', `News archive — loading-shell text in SSR HTML`, `Pattern: ${leaked}`);
    } else {
      pass('H', `News archive — no loading-shell text in SSR HTML`);
    }
  } else {
    warn('H', `News archive — could not verify loading shell (status ${newsResult.status})`);
  }

  // ── H7. Code guard: reviews-client and news-client must not start with loading=true ─
  const reviewsClientSrc = readSourceFile('app/[lang]/contents/reviews/reviews-client.tsx');
  if (!reviewsClientSrc) {
    warn('H', 'reviews-client.tsx not found — skipping loading-shell guard');
  } else {
    // Must NOT have useState(!hasInitial) pattern (that would SSR the loading text)
    if (/useState\s*\(\s*!hasInitial\s*\)/.test(reviewsClientSrc)) {
      fail('H', 'reviews-client — loading state initialised to !hasInitial (SSR shell risk)',
        'Change to useState(false) so SSR never renders the loading placeholder text');
    } else {
      pass('H', 'reviews-client — loading state does not start from !hasInitial');
    }
  }

  const newsClientSrc = readSourceFile('app/[lang]/contents/news/news-client.tsx');
  if (!newsClientSrc) {
    warn('H', 'news-client.tsx not found — skipping loading-shell guard');
  } else {
    if (/useState\s*\(\s*!hasInitial\s*\)/.test(newsClientSrc)) {
      fail('H', 'news-client — loading state initialised to !hasInitial (SSR shell risk)',
        'Change to useState(false) so SSR never renders the loading placeholder text');
    } else {
      pass('H', 'news-client — loading state does not start from !hasInitial');
    }
  }

  // ── H8. Code guard: spirit detail page uses localizeCategory for JSON-LD ──
  const spiritPageSrc = readSourceFile('app/[lang]/spirits/[id]/page.tsx');
  if (!spiritPageSrc) {
    warn('H', 'Spirit detail page not found — skipping locale-leakage code guard');
  } else {
    // JSON-LD category must use localizeCategory, not raw spirit.category
    if (/category:\s*spirit\.category\b/.test(spiritPageSrc)) {
      fail('H', 'Spirit page — JSON-LD category uses raw spirit.category (Korean leak on EN routes)',
        'Use localizeCategory(spirit.category, lang) instead');
    } else if (/category:\s*localizeCategory/.test(spiritPageSrc)) {
      pass('H', 'Spirit page — JSON-LD category uses localizeCategory');
    } else {
      warn('H', 'Spirit page — could not confirm JSON-LD category localization');
    }

    // buildRichDescription must be locale-aware (use isEn branching)
    if (/buildRichDescription/.test(spiritPageSrc) && /isEn/.test(spiritPageSrc)) {
      pass('H', 'Spirit page — buildRichDescription is locale-aware');
    } else {
      warn('H', 'Spirit page — buildRichDescription may not be locale-aware');
    }

    // Breadcrumb position 3 name must not be raw spirit.category
    if (/position:\s*3[\s\S]{0,100}name:\s*spirit\.category/.test(spiritPageSrc)) {
      fail('H', 'Spirit page — breadcrumb position 3 uses raw spirit.category (Korean leak on EN routes)',
        'Use localizeCategory(spirit.category, lang) for the breadcrumb name');
    } else {
      pass('H', 'Spirit page — breadcrumb position 3 does not use raw spirit.category');
    }
  }

  // ── H9. display_names_en must include common short-form category keys ──────
  const metadataPath = path.join(REPO_ROOT, 'lib/constants/spirits-metadata.json');
  try {
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    const displayNamesEn = metadata.display_names_en || {};

    const requiredEnKeys = ['버번', '데킬라', '메스칼', '쇼추', '레드와인', '화이트와인', '리큐어', '백주'];
    const missingKeys = requiredEnKeys.filter(k => !displayNamesEn[k]);

    if (missingKeys.length > 0) {
      fail('H', 'spirits-metadata.json missing EN display names for short-form category keys',
        `Missing: ${missingKeys.join(', ')}`);
    } else {
      pass('H', 'spirits-metadata.json has EN display names for all short-form category keys');
    }
  } catch {
    warn('H', 'Could not read spirits-metadata.json for display_names_en check');
  }

  // ── H10. Terms and privacy pages must have noindex ────────────────────────
  for (const page of ['terms', 'privacy']) {
    const src = readSourceFile(`app/[lang]/contents/${page}/page.tsx`);
    if (!src) {
      warn('H', `${page} page not found — skipping noindex guard`);
    } else if (hasNoindexInSource(src)) {
      pass('H', `${page} page — has noindex (utility page correctly excluded)`);
    } else {
      warn('H', `${page} page — missing noindex (utility page may be unnecessarily indexed)`);
    }
  }

  // ── H11. Login page must have noindex ─────────────────────────────────────
  const loginSource = readSourceFile('app/[lang]/login/page.tsx');
  if (!loginSource) {
    warn('H', 'Login page source not found — skipping noindex guard');
  } else if (/index\s*:\s*false/i.test(loginSource)) {
    pass('H', 'Login page — has explicit robots noindex');
  } else {
    fail('H', 'Login page — missing explicit robots noindex (auth page should not be indexed)');
  }

  // ── H12. Me/reviews must have noindex via layout or page metadata ──────────
  const meReviewsLayout = readSourceFile('app/[lang]/me/reviews/layout.tsx');
  const meReviewsPage = readSourceFile('app/[lang]/me/reviews/page.tsx');
  const meReviewsNoindex =
    (meReviewsLayout && /index\s*:\s*false/i.test(meReviewsLayout)) ||
    (meReviewsPage && /index\s*:\s*false/i.test(meReviewsPage));
  if (meReviewsNoindex) {
    pass('H', 'Me/reviews — has explicit robots noindex');
  } else {
    fail('H', 'Me/reviews — missing robots noindex (private review page must be noindex)');
  }

  // ── H13. About page must have locale-aware generateMetadata ───────────────
  const aboutSource = readSourceFile('app/[lang]/contents/about/page.tsx');
  if (!aboutSource) {
    warn('H', 'About page source not found — skipping locale-metadata guard');
  } else {
    // Must use a function (not static export const metadata) to be locale-aware
    const hasGenerateMetadata = /generateMetadata/i.test(aboutSource);
    // Must branch on locale (isEn pattern or direct lang comparison)
    const hasLocaleBranch = /\bisEn\b/.test(aboutSource) || /lang\s*===\s*['"]en['"]/.test(aboutSource);
    if (hasGenerateMetadata && hasLocaleBranch) {
      pass('H', 'About page — uses locale-aware generateMetadata');
    } else {
      fail('H', 'About page — static metadata is not locale-aware (KO route gets English title)');
    }
  }

  // ── H14. Spirit page JSON-LD fallback must be locale-aware on EN routes ────
  const spiritPageSrcH14 = readSourceFile('app/[lang]/spirits/[id]/page.tsx');
  if (!spiritPageSrcH14) {
    warn('H', 'Spirit detail page source not found — skipping JSON-LD fallback check');
  } else {
    // The fallback editorialReviewBody must reference isEn (locale-conditional) and
    // localizeCategory must be called with 'en' argument for the EN branch
    const fallbackIsLocaleAware = /editorialReviewBody\s*=.*isEn/s.test(spiritPageSrcH14) ||
      /isEn.*editorialReviewBody/s.test(spiritPageSrcH14);
    const localizeCalledWithEn = /localizeCategory\([^)]*'en'\)/.test(spiritPageSrcH14);
    if (fallbackIsLocaleAware || localizeCalledWithEn) {
      pass('H', 'Spirit page — JSON-LD editorial review fallback is locale-aware');
    } else {
      warn('H', 'Spirit page — JSON-LD editorial review fallback may not be locale-aware');
    }
  }

  // ── H15. WorldCup layout must not have static Korean-only metadata ─────────
  const worldcupLayoutSrc = readSourceFile('app/[lang]/contents/worldcup/layout.tsx');
  if (!worldcupLayoutSrc) {
    warn('H', 'WorldCup layout source not found — skipping metadata conflict check');
  } else if (/export const metadata/i.test(worldcupLayoutSrc)) {
    fail('H', 'WorldCup layout — has static metadata that conflicts with locale-aware page metadata');
  } else {
    pass('H', 'WorldCup layout — no static metadata (page handles locale-aware title)');
  }

  // ── H16. WorldCup/game layout must use locale-aware generateMetadata ────────
  const worldcupGameLayoutSrc = readSourceFile('app/[lang]/contents/worldcup/game/layout.tsx');
  if (!worldcupGameLayoutSrc) {
    warn('H', 'WorldCup/game layout source not found — skipping metadata locale check');
  } else {
    const hasGenerateMetadata = /generateMetadata/i.test(worldcupGameLayoutSrc);
    const hasLocaleBranch = /\bisEn\b/.test(worldcupGameLayoutSrc) || /lang\s*===\s*['"]en['"]/.test(worldcupGameLayoutSrc);
    if (hasGenerateMetadata && hasLocaleBranch) {
      pass('H', 'WorldCup/game layout — uses locale-aware generateMetadata');
    } else {
      fail('H', 'WorldCup/game layout — has static Korean-only metadata (EN routes get Korean title)');
    }
  }

  // ── H17. Perfect-pour layout must not have static Korean-only metadata ──────
  const perfectPourLayoutSrc = readSourceFile('app/[lang]/contents/perfect-pour/layout.tsx');
  if (!perfectPourLayoutSrc) {
    warn('H', 'Perfect-pour layout source not found — skipping metadata conflict check');
  } else if (/export const metadata/i.test(perfectPourLayoutSrc)) {
    fail('H', 'Perfect-pour layout — has static metadata that conflicts with locale-aware page metadata');
  } else {
    pass('H', 'Perfect-pour layout — no static metadata (page handles locale-aware title)');
  }
}


function printSummary() {
  console.log('\n' + '═'.repeat(60));
  console.log('SEO Regression Check — Results');
  console.log('═'.repeat(60));

  const grouped = {};
  for (const r of RESULTS) {
    if (!grouped[r.section]) grouped[r.section] = [];
    grouped[r.section].push(r);
  }

  for (const [section, items] of Object.entries(grouped)) {
    const fails = items.filter(i => i.level === 'FAIL');
    const warns = items.filter(i => i.level === 'WARN');
    const passes = items.filter(i => i.level === 'PASS');
    console.log(`\nSection ${section}: ${passes.length} PASS  ${warns.length} WARN  ${fails.length} FAIL`);
    for (const item of items) {
      const icon = item.level === 'PASS' ? '✅' : item.level === 'WARN' ? '⚠️ ' : '❌';
      const detail = item.detail ? `  → ${item.detail}` : '';
      console.log(`  ${icon} [${item.level}] ${item.label}${detail}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  const total = RESULTS.length;
  const passCount = RESULTS.filter(r => r.level === 'PASS').length;
  console.log(`Total: ${total} checks  |  ${passCount} PASS  |  ${warnCount} WARN  |  ${blockerCount} FAIL (BLOCKER)`);

  if (blockerCount > 0) {
    console.log(`\n🚨 ${blockerCount} BLOCKER failure(s) detected. Fix before deploying.\n`);
  } else if (warnCount > 0) {
    console.log(`\n✅ No blockers. ${warnCount} warning(s) to review.\n`);
  } else {
    console.log('\n✅ All checks passed.\n');
  }
}

async function main() {
  console.log('K-Spirits Club — SEO Regression Check Suite');
  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(`Fixtures: indexableSpiritId=${FIXTURES.indexableSpiritId}, missingSpiritId=${FIXTURES.missingSpiritId}`);

  // Always probe the target server regardless of URL — handles unreachable staging too
  const isOnline = await (async () => {
    try {
      await fetch(`${BASE_URL}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      return true;
    } catch {
      return false;
    }
  })();

  if (!isOnline) {
    console.log(`\n⚠️  Server not reachable at ${BASE_URL}. Skipping HTTP checks, running code-only checks.\n`);
    await checkPrivateRouteSafety();
    await checkPhase72();
  } else {
    await checkPublicHtmlQuality();
    await checkMetadata();
    await checkSitemapRobots();
    await checkSpiritRoutes();
    await checkArchives();
    await checkCrawlableLinks();
    await checkPrivateRouteSafety();
    await checkPhase72();
  }

  printSummary();
  process.exit(blockerCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
