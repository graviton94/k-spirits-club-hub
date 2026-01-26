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
    // Use try-catch here to be safe, though getByIds handles missing ones internally usually
    let masterSpirits: any[] = [];
    try {
      masterSpirits = await spiritsDb.getByIds(spiritIds);
    } catch (e) {
      console.error('Error fetching master spirits:', e);
      // Continue even if master fetch fails, so we at least show cabinet items
    }

    // Merge cabinet data with master spirit data (LEFT JOIN)
    const joinedData = cabinetItems.map((cabinetItem: any) => {
      const masterSpirit = masterSpirits.find(s => s.id === cabinetItem.id);

      if (!masterSpirit) {
        // Fallback for items not found in master spirits collection
        // Client-side enrichment will try to fill in details from searchIndex
        return {
          id: cabinetItem.id,
          // Provide minimal structure so it doesn't crash UI
          name: cabinetItem.name || 'Unknown Spirit', // Should ideally save name in cabinet too to be safe
          category: cabinetItem.category || 'Unknown',
          ...cabinetItem,
          isMissingMasterData: true // Flag for UI to know
        };
      }

      // Merge: master spirit data + user-specific cabinet data
      return {
        ...masterSpirit,
        ...cabinetItem,
      };
    });

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
  data?: {
    isWishlist?: boolean;
    userReview?: any;
    userName?: string;
    // Enriched Data Fields
    name?: string;
    distillery?: string;
    imageUrl?: string;
    category?: string;
    abv?: number;
  }
) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const cabinetData: any = {
      id: spiritId,
      isWishlist: data?.isWishlist ?? false,
      userReview: data?.userReview ?? null,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add Enriched Data if provided
    if (data?.name) cabinetData.name = data.name;
    if (data?.distillery) cabinetData.distillery = data.distillery;
    if (data?.imageUrl) cabinetData.imageUrl = data.imageUrl;
    if (data?.category) cabinetData.category = data.category;
    if (data?.abv) cabinetData.abv = data.abv;

    // Add Review Tags snapshot if review exists
    if (data?.userReview) {
      cabinetData.rating = data.userReview.ratingOverall || 0;
      // Store top 3 tags for quick access if needed, or full arrays
      // For now, let's store what we can easily display in the cabinet card
      if (data.userReview.tagsN) cabinetData.tagsN = data.userReview.tagsN;
      if (data.userReview.tagsP) cabinetData.tagsP = data.userReview.tagsP;
      if (data.userReview.tagsF) cabinetData.tagsF = data.userReview.tagsF;
    }

    // 1. Save to private cabinet
    await cabinetDb.upsert(userId, spiritId, cabinetData);

    // 2. If there's a review (not wishlist), also save to public reviews
    if (!cabinetData.isWishlist && data?.userReview) {
      const publicReviewData = {
        spiritId,
        userId,
        userName: data?.userName || 'Anonymous',
        spiritName: data?.name || 'Unknown Spirit', // Allow finding reviews by spirit name
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
 * Both operations are attempted; partial failures are logged but don't block the operation
 */
export async function removeFromCabinet(userId: string, spiritId: string) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Delete from both locations - reviewsDb.delete is resilient and won't throw
    // cabinetDb.delete may throw, but we want to attempt both regardless
    const results = await Promise.allSettled([
      cabinetDb.delete(userId, spiritId),
      reviewsDb.delete(spiritId, userId)
    ]);

    // Check if cabinet delete failed (the critical operation)
    if (results[0].status === 'rejected') {
      console.error('Failed to delete from cabinet:', results[0].reason);
      throw new Error('Failed to delete from cabinet');
    }

    // Log if review delete failed, but don't throw (it's non-critical)
    if (results[1].status === 'rejected') {
      console.warn('Failed to delete review (non-critical):', results[1].reason);
    }

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
