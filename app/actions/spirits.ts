'use server';

import { db } from "@/lib/db";
import { SpiritFilter, PaginationParams } from "@/lib/db/schema";

/**
 * Server Action to fetch spirits safely.
 * Wraps the server-side DB call so it can be used from Client Components.
 */
export async function getSpiritsAction(
    filter: SpiritFilter = {},
    pagination: PaginationParams = { page: 1, pageSize: 20 }
) {
    try {
        console.log('[getSpiritsAction] Fetching spirits with filter:', JSON.stringify(filter), 'pagination:', pagination);
        const result = await db.getSpirits(filter, pagination);
        console.log('[getSpiritsAction] Returned', result.data.length, 'spirits out of', result.total, 'total');
        
        // Log a sample spirit to verify published status
        if (result.data.length > 0) {
            const sample = result.data[0];
            console.log('[getSpiritsAction] Sample spirit:', {
                id: sample.id,
                name: sample.name,
                status: sample.status,
                isPublished: sample.isPublished
            });
        }
        
        return result;
    } catch (error) {
        console.error("[getSpiritsAction] Failed to fetch spirits:", error);
        throw new Error("Failed to fetch spirits");
    }
}
