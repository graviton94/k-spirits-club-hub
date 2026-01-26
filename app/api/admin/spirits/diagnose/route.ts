import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

/**
 * GET /api/admin/spirits/diagnose
 * 
 * Diagnostic endpoint to understand the current data state.
 * Returns statistics about spirits in the database.
 */
export async function GET(req: NextRequest) {
    try {
        console.log('[diagnose] Starting diagnostic check...');

        // Fetch ALL spirits without any filter
        const allSpirits = await db.getSpirits({}, { page: 1, pageSize: 5000 });
        
        console.log(`[diagnose] Total spirits in database: ${allSpirits.total}`);

        if (allSpirits.total === 0) {
            return NextResponse.json({
                success: true,
                message: '⚠️ DATABASE IS EMPTY - No spirits found!',
                totalSpirits: 0,
                recommendation: 'Import spirits data using the data import scripts in /scripts directory'
            });
        }

        // Analyze the data
        const statusCounts: Record<string, number> = {};
        const publishedCounts = {
            isPublishedTrue: 0,
            isPublishedFalse: 0,
            isPublishedUndefined: 0
        };
        const statusAndPublished = {
            publishedAndTrue: 0,
            publishedButFalse: 0,
            notPublishedButTrue: 0,
            otherAndTrue: 0,
            otherAndFalse: 0
        };

        allSpirits.data.forEach(spirit => {
            // Count by status
            const status = spirit.status || 'UNDEFINED';
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            // Count by isPublished
            if (spirit.isPublished === true) {
                publishedCounts.isPublishedTrue++;
            } else if (spirit.isPublished === false) {
                publishedCounts.isPublishedFalse++;
            } else {
                publishedCounts.isPublishedUndefined++;
            }

            // Cross-analysis
            if (spirit.status === 'PUBLISHED' && spirit.isPublished === true) {
                statusAndPublished.publishedAndTrue++;
            } else if (spirit.status === 'PUBLISHED' && spirit.isPublished !== true) {
                statusAndPublished.publishedButFalse++;
            } else if (spirit.status !== 'PUBLISHED' && spirit.isPublished === true) {
                statusAndPublished.notPublishedButTrue++;
            } else if (spirit.isPublished === true) {
                statusAndPublished.otherAndTrue++;
            } else {
                statusAndPublished.otherAndFalse++;
            }
        });

        // Sample spirits
        const samplePublished = allSpirits.data.find(s => s.isPublished === true);
        const sampleUnpublished = allSpirits.data.find(s => s.isPublished !== true);

        const result = {
            success: true,
            totalSpirits: allSpirits.total,
            statusBreakdown: statusCounts,
            publishedBreakdown: publishedCounts,
            crossAnalysis: statusAndPublished,
            samples: {
                published: samplePublished ? {
                    id: samplePublished.id,
                    name: samplePublished.name,
                    status: samplePublished.status,
                    isPublished: samplePublished.isPublished
                } : null,
                unpublished: sampleUnpublished ? {
                    id: sampleUnpublished.id,
                    name: sampleUnpublished.name,
                    status: sampleUnpublished.status,
                    isPublished: sampleUnpublished.isPublished
                } : null
            },
            recommendations: [] as string[]
        };

        // Add recommendations
        if (publishedCounts.isPublishedTrue === 0) {
            result.recommendations.push('🚨 CRITICAL: No spirits with isPublished=true found! Users will see ZERO data.');
            result.recommendations.push('ACTION: Use bulk publish endpoint or manually publish spirits in admin dashboard.');
        }

        if (statusAndPublished.publishedButFalse > 0) {
            result.recommendations.push(`⚠️ Found ${statusAndPublished.publishedButFalse} spirits with status='PUBLISHED' but isPublished=false`);
            result.recommendations.push('ACTION: Run /api/admin/spirits/fix-published-sync to fix inconsistencies.');
        }

        if (statusAndPublished.notPublishedButTrue > 0) {
            result.recommendations.push(`ℹ️ Found ${statusAndPublished.notPublishedButTrue} spirits with isPublished=true but status!='PUBLISHED'`);
            result.recommendations.push('INFO: This is acceptable - these spirits will be visible to users.');
        }

        console.log('[diagnose] Diagnostic complete:', JSON.stringify(result, null, 2));

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[diagnose] Error during diagnostic:', error);
        return NextResponse.json(
            { 
                error: 'Failed to run diagnostic', 
                details: error.message 
            }, 
            { status: 500 }
        );
    }
}
