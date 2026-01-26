import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

/**
 * POST /api/admin/spirits/bulk-publish
 * 
 * Emergency endpoint to bulk publish spirits.
 * This will set isPublished=true for all spirits that meet certain criteria.
 * 
 * Request body options:
 * - publishAll: boolean - If true, publishes ALL spirits regardless of status
 * - publishByStatus: string - Publish only spirits with this status (e.g., 'READY_FOR_CONFIRM')
 * - spiritIds: string[] - Publish only specific spirit IDs
 * - updateStatus: boolean - (Optional, default: true) If true, also sets status to 'PUBLISHED'
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publishAll, publishByStatus, spiritIds, updateStatus = true } = body;

        console.log('[bulk-publish] Starting bulk publish with options:', { publishAll, publishByStatus, spiritIds });

        let spiritsToPublish: any[] = [];

        if (spiritIds && Array.isArray(spiritIds) && spiritIds.length > 0) {
            // Publish specific spirits by ID
            console.log(`[bulk-publish] Publishing ${spiritIds.length} specific spirits`);
            const allSpirits = await db.getSpirits({}, { page: 1, pageSize: 5000 });
            spiritsToPublish = allSpirits.data.filter(s => spiritIds.includes(s.id));
        } else if (publishByStatus) {
            // Publish by status
            console.log(`[bulk-publish] Publishing spirits with status=${publishByStatus}`);
            const filtered = await db.getSpirits({ status: publishByStatus as any }, { page: 1, pageSize: 5000 });
            spiritsToPublish = filtered.data;
        } else if (publishAll === true) {
            // Publish ALL spirits
            console.log('[bulk-publish] Publishing ALL spirits');
            const allSpirits = await db.getSpirits({}, { page: 1, pageSize: 5000 });
            spiritsToPublish = allSpirits.data;
        } else {
            return NextResponse.json({
                error: 'Invalid request. Provide one of: publishAll=true, publishByStatus="STATUS", or spiritIds=["id1","id2"]'
            }, { status: 400 });
        }

        if (spiritsToPublish.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No spirits found matching the criteria',
                publishedCount: 0
            });
        }

        // Publish each spirit
        const results = {
            success: [] as string[],
            failed: [] as { id: string; error: string }[]
        };

        for (const spirit of spiritsToPublish) {
            try {
                const updateData: any = { isPublished: true };
                
                // Only update status to PUBLISHED if explicitly requested (default: true)
                // This allows for workflows where spirits can be published without changing their status
                if (updateStatus) {
                    updateData.status = 'PUBLISHED';
                }
                
                await db.updateSpirit(spirit.id, updateData);
                results.success.push(spirit.id);
                console.log(`[bulk-publish] Published: ${spirit.id} - ${spirit.name} (status update: ${updateStatus})`);
            } catch (error: any) {
                results.failed.push({ id: spirit.id, error: error.message });
                console.error(`[bulk-publish] Failed to publish ${spirit.id}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Published ${results.success.length} out of ${spiritsToPublish.length} spirits`,
            publishedCount: results.success.length,
            failedCount: results.failed.length,
            publishedIds: results.success,
            failures: results.failed
        });

    } catch (error: any) {
        console.error('[bulk-publish] Error during bulk publish:', error);
        return NextResponse.json(
            { 
                error: 'Failed to bulk publish', 
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}
