#!/usr/bin/env node

/**
 * SEO Phase 1 Verification Script
 *
 * This script performs automated checks for:
 * - Locale prefix redirects
 * - Canonical URLs in HTML
 * - Hreflang alternates
 * - Static asset handling
 *
 * Usage: node scripts/seo/phase1-check.mjs [base-url]
 * Example: node scripts/seo/phase1-check.mjs http://localhost:3000
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const EXPECTED_DOMAIN = 'https://kspiritsclub.com';

// Test cases for redirects
const REDIRECT_TESTS = [
  { path: '/', expectedStatus: 308, shouldHaveLocale: true, description: 'Root path' },
  { path: '/explore', expectedStatus: 308, shouldHaveLocale: true, description: 'Explore page' },
  { path: '/cabinet', expectedStatus: 308, shouldHaveLocale: true, description: 'Cabinet page' },
  // These should NOT redirect
  { path: '/ko', expectedStatus: 200, shouldHaveLocale: false, description: 'Korean root' },
  { path: '/en', expectedStatus: 200, shouldHaveLocale: false, description: 'English root' },
  { path: '/ko/explore', expectedStatus: 200, shouldHaveLocale: false, description: 'Korean explore' },
  { path: '/en/explore', expectedStatus: 200, shouldHaveLocale: false, description: 'English explore' },
];

// Test cases for canonical/hreflang
const CANONICAL_TESTS = [
  { path: '/ko', expectedCanonical: `${EXPECTED_DOMAIN}/ko`, description: 'Korean home' },
  { path: '/en', expectedCanonical: `${EXPECTED_DOMAIN}/en`, description: 'English home' },
  { path: '/ko/explore', expectedCanonical: `${EXPECTED_DOMAIN}/ko/explore`, description: 'Korean explore' },
  { path: '/en/explore', expectedCanonical: `${EXPECTED_DOMAIN}/en/explore`, description: 'English explore' },
  { path: '/ko/cabinet', expectedCanonical: `${EXPECTED_DOMAIN}/ko/cabinet`, description: 'Korean cabinet' },
  { path: '/en/cabinet', expectedCanonical: `${EXPECTED_DOMAIN}/en/cabinet`, description: 'English cabinet' },
];

// Test cases for static assets (should not redirect)
const STATIC_TESTS = [
  { path: '/favicon.ico', description: 'Favicon' },
  { path: '/robots.txt', description: 'Robots.txt' },
  { path: '/sitemap.xml', description: 'Sitemap' },
  { path: '/manifest.json', description: 'PWA Manifest' },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader(title) {
  console.log('');
  log('═'.repeat(60), 'cyan');
  log(` ${title}`, 'cyan');
  log('═'.repeat(60), 'cyan');
}

function printResult(passed, message) {
  const symbol = passed ? '✓' : '✗';
  const color = passed ? 'green' : 'red';
  log(`  ${symbol} ${message}`, color);
}

async function testRedirect(test) {
  try {
    const url = `${BASE_URL}${test.path}`;
    const response = await fetch(url, { redirect: 'manual' });
    const status = response.status;
    const location = response.headers.get('location');

    const statusMatches = status === test.expectedStatus;
    let localeCheck = true;

    if (test.shouldHaveLocale && location) {
      localeCheck = /\/(ko|en)/.test(location);
    }

    const passed = statusMatches && localeCheck;
    const details = test.shouldHaveLocale
      ? `${status} → ${location || 'no redirect'}`
      : `${status}`;

    printResult(passed, `${test.description}: ${details}`);

    return passed;
  } catch (error) {
    printResult(false, `${test.description}: Error - ${error.message}`);
    return false;
  }
}

async function testCanonical(test) {
  try {
    const url = `${BASE_URL}${test.path}`;
    const response = await fetch(url);
    const html = await response.text();

    // Extract canonical URL from HTML
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

    // Check if canonical URL matches expected
    const passed = canonicalUrl === test.expectedCanonical;
    const details = `Expected: ${test.expectedCanonical}, Got: ${canonicalUrl || 'none'}`;

    printResult(passed, `${test.description}: ${passed ? 'OK' : details}`);

    return passed;
  } catch (error) {
    printResult(false, `${test.description}: Error - ${error.message}`);
    return false;
  }
}

async function testHreflang(path, description) {
  try {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url);
    const html = await response.text();

    // Extract all hreflang links
    const hreflangMatches = [...html.matchAll(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi)];

    const hreflangs = {};
    for (const match of hreflangMatches) {
      hreflangs[match[1]] = match[2];
    }

    // Check if we have both ko and en
    const hasKo = 'ko' in hreflangs;
    const hasEn = 'en' in hreflangs;
    const passed = hasKo && hasEn;

    const details = passed
      ? `ko: ${hreflangs.ko}, en: ${hreflangs.en}`
      : `Missing: ${!hasKo ? 'ko' : ''} ${!hasEn ? 'en' : ''}`;

    printResult(passed, `${description}: ${passed ? 'OK' : details}`);

    return passed;
  } catch (error) {
    printResult(false, `${description}: Error - ${error.message}`);
    return false;
  }
}

async function testStatic(test) {
  try {
    const url = `${BASE_URL}${test.path}`;
    const response = await fetch(url, { redirect: 'manual' });
    const status = response.status;

    // For static files, we accept 200 (file exists) or 404 (file doesn't exist)
    // But NOT 3xx (redirect)
    const passed = status === 200 || status === 404;
    const details = `${status} ${passed ? '(no redirect)' : '(REDIRECTED!)'}`;

    printResult(passed, `${test.description}: ${details}`);

    return passed;
  } catch (error) {
    printResult(false, `${test.description}: Error - ${error.message}`);
    return false;
  }
}

async function runTests() {
  log(`\nTesting SEO Phase 1 Implementation at: ${BASE_URL}\n`, 'cyan');

  const results = {
    redirects: { passed: 0, total: 0 },
    canonicals: { passed: 0, total: 0 },
    hreflangs: { passed: 0, total: 0 },
    statics: { passed: 0, total: 0 },
  };

  // Test redirects
  printHeader('1. Redirect Tests');
  for (const test of REDIRECT_TESTS) {
    const passed = await testRedirect(test);
    results.redirects.total++;
    if (passed) results.redirects.passed++;
  }

  // Test canonicals
  printHeader('2. Canonical URL Tests');
  for (const test of CANONICAL_TESTS) {
    const passed = await testCanonical(test);
    results.canonicals.total++;
    if (passed) results.canonicals.passed++;
  }

  // Test hreflangs
  printHeader('3. Hreflang Alternate Tests');
  const hreflangTests = [
    { path: '/ko', description: 'Korean home' },
    { path: '/en', description: 'English home' },
    { path: '/ko/explore', description: 'Korean explore' },
    { path: '/en/explore', description: 'English explore' },
  ];
  for (const test of hreflangTests) {
    const passed = await testHreflang(test.path, test.description);
    results.hreflangs.total++;
    if (passed) results.hreflangs.passed++;
  }

  // Test static assets
  printHeader('4. Static Asset Tests (No Redirect)');
  for (const test of STATIC_TESTS) {
    const passed = await testStatic(test);
    results.statics.total++;
    if (passed) results.statics.passed++;
  }

  // Summary
  printHeader('Summary');
  const totalPassed =
    results.redirects.passed +
    results.canonicals.passed +
    results.hreflangs.passed +
    results.statics.passed;
  const totalTests =
    results.redirects.total +
    results.canonicals.total +
    results.hreflangs.total +
    results.statics.total;

  log(`  Redirects:  ${results.redirects.passed}/${results.redirects.total}`,
    results.redirects.passed === results.redirects.total ? 'green' : 'yellow');
  log(`  Canonicals: ${results.canonicals.passed}/${results.canonicals.total}`,
    results.canonicals.passed === results.canonicals.total ? 'green' : 'yellow');
  log(`  Hreflangs:  ${results.hreflangs.passed}/${results.hreflangs.total}`,
    results.hreflangs.passed === results.hreflangs.total ? 'green' : 'yellow');
  log(`  Statics:    ${results.statics.passed}/${results.statics.total}`,
    results.statics.passed === results.statics.total ? 'green' : 'yellow');

  console.log('');
  log(`  TOTAL: ${totalPassed}/${totalTests} tests passed`,
    totalPassed === totalTests ? 'green' : 'red');

  if (totalPassed === totalTests) {
    log('\n✓ All tests passed! SEO Phase 1 implementation is correct.', 'green');
    process.exit(0);
  } else {
    log(`\n✗ ${totalTests - totalPassed} test(s) failed. Please review the output above.`, 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
