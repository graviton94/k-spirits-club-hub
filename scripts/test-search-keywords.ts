/**
 * Simple manual test for search keywords functionality
 * Run with: npx tsx scripts/test-search-keywords.ts
 */

import { generateNGrams, generateSpiritSearchKeywords, extractSearchKeyword } from '../lib/utils/search-keywords';

console.log('=== Testing Search Keywords Utilities ===\n');

// Test 1: generateNGrams
console.log('Test 1: generateNGrams');
const keywords1 = generateNGrams('Glenfiddich', 2, 10);
console.log('Input: "Glenfiddich"');
console.log('Output (first 15):', keywords1.slice(0, 15));
console.log('Total keywords:', keywords1.length);

const keywords2 = generateNGrams('발베니 12년', 2, 10);
console.log('\nInput: "발베니 12년"');
console.log('Output:', keywords2);
console.log('Total keywords:', keywords2.length);

// Test 2: generateSpiritSearchKeywords
console.log('\n\nTest 2: generateSpiritSearchKeywords');
const spirit1 = {
  name: '발베니 12년',
  distillery: 'Balvenie',
  metadata: { name_en: 'Balvenie 12 Year' }
};
const spiritKeywords1 = generateSpiritSearchKeywords(spirit1);
console.log('Spirit:', JSON.stringify(spirit1, null, 2));
console.log('Keywords (first 20):', spiritKeywords1.slice(0, 20));
console.log('Total keywords:', spiritKeywords1.length);

const spirit2 = {
  name: 'Glenfiddich 12 Year Old',
  distillery: 'Glenfiddich',
  metadata: {}
};
const spiritKeywords2 = generateSpiritSearchKeywords(spirit2);
console.log('\nSpirit:', JSON.stringify(spirit2, null, 2));
console.log('Keywords (first 20):', spiritKeywords2.slice(0, 20));
console.log('Total keywords:', spiritKeywords2.length);

// Test 3: extractSearchKeyword
console.log('\n\nTest 3: extractSearchKeyword');
const searchTerms = [
  'Glenfiddich 12',
  'Glen',
  'Balvenie',
  '발베니',
  'ab',
  'a',
  '   Jameson   ',
  ''
];

searchTerms.forEach(term => {
  const result = extractSearchKeyword(term);
  console.log(`"${term}" => "${result}"`);
});

// Test 4: Search matching simulation
console.log('\n\nTest 4: Search Matching Simulation');
const testSpirit = {
  name: 'Glenfiddich 12 Year Old',
  searchKeywords: generateSpiritSearchKeywords({
    name: 'Glenfiddich 12 Year Old',
    distillery: 'Glenfiddich',
    metadata: { name_en: 'Glenfiddich 12 Year Old' }
  })
};

const searchQueries = ['glen', 'fiddich', 'glen 12', 'year', 'glenfid'];
console.log('Spirit:', testSpirit.name);
console.log('Keywords count:', testSpirit.searchKeywords.length);

searchQueries.forEach(query => {
  const lowerQuery = query.toLowerCase();
  const matches = testSpirit.searchKeywords.some(keyword => keyword.includes(lowerQuery));
  console.log(`Search "${query}": ${matches ? '✓ MATCH' : '✗ NO MATCH'}`);
});

console.log('\n=== Tests Complete ===');
