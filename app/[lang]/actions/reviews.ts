"use server";

import { spiritsDb, reviewsDb } from '@/lib/db/firestore-rest';
import { Review } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

/**
 * Submits a micro-review and updates the target spirit's aggregate rating metadata.
 * Simplified for high conversion: only requires stars and flavor tags.
 */
export async function submitMicroReviewAction(
  spiritId: string, 
  rating: number, 
  tags: string[], 
  lang: string = 'ko'
) {
  try {
    // 1. Fetch current spirit data to calculate new average
    // In a REST-based environment, we fetch-calculate-update
    const spirit = await spiritsDb.getById(spiritId);
    if (!spirit) {
      throw new Error(`Spirit not found: ${spiritId}`);
    }

    const oldRating = spirit.metadata?.aggregateRating?.ratingValue || 0;
    const oldCount = spirit.metadata?.aggregateRating?.reviewCount || 0;

    // 2. Calculate new moving average
    const newCount = oldCount + 1;
    const newRatingValue = ((oldRating * oldCount) + rating) / newCount;

    // 3. Prepare the public review document
    // Using a default comment for SEO compliance as requested
    const defaultComment = lang === 'en' ? "Highly recommended!" : "정말 추천합니다!";
    
    // Construct simplified review payload
    const reviewData: Partial<Review> = {
      spiritId,
      rating,
      content: defaultComment,
      nose: tags.filter((_, i) => i % 3 === 0).join(', '), // Simple heuristic for distributive tags
      palate: tags.filter((_, i) => i % 3 === 1).join(', '),
      finish: tags.filter((_, i) => i % 3 === 2).join(', '),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
      userName: lang === 'en' ? "Resident Expert" : "시음 전문가" // Default for quick reviews
    };

    // 4. Atomic-ish update of parent spirit
    const updatedMetadata = {
      ...spirit.metadata,
      aggregateRating: {
        ratingValue: parseFloat(newRatingValue.toFixed(1)),
        reviewCount: newCount,
        bestRating: 5,
        worstRating: 1
      }
    };

    // Commit both: the new review and the updated spirit metadata
    // Note: We use the existing REST helpers which perform sequential updates.
    // In this specific architecture, this and trending logs are how engagement is tracked.
    await reviewsDb.upsert(spiritId, `micro_${Date.now()}`, reviewData);
    await spiritsDb.upsert(spiritId, { metadata: updatedMetadata });

    // 5. Revalidate the product page to show the gold stars immediately
    revalidatePath(`/${lang}/spirits/${spiritId}`);

    return { success: true };
  } catch (error) {
    console.error('[Action] submitMicroReviewAction Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
