import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = 'edge';

/**
 * GET /api/spirits/[id]
 * Fetch a single spirit by ID with full details
 * This endpoint is used for on-demand loading of complete spirit data
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        console.log(`[API] GET /api/spirits/${id} - Fetching spirit details...`);

        const spirit = await db.getSpirit(id);

        if (!spirit) {
            console.warn(`[API] Spirit not found: ${id}`);
            return NextResponse.json(
                { error: 'Spirit not found' },
                { status: 404 }
            );
        }

        // Only return published spirits to public
        if (!spirit.isPublished) {
            console.warn(`[API] Attempted to access unpublished spirit: ${id}`);
            return NextResponse.json(
                { error: 'Spirit not found' },
                { status: 404 }
            );
        }

        console.log(`[API] ✅ Successfully fetched spirit: ${spirit.name}`);

        return NextResponse.json({
            spirit,
            timestamp: Date.now()
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        console.error('[API] ❌ Error fetching spirit:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
