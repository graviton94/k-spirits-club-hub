"use server";

import { cabinetDb, spiritsDb } from '@/lib/db/firestore-rest';

/**
 * Toggle a spirit in/out of the user's cabinet
 * If the spirit exists in the cabinet, it will be removed
 * If it doesn't exist, it will be added with serverTimestamp
 */
export async function toggleCabinet(spiritId: string, authToken?: string) {
  // For server actions, we need to get the user ID from the client
  // Since we can't use Firebase Auth directly in server actions,
  // we'll need the user to pass their auth token or UID
  // For now, we'll throw an error - this will be called from client with proper auth
  throw new Error('toggleCabinet must be called from client-side with proper authentication');
}

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
    const cabinetItems = await cabinetDb.getAll(userId);
    const existingItem = cabinetItems.find((item: any) => item.id === spiritId);

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
 */
export async function addToCabinet(
  userId: string,
  spiritId: string,
  data?: { isWishlist?: boolean; userReview?: any }
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

    await cabinetDb.upsert(userId, spiritId, cabinetData);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding to cabinet:', error);
    throw error;
  }
}

/**
 * Remove a spirit from the cabinet
 */
export async function removeFromCabinet(userId: string, spiritId: string) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    await cabinetDb.delete(userId, spiritId);
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
    const cabinetItems = await cabinetDb.getAll(userId);
    const item = cabinetItems.find((i: any) => i.id === spiritId);
    
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
