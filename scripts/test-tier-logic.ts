/**
 * Unit test for indexable tier classification logic
 * Run with: npx tsx scripts/test-tier-logic.ts
 */

import { isIndexableSpirit, getSpiritRobotsMeta } from '../lib/utils/indexable-tier';
import { Spirit } from '../lib/db/schema';

console.log('======================================');
console.log('Indexable Tier Logic Tests');
console.log('======================================\n');

let passCount = 0;
let failCount = 0;

function test(name: string, actual: boolean, expected: boolean) {
  const passed = actual === expected;
  if (passed) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name} (expected ${expected}, got ${actual})`);
    failCount++;
  }
}

// Helper to create test spirit
function createSpirit(overrides: Partial<Spirit>): Spirit {
  return {
    id: 'test-id',
    name: 'Test Spirit',
    name_en: null,
    distillery: 'Test Distillery',
    bottler: null,
    abv: 40,
    volume: 700,
    category: 'whisky',
    mainCategory: 'whisky',
    subcategory: 'single malt',
    country: 'Scotland',
    region: 'Speyside',
    imageUrl: 'https://example.com/image.jpg',
    thumbnailUrl: null,
    source: 'manual',
    externalId: null,
    status: 'PUBLISHED',
    isPublished: true,
    isReviewed: false,
    reviewedBy: null,
    reviewedAt: null,
    metadata: {
      description_ko: 'A'.repeat(300), // 300 chars
      description_en: 'B'.repeat(300),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Spirit;
}

console.log('Test Group 1: Tier A (Indexable) Spirits\n');

// Test 1: Complete spirit with all fields
const tierA1 = createSpirit({});
test('Complete spirit with 300+ char description (KO)', isIndexableSpirit(tierA1), true);

// Test 2: English description only
const tierA2 = createSpirit({
  metadata: {
    description_ko: undefined,
    description_en: 'C'.repeat(350),
  },
});
test('Spirit with 300+ char description (EN only)', isIndexableSpirit(tierA2), true);

// Test 3: Using thumbnailUrl instead of imageUrl
const tierA3 = createSpirit({
  imageUrl: null,
  thumbnailUrl: 'https://example.com/thumb.jpg',
});
test('Spirit with thumbnailUrl (no imageUrl)', isIndexableSpirit(tierA3), true);

console.log('\nTest Group 2: Tier B (Non-indexable) Spirits\n');

// Test 4: Missing name
const tierB1 = createSpirit({ name: '' });
test('Missing name', isIndexableSpirit(tierB1), false);

// Test 5: Missing ABV
const tierB2 = createSpirit({ abv: null as any });
test('Missing ABV', isIndexableSpirit(tierB2), false);

// Test 6: Missing category
const tierB3 = createSpirit({ category: '' });
test('Missing category', isIndexableSpirit(tierB3), false);

// Test 7: Missing images
const tierB4 = createSpirit({
  imageUrl: null,
  thumbnailUrl: null,
});
test('Missing images (both imageUrl and thumbnailUrl)', isIndexableSpirit(tierB4), false);

// Test 8: Short description (under 300 chars)
const tierB5 = createSpirit({
  metadata: {
    description_ko: 'Short description',
    description_en: 'Also short',
  },
});
test('Short description (< 300 chars)', isIndexableSpirit(tierB5), false);

// Test 9: Exactly 299 chars (should be Tier B)
const tierB6 = createSpirit({
  metadata: {
    description_ko: 'A'.repeat(299),
    description_en: undefined,
  },
});
test('Description with exactly 299 chars', isIndexableSpirit(tierB6), false);

// Test 10: Exactly 300 chars (should be Tier A)
const tierA4 = createSpirit({
  metadata: {
    description_ko: 'A'.repeat(300),
    description_en: undefined,
  },
});
test('Description with exactly 300 chars', isIndexableSpirit(tierA4), true);

console.log('\nTest Group 3: Robots Meta Generation\n');

// Test 11: Tier A should return null (default indexing)
const robotsA = getSpiritRobotsMeta(tierA1);
test('Tier A returns null (no robots meta)', robotsA === null, true);

// Test 12: Tier B should return noindex/follow
const robotsB = getSpiritRobotsMeta(tierB5);
test('Tier B returns robots meta object', robotsB !== null, true);
if (robotsB) {
  test('Tier B robots.index = false', robotsB.index === false, true);
  test('Tier B robots.follow = true', robotsB.follow === true, true);
}

// Test 13: Null spirit should return null
const robotsNull = getSpiritRobotsMeta(null);
test('Null spirit returns noindex (safe default)', robotsNull !== null, true);

console.log('\nTest Group 4: Edge Cases\n');

// Test 14: Using description_ko from root (legacy field)
const tierA5 = createSpirit({
  description_ko: 'D'.repeat(400),
  metadata: {
    description_ko: undefined,
    description_en: undefined,
  },
});
test('Root description_ko field (legacy)', isIndexableSpirit(tierA5), true);

// Test 15: Using description_en from root (legacy field)
const tierA6 = createSpirit({
  description_en: 'E'.repeat(350),
  metadata: {
    description_ko: undefined,
    description_en: undefined,
  },
});
test('Root description_en field (legacy)', isIndexableSpirit(tierA6), true);

// Test 16: ABV = 0 (edge case, should still be valid)
const tierA7 = createSpirit({ abv: 0 });
test('ABV = 0 (valid number)', isIndexableSpirit(tierA7), true);

console.log('\n======================================');
console.log(`Results: ${passCount} passed, ${failCount} failed`);
console.log('======================================');

if (failCount > 0) {
  process.exit(1);
}
