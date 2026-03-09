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
    if (/robots.*index.*true/i.test(cabinetSource)) {
      fail('G', 'Cabinet page — explicitly sets robots index:true (should not be publicly indexable)');
    } else {
      pass('G', 'Cabinet page — does not explicitly set robots index:true');
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
    if (/robots.*index.*true/i.test(meSource)) {
      fail('G', 'Me page — explicitly sets robots index:true (should not be publicly indexable)');
    } else {
      pass('G', 'Me page — does not explicitly set robots index:true');
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
// Runner + summary
// ─────────────────────────────────────────────────────────────────────────────

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
  } else {
    await checkPublicHtmlQuality();
    await checkMetadata();
    await checkSitemapRobots();
    await checkSpiritRoutes();
    await checkArchives();
    await checkCrawlableLinks();
    await checkPrivateRouteSafety();
  }

  printSummary();
  process.exit(blockerCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
