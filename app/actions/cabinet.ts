"use server";

import { cabinetDb, spiritsDb, reviewsDb } from '@/lib/db/firestore-rest';

/**
 * Update a cabinet entry with personalRating and personalNotes
 */
export async function updateCabinetEntry(
  userId: string,
  spiritId: string, 
  data: { personalRating?: number; personalNotes?: string }
) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Fetch existing cabinet item
    const existingItem = await cabinetDb.getById(userId, spiritId);

    if (!existingItem) {
      throw new Error('Spirit not found in cabinet');
    }

    // Update the entry
    const updatedData = {
      ...existingItem,
      ...data,
      updatedAt: new Date().toISOString()
    };

    await cabinetDb.upsert(userId, spiritId, updatedData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating cabinet entry:', error);
    throw error;
  }
}

/**
 * Get all spirits in the user's cabinet
 * Joins cabinet items with spirit master data and searchIndex
 */
export async function getUserCabinet(userId: string) {
  if (!userId) {
    return [];
  }

  try {
    // Get user's cabinet items
    const cabinetItems = await cabinetDb.getAll(userId);

    if (cabinetItems.length === 0) {
      return [];
    }

    // Get spirit IDs from cabinet
    const spiritIds = Array.from(
      new Set(cabinetItems.map((item: any) => item.id))
    ).filter(Boolean) as string[];

    if (spiritIds.length === 0) {
      return [];
    }

    // Fetch master spirit data
    const masterSpirits = await spiritsDb.getByIds(spiritIds);

    // Merge cabinet data with master spirit data
    const joinedData = cabinetItems.map((cabinetItem: any) => {
      const masterSpirit = masterSpirits.find(s => s.id === cabinetItem.id);
      
      if (!masterSpirit) {
        return null;
      }

      // Merge: master spirit data + user-specific cabinet data
      return {
        ...masterSpirit,
        ...cabinetItem,
      };
    }).filter(Boolean);

    return joinedData;
  } catch (error) {
    console.error('Error fetching user cabinet:', error);
    return [];
  }
}

/**
 * Add a spirit to the cabinet
 * Implements dual-write: saves to both private cabinet and public reviews when a review is present
 */
export async function addToCabinet(
  userId: string,
  spiritId: string,
  data?: { isWishlist?: boolean; userReview?: any; userName?: string }
) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const cabinetData = {
      id: spiritId,
      isWishlist: data?.isWishlist ?? false,
      userReview: data?.userReview ?? null,
      addedAt: new Date().toISOString()
    };

    // 1. Save to private cabinet
    await cabinetDb.upsert(userId, spiritId, cabinetData);
    
    // 2. If there's a review (not wishlist), also save to public reviews
    if (!cabinetData.isWishlist && data?.userReview) {
      const publicReviewData = {
        spiritId,
        userId,
        userName: data?.userName || 'Anonymous',
        rating: data.userReview.ratingOverall || 0,
        ratingN: data.userReview.ratingN || 0,
        ratingP: data.userReview.ratingP || 0,
        ratingF: data.userReview.ratingF || 0,
        notes: data.userReview.comment || '',
        createdAt: data.userReview.createdAt || new Date().toISOString()
      };
      
      await reviewsDb.upsert(spiritId, userId, publicReviewData);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding to cabinet:', error);
    throw error;
  }
}

/**
 * Remove a spirit from the cabinet
 * Implements dual-delete: removes from both private cabinet and public reviews
 */
export async function removeFromCabinet(userId: string, spiritId: string) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Delete from both locations
    await Promise.all([
      cabinetDb.delete(userId, spiritId),
      reviewsDb.delete(spiritId, userId)
    ]);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from cabinet:', error);
    throw error;
  }
}

/**
 * Check if a spirit is in the user's cabinet
 */
export async function checkCabinetStatus(userId: string, spiritId: string) {
  if (!userId) {
    return { isOwned: false, isWishlist: false, data: null };
  }

  try {
    const item = await cabinetDb.getById(userId, spiritId);
    
    if (!item) {
      return { isOwned: false, isWishlist: false, data: null };
    }

    return {
      isOwned: !item.isWishlist,
      isWishlist: item.isWishlist === true,
      data: item
    };
  } catch (error) {
    console.error('Error checking cabinet status:', error);
    return { isOwned: false, isWishlist: false, data: null };
  }
}
