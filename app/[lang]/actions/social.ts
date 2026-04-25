'use server';

import { 
  dbUpsertReviewLike, 
  dbDeleteReviewLike, 
  dbUpdateReviewLikesCount,
  dbUpsertReviewComment,
  dbDeleteReviewComment 
} from '@/lib/db/data-connect-client';
import { revalidatePath } from 'next/cache';

/**
 * Toggles a 'Like' (Cheers!) on a spirit review.
 * Atomic increment/decrement is managed via currentCount provided from UI
 * to maintain UI responsiveness (Optimistic UI expected).
 */
export async function toggleReviewLike(
  userId: string, 
  reviewId: string, 
  currentLikes: number,
  isCurrentlyLiked: boolean
) {
  try {
    if (isCurrentlyLiked) {
      await dbDeleteReviewLike({ userId, reviewId });
      await dbUpdateReviewLikesCount({ id: reviewId, likes: Math.max(0, currentLikes - 1) });
    } else {
      await dbUpsertReviewLike({ userId, reviewId });
      await dbUpdateReviewLikesCount({ id: reviewId, likes: currentLikes + 1 });
    }
    
    revalidatePath('/[lang]/contents/reviews', 'page');
    revalidatePath(`/[lang]/contents/reviews/${reviewId}`, 'page');
    
    return { success: true, newCount: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1 };
  } catch (error) {
    console.error('Failed to toggle review like:', error);
    return { success: false, error: 'Social action failed' };
  }
}

/**
 * Adds a comment to a review.
 */
export async function addReviewComment(
  userId: string,
  reviewId: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    return { success: false, error: 'Comment content is required' };
  }

  try {
    const commentId = crypto.randomUUID();
    await dbUpsertReviewComment({
      id: commentId,
      reviewId,
      userId,
      content: content.trim(),
      updatedAt: new Date().toISOString()
    });

    revalidatePath(`/[lang]/contents/reviews/${reviewId}`, 'page');
    return { success: true, id: commentId };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error: 'Failed to post comment' };
  }
}

/**
 * Deletes a comment.
 */
export async function removeReviewComment(commentId: string, reviewId: string) {
  try {
    await dbDeleteReviewComment(commentId);
    revalidatePath(`/[lang]/contents/reviews/${reviewId}`, 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return { success: false };
  }
}
