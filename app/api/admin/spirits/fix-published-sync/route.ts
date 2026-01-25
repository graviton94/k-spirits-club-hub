import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

/**
 * POST /api/admin/spirits/fix-published-sync
 * 
 * Migration endpoint to audit and fix data consistency issues.
 * Finds all spirits where status='PUBLISHED' but isPublished=false and fixes them.
 * 
 * This is a one-time migration script but can be run multiple times safely.
 */
export async function POST(req: NextRequest) {
    try {
        console.log('[fix-published-sync] Starting audit...');

        // Fetch all spirits (no filter to get everything)
        // Note: This fetches up to 5000 spirits (Firestore query limit)
        const allSpirits = await db.getSpirits({}, { page: 1, pageSize: 5000 });
        
        // Find inconsistent records
        const inconsistentSpirits = allSpirits.data.filter(
            spirit => spirit.status === 'PUBLISHED' && spirit.isPublished !== true
        );

        console.log(`[fix-published-sync] Found ${inconsistentSpirits.length} inconsistent spirits out of ${allSpirits.total} total`);

        if (inconsistentSpirits.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No inconsistencies found. All PUBLISHED spirits have isPublished=true.',
                totalChecked: allSpirits.total,
                fixedCount: 0,
                inconsistentSpirits: []
            });
        }

        // Fix each inconsistent spirit using db.updateSpirit to ensure all business logic is applied
        const fixedSpirits: Array<{ id: string; name: string }> = [];
        const failedFixes: Array<{ id: string; name: string; error: string }> = [];

        for (const spirit of inconsistentSpirits) {
            try {
                // Use db.updateSpirit to apply all business rules including search keyword generation
                await db.updateSpirit(spirit.id, { 
                    isPublished: true
                });
                fixedSpirits.push({ id: spirit.id, name: spirit.name });
                console.log(`[fix-published-sync] Fixed: ${spirit.id} - ${spirit.name}`);
            } catch (error: any) {
                failedFixes.push({ 
                    id: spirit.id, 
                    name: spirit.name, 
                    error: error.message 
                });
                console.error(`[fix-published-sync] Failed to fix ${spirit.id}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fixed ${fixedSpirits.length} out of ${inconsistentSpirits.length} inconsistent spirits.`,
            totalChecked: allSpirits.total,
            fixedCount: fixedSpirits.length,
            failedCount: failedFixes.length,
            fixedSpirits,
            failedFixes
        });

    } catch (error: any) {
        console.error('[fix-published-sync] Error during audit:', error);
        return NextResponse.json(
            { 
                error: 'Failed to run sync audit', 
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}
