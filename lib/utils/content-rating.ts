import { Spirit } from '../db/schema';

export interface ContentRatingResult {
  ratingValue: number;
  reviewCount: number;
  missingElements?: string[];
  expertReview: {
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    datePublished: string;
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: 5;
      worstRating: 1;
    };
    reviewBody: string;
  };
}

/**
 * Calculates an initial content rating based on the quality and depth of curator data.
 */
export function calculateInitialContentRating(spirit: Spirit): ContentRatingResult {
  let score = 1.0; // Base score
  const missingElements: string[] = [];

  // 1. Description Analysis
  const descKo = (spirit.description_ko || spirit.metadata?.description_ko || '').trim();
  const descEn = (spirit.description_en || spirit.metadata?.description_en || '').trim();
  
  if (descKo.length >= 150) {
    score += 0.5;
  } else {
    missingElements.push(descKo.length === 0 ? 'No KO Description' : 'Short KO Description');
  }

  if (descEn.length >= 150) {
    score += 0.5;
  } else {
    missingElements.push(descEn.length === 0 ? 'No EN Description' : 'Short EN Description');
  }

  // Bilingual Enrichment Bonus
  if (descKo.length >= 100 && descEn.length >= 100) {
    score += 0.5;
  }

  // 2. Flavor Tags Analysis (Diversity)
  const sensoryTags = [
    ...(spirit.nose_tags || []),
    ...(spirit.palate_tags || []),
    ...(spirit.finish_tags || []),
  ].filter(Boolean);
  
  const tagCount = sensoryTags.length;
  if (tagCount >= 6) score += 1.5;
  else if (tagCount >= 4) score += 1.0;
  else if (tagCount >= 1) score += 0.5;
  else missingElements.push('No Sensory Tags');

  // 3. Pairing Guide Analysis
  const pairingKo = (spirit.pairing_guide_ko || spirit.metadata?.pairing_guide_ko || '').trim();
  const pairingEn = (spirit.pairing_guide_en || spirit.metadata?.pairing_guide_en || '').trim();
  
  if (pairingKo.length >= 20 || pairingEn.length >= 20) {
    score += 1.0;
  } else {
    missingElements.push('No Pairing Guide');
  }

  // 4. Image Presence
  if (spirit.imageUrl || spirit.thumbnailUrl) {
    score += 0.5;
  } else {
    missingElements.push('No Product Image');
  }

  // Cap at 5.0
  const finalRating = Math.min(5.0, Number(score.toFixed(1)));

  // Reviewer Persona: "K-Spirits Editor"
  const publishedDate = spirit.updatedAt 
    ? (new Date(spirit.updatedAt).toISOString()) 
    : (spirit.createdAt ? new Date(spirit.createdAt).toISOString() : new Date().toISOString());

  // Deterministic Pattern Selection based on spirit.id
  const idStr = spirit.id || 'unknown';
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash += idStr.charCodeAt(i);
  }
  const patternIdx = hash % 4;

  const name = spirit.name_en || spirit.name || 'this spirit';
  const category = spirit.subcategory || spirit.category || 'spirit';
  const origin = spirit.distillery || spirit.country || 'the selected origin';
  const flavorSummary = tagCount > 0 ? `notes of ${sensoryTags.slice(0, 3).join(', ')}` : 'a balanced character';
  const pairingSummary = (pairingKo || pairingEn) ? 'accompanied by curated food pairings' : 'best enjoyed classically';

  const templates = [
    `[Editor's Review] ${name} from ${origin} captures the essence of ${category} with a profile featuring ${flavorSummary}. ${pairingSummary}. K-Spirits Club provides certified technical data and expert tasting notes for enthusiasts.`,
    `[Editor's Review] Expertly curated by K-Spirits, this ${category} from ${origin} - ${name} - is distinguished by ${flavorSummary}. ${pairingSummary}.`,
    `[Editor's Review] A standout ${category} from ${origin}, ${name} offers complex ${flavorSummary}. ${pairingSummary}. Includes technical data and food matching guide.`,
    `[Editor's Review] Discover the depth of ${name}. This ${origin} ${category} shows a robust ${flavorSummary} character, ${pairingSummary} specifically matched for a premium experience.`
  ];

  let reviewBody = templates[patternIdx];
  
  // Add Internal Quality Tag for low scores
  if (finalRating < 3.5) {
    reviewBody += ' [Content Monitoring: Enrichment Required]';
  }

  return {
    ratingValue: finalRating,
    reviewCount: 1,
    missingElements: missingElements.length > 0 ? missingElements : undefined,
    expertReview: {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'K-Spirits Editor'
      },
      datePublished: publishedDate,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: finalRating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: reviewBody
    }
  };
}

