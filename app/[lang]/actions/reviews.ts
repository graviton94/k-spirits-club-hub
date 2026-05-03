// app/[lang]/actions/reviews.ts

"use server";

import { dbAdminGetSpirit, dbAdminUpsertReview, dbAdminUpsertSpirit, dbAdminIncrementUserReviews } from '@/lib/db/data-connect-admin';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

/**
 * Submits a micro-review and updates the target spirit's aggregate rating metadata.
 * Simplified for high conversion: only requires stars and flavor tags.
 */
export async function submitMicroReviewAction(
  spiritId: string, 
  rating: number, 
  tags: string[], 
  lang: string = 'ko',
  userId: string = 'ANONYMOUS_EXPERT'
) {
  try {
    // 1. Fetch current spirit data to calculate new average
    const spirit = await dbAdminGetSpirit(spiritId);
    if (!spirit) {
      throw new Error(`Spirit not found: ${spiritId}`);
    }

    const metadata: any = spirit.metadata || {};
    const oldRating = metadata.aggregateRating?.ratingValue || 0;
    const oldCount = metadata.aggregateRating?.reviewCount || 0;

    // 2. Calculate new moving average
    const newCount = oldCount + 1;
    const newRatingValue = ((oldRating * oldCount) + rating) / newCount;

    // 3. Prepare the public review document
    const defaultComment = lang === 'en' ? "Highly recommended!" : "정말 추천합니다!";
    
    const reviewId = uuidv4();
    
    await dbAdminUpsertReview({
      id: reviewId,
      spiritId,
      userId, // Use passed userId
      rating,
      content: defaultComment,
      nose: tags.filter((_, i) => i % 3 === 0).join(', '),
      palate: tags.filter((_, i) => i % 3 === 1).join(', '),
      finish: tags.filter((_, i) => i % 3 === 2).join(', '),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true
    });

    // 4. Increment user stats
    try {
      await dbAdminIncrementUserReviews(userId);
    } catch (e) {
      console.error('Failed to increment user stats in action:', e);
    }

    // 5. Update parent spirit metadata
    const updatedMetadata = {
      ...metadata,
      aggregateRating: {
        ratingValue: parseFloat(newRatingValue.toFixed(1)),
        reviewCount: newCount,
        bestRating: 5,
        worstRating: 1
      }
    };

    await dbAdminUpsertSpirit({
      id: spiritId,
      name: spirit.name,
      category: spirit.category,
      imageUrl: spirit.imageUrl || spirit.thumbnailUrl || '/mys-4.webp',
      thumbnailUrl: spirit.thumbnailUrl || spirit.imageUrl || '/mys-4.webp',
      metadata: updatedMetadata
    });

    // 5. Revalidate
    revalidatePath(`/${lang}/spirits/${spiritId}`);

    return { success: true };
  } catch (error) {
    console.error('[Action] submitMicroReviewAction Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
