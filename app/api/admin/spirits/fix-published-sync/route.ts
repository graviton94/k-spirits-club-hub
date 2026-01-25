import { NextRequest, NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/firestore-rest';

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
        const allSpirits = await spiritsDb.getAll({});
        
        // Find inconsistent records
        const inconsistentSpirits = allSpirits.filter(
            spirit => spirit.status === 'PUBLISHED' && spirit.isPublished !== true
        );

        console.log(`[fix-published-sync] Found ${inconsistentSpirits.length} inconsistent spirits out of ${allSpirits.length} total`);

        if (inconsistentSpirits.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No inconsistencies found. All PUBLISHED spirits have isPublished=true.',
                totalChecked: allSpirits.length,
                fixedCount: 0,
                inconsistentSpirits: []
            });
        }

        // Fix each inconsistent spirit
        const fixedSpirits: Array<{ id: string; name: string }> = [];
        const failedFixes: Array<{ id: string; name: string; error: string }> = [];

        for (const spirit of inconsistentSpirits) {
            try {
                await spiritsDb.upsert(spirit.id, { 
                    isPublished: true,
                    updatedAt: new Date()
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
            totalChecked: allSpirits.length,
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
