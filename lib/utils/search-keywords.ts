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

export function generateSpiritSearchKeywords(spirit: {
  name: string;
  name_en?: string | null;
  distillery?: string | null;
  category?: string | null;
  subcategory?: string | null;
  region?: string | null;
  country?: string | null;
  nose_tags?: string[];
  palate_tags?: string[];
  finish_tags?: string[];
  tasting_note?: string;
  metadata?: {
    name_en?: string;
    nose_tags?: string[];
    palate_tags?: string[];
    finish_tags?: string[];
    [key: string]: any;
  };
}): string[] {
  const allKeywords = new Set<string>();

  // 1. Essential Fields (Full N-Grams for partial matching)
  // Korean name
  if (spirit.name) {
    generateNGrams(spirit.name).forEach(k => allKeywords.add(k));
  }

  // English name
  const enName = spirit.name_en || spirit.metadata?.name_en;
  if (enName) {
    generateNGrams(enName).forEach(k => allKeywords.add(k));
  }

  // Distillery
  if (spirit.distillery) {
    generateNGrams(spirit.distillery).forEach(k => allKeywords.add(k));
  }

  // 2. Classification & Location (Full words only)
  const categoryFields = [
    spirit.category,
    spirit.subcategory,
    spirit.region,
    spirit.country
  ];

  categoryFields.forEach(field => {
    if (field) {
      field.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length >= 2) allKeywords.add(word);
      });
    }
  });

  // 3. Flavor DNA (Tags & Tasting Notes) - Critical for SEO
  const tags = [
    ...(spirit.nose_tags || spirit.metadata?.nose_tags || []),
    ...(spirit.palate_tags || spirit.metadata?.palate_tags || []),
    ...(spirit.finish_tags || spirit.metadata?.finish_tags || [])
  ];

  // Include tasting note keywords if available (Root/Metadata)
  const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;
  if (tastingNote) {
    // Extract hashtags or common flavor words
    tastingNote.split(/[,\s#]+/).forEach((word: string) => {
      const clean = word.toLowerCase().trim();
      if (clean.length >= 2) allKeywords.add(clean);
    });
  }

  tags.forEach(tag => {
    if (tag) {
      const normalizedTag = tag.toLowerCase().trim();
      if (normalizedTag.length >= 2) {
        allKeywords.add(normalizedTag);
        // Also add first 2+ chars for partial match on long tags
        if (normalizedTag.length > 3) {
          allKeywords.add(normalizedTag.substring(0, 2));
          allKeywords.add(normalizedTag.substring(0, 3));
        }
      }
    }
  });

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
