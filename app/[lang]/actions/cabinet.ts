// app/[lang]/actions/cabinet.ts

"use server";

import { 
    dbListUserCabinet, 
    dbUpsertCabinet, 
    dbDeleteCabinet,
    dbGetSpirit,
    dbUpsertReview
} from '@/lib/db/data-connect-client';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

/**
 * Update a cabinet entry with personalRating and personalNotes
 */
export async function updateCabinetEntry(
    userId: string,
    spiritId: string,
    data: { personalRating?: number; personalNotes?: string; isFavorite?: boolean }
) {
    if (!userId) throw new Error('User not authenticated');

    try {
        await dbUpsertCabinet({
            userId,
            spiritId,
            rating: data.personalRating,
            notes: data.personalNotes,
            isFavorite: data.isFavorite
        });

        revalidatePath(`/cabinet`);
        return { success: true };
    } catch (error: any) {
        console.error('Error updating cabinet entry:', error);
        throw error;
    }
}

/**
 * Get all spirits in the user's cabinet
 * Optimized relational fetch via Data Connect
 */
export async function getUserCabinet(userId: string) {
    if (!userId) return [];

    try {
        const cabinetItems = await dbListUserCabinet(userId);
        
        // Data Connect listUserCabinet already joins with spirit data
        return cabinetItems.map((item: any) => ({
            ...item.spirit,
            ...item,
            id: item.spiritId // Ensure consistency
        }));
    } catch (error) {
        console.error('Error fetching user cabinet:', error);
        return [];
    }
}

/**
 * Add a spirit to the cabinet
 * Implements dual-write: saves to both cabinet and reviews if a review is present
 */
export async function addToCabinet(
    userId: string,
    spiritId: string,
    data?: {
        isWishlist?: boolean;
        userReview?: any;
        userName?: string;
        name?: string;
        imageUrl?: string;
    }
) {
    if (!userId) throw new Error('User not authenticated');

    try {
        // 1. Save to cabinet
        await dbUpsertCabinet({
            userId,
            spiritId,
            notes: data?.userReview?.comment || '',
            rating: data?.userReview?.ratingOverall || 0,
            isFavorite: false // Default
        });

        // 2. If there's a review, save to public reviews
        if (!data?.isWishlist && data?.userReview) {
            await dbUpsertReview({
                id: uuidv4(),
                spiritId,
                userId,
                rating: data.userReview.ratingOverall || 0,
                content: data.userReview.comment || '',
                nose: data.userReview.tagsN?.join(', ') || '',
                palate: data.userReview.tagsP?.join(', ') || '',
                finish: data.userReview.tagsF?.join(', ') || '',
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        revalidatePath(`/cabinet`);
        revalidatePath(`/spirits/${spiritId}`);
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
    if (!userId) throw new Error('User not authenticated');

    try {
        await dbDeleteCabinet({ userId, spiritId });
        revalidatePath(`/cabinet`);
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
    if (!userId) return { isOwned: false, isWishlist: false, data: null };

    try {
        const items = await dbListUserCabinet(userId);
        const item = items.find((i: any) => i.spiritId === spiritId);

        if (!item) return { isOwned: false, isWishlist: false, data: null };

        return {
            isOwned: (item.rating ?? 0) > 0, // Simplified logic for migration
            isWishlist: (item.rating ?? 0) === 0,
            data: item
        };
    } catch (error) {
        console.error('Error checking cabinet status:', error);
        return { isOwned: false, isWishlist: false, data: null };
    }
}

/**
 * Get IDs of spirits in the user's cabinet and wishlist
 * Used for batch checking in explore page
 */
export async function getCabinetStatusInfo(userId: string) {
    if (!userId) return { ownedIds: [], wishlistIds: [] };

    try {
        const items = await dbListUserCabinet(userId);
        const ownedIds: string[] = [];
        const wishlistIds: string[] = [];

        items.forEach((item: any) => {
            if ((item.rating ?? 0) > 0) {
                ownedIds.push(item.spiritId);
            } else {
                wishlistIds.push(item.spiritId);
            }
        });

        return { ownedIds, wishlistIds };
    } catch (error) {
        console.error('Error getting cabinet status info:', error);
        return { ownedIds: [], wishlistIds: [] };
    }
}
