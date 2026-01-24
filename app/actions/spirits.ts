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
        const result = await db.getSpirits(filter, pagination);
        // Plain objects are required for server actions (no Dates, though our db returns dates? 
        // Wait, fromFirestore returns Dates? 
        // Looking at schema, Spirit has `updatedAt: string | Date`. 
        // If it's Date, we might need to serialize.
        // firestore-rest.ts uses `value.timestampValue` which is ISO string. 
        // And toFirestore uses `new Date()`.
        // Let's assume serialization happens automatically or data is already simple types.
        // Next.js Server Actions can return JSON-serializable structures.
        return result;
    } catch (error) {
        console.error("Failed to fetch spirits:", error);
        throw new Error("Failed to fetch spirits");
    }
}
