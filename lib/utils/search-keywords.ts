/**
 * Search Keywords Utility
 * 
 * Generates n-gram based search keywords for efficient Firestore array-contains queries.
 * This allows partial matching on spirit names without full-text search.
 */

/**
 * Generates n-gram keywords from a text string.
 * Creates substrings of various lengths to enable partial matching.
 * 
 * @param text - The text to generate keywords from
 * @param minLength - Minimum keyword length (default: 2)
 * @param maxLength - Maximum keyword length (default: 10)
 * @returns Array of unique lowercase keywords
 * 
 * @example
 * generateNGrams("Glenfiddich 12") 
 * // Returns: ["gl", "gle", "glen", "glenfiddich", "12", "fi", "fid", etc.]
 */
export function generateNGrams(text: string, minLength: number = 2, maxLength: number = 10): string[] {
  if (!text || typeof text !== 'string') return [];

  const normalized = text.toLowerCase().trim();
  const keywords = new Set<string>();

  // Split by spaces and process each word
  const words = normalized.split(/\s+/);

  for (const word of words) {
    if (word.length === 0) continue;

    // Add the full word if it's within max length
    if (word.length <= maxLength) {
      keywords.add(word);
    }

    // Generate n-grams for longer words
    if (word.length >= minLength) {
      for (let i = 0; i <= word.length - minLength; i++) {
        for (let len = minLength; len <= Math.min(maxLength, word.length - i); len++) {
          const ngram = word.substring(i, i + len);
          keywords.add(ngram);
        }
      }
    }
  }

  return Array.from(keywords);
}

/**
 * Generates search keywords for a spirit.
 * Includes keywords from name, English name, and distillery.
 * 
 * @param spirit - Partial spirit object with name and metadata
 * @returns Array of unique search keywords
 * 
 * @example
 * generateSpiritSearchKeywords({ 
 *   name: "발베니 12년", 
 *   distillery: "Balvenie",
 *   metadata: { name_en: "Balvenie 12 Year" }
 * })
 */
export function generateSpiritSearchKeywords(spirit: {
  name: string;
  name_en?: string | null;
  distillery?: string | null;
  metadata?: {
    name_en?: string;
    [key: string]: any;
  };
}): string[] {
  const allKeywords = new Set<string>();

  // Add keywords from Korean name
  if (spirit.name) {
    const nameKeywords = generateNGrams(spirit.name);
    nameKeywords.forEach(k => allKeywords.add(k));
  }

  // Add keywords from English name (prioritize top-level, fallback to metadata)
  const enName = spirit.name_en || spirit.metadata?.name_en;
  if (enName) {
    const enNameKeywords = generateNGrams(enName);
    enNameKeywords.forEach(k => allKeywords.add(k));
  }

  // Add keywords from distillery
  if (spirit.distillery) {
    const distilleryKeywords = generateNGrams(spirit.distillery);
    distilleryKeywords.forEach(k => allKeywords.add(k));
  }

  return Array.from(allKeywords).sort();
}

/**
 * Extracts the best search keyword from a search term for Firestore array-contains query.
 * Firestore array-contains only supports exact matches, so we need to use the longest
 * meaningful keyword that's likely to be in the searchKeywords array.
 * 
 * @param searchTerm - The user's search input
 * @returns The best keyword to use for array-contains query, or empty string if too short
 * 
 * @example
 * extractSearchKeyword("Glen") // Returns: "glen"
 * extractSearchKeyword("Glenfiddich 12") // Returns: "glenfiddich"
 */
export function extractSearchKeyword(searchTerm: string): string {
  if (!searchTerm || typeof searchTerm !== 'string') return '';

  const normalized = searchTerm.toLowerCase().trim();

  // Split by spaces and get the longest word (min 2 chars)
  const words = normalized.split(/\s+/).filter(w => w.length >= 2);

  if (words.length === 0) return '';

  // Return the longest word as it's most specific
  return words.reduce((longest, current) =>
    current.length > longest.length ? current : longest
    , '');
}
