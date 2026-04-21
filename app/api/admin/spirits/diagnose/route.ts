import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListRawSpirits } from '@/lib/db/data-connect-client';

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

        // Fetch spirits via Data Connect (paginated, up to 5000)
        const allSpirits = await dbAdminListRawSpirits({ limit: 5000, offset: 0 });
        const total = allSpirits.length;

        console.log(`[diagnose] Total spirits returned: ${total}`);

        if (total === 0) {
            return NextResponse.json({
                success: true,
                message: '⚠️ DATABASE IS EMPTY - No spirits found!',
                totalSpirits: 0,
                recommendation: 'Import spirits data using the data import scripts in /scripts directory'
            });
        }

        const hitQueryLimit = total >= 5000;

        const statusCounts: Record<string, number> = {};
        const categoryCounts: Record<string, number> = {};
        const subcategoryCounts: Record<string, number> = {};
        const regionCounts: Record<string, number> = {};
        const distilleryCounts: Record<string, number> = {};

        const publishedCounts = { isPublishedTrue: 0, isPublishedFalse: 0, isPublishedUndefined: 0 };
        const statusAndPublished = {
            publishedAndTrue: 0, publishedButFalse: 0,
            notPublishedButTrue: 0, otherAndTrue: 0, otherAndFalse: 0
        };

        allSpirits.forEach((spirit: any) => {
            const status = spirit.status || 'UNDEFINED';
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            const cat = spirit.category || 'Unknown';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

            const sub = spirit.subcategory || 'Unknown';
            subcategoryCounts[sub] = (subcategoryCounts[sub] || 0) + 1;

            const reg = spirit.region || 'Unknown';
            regionCounts[reg] = (regionCounts[reg] || 0) + 1;

            const dist = spirit.distillery || 'Unknown';
            distilleryCounts[dist] = (distilleryCounts[dist] || 0) + 1;

            if (spirit.isPublished === true) publishedCounts.isPublishedTrue++;
            else if (spirit.isPublished === false) publishedCounts.isPublishedFalse++;
            else publishedCounts.isPublishedUndefined++;

            if (spirit.status === 'PUBLISHED' && spirit.isPublished === true) statusAndPublished.publishedAndTrue++;
            else if (spirit.status === 'PUBLISHED' && spirit.isPublished !== true) statusAndPublished.publishedButFalse++;
            else if (spirit.status !== 'PUBLISHED' && spirit.isPublished === true) statusAndPublished.notPublishedButTrue++;
            else if (spirit.isPublished === true) statusAndPublished.otherAndTrue++;
            else statusAndPublished.otherAndFalse++;
        });

        const samplePublished = allSpirits.find((s: any) => s.isPublished === true);
        const sampleUnpublished = allSpirits.find((s: any) => s.isPublished !== true);

        const recommendations: string[] = [];
        if (hitQueryLimit) recommendations.push('⚠️ WARNING: Query limit reached (5000 spirits). Diagnostic may be incomplete.');
        if (publishedCounts.isPublishedTrue === 0) {
            recommendations.push('🚨 CRITICAL: No spirits with isPublished=true found!');
            recommendations.push('ACTION: Use bulk publish endpoint or manually publish spirits in admin dashboard.');
        }
        if (statusAndPublished.publishedButFalse > 0) {
            recommendations.push(`⚠️ Found ${statusAndPublished.publishedButFalse} spirits with status=PUBLISHED but isPublished=false`);
            recommendations.push('ACTION: Run /api/admin/spirits/fix-published-sync to fix inconsistencies.');
        }
        if (statusAndPublished.notPublishedButTrue > 0) {
            recommendations.push(`ℹ️ Found ${statusAndPublished.notPublishedButTrue} spirits with isPublished=true but status!=PUBLISHED`);
        }

        return NextResponse.json({
            success: true,
            totalSpirits: total,
            dataAnalyzed: total,
            queryLimitReached: hitQueryLimit,
            schemaAnalysis: { categories: categoryCounts, subcategories: subcategoryCounts, regions: regionCounts, distilleries: distilleryCounts },
            statusBreakdown: statusCounts,
            publishedBreakdown: publishedCounts,
            crossAnalysis: statusAndPublished,
            samples: {
                published: samplePublished ? { id: samplePublished.id, name: samplePublished.name, status: samplePublished.status, isPublished: samplePublished.isPublished } : null,
                unpublished: sampleUnpublished ? { id: sampleUnpublished.id, name: sampleUnpublished.name, status: sampleUnpublished.status, isPublished: sampleUnpublished.isPublished } : null
            },
            recommendations
        });
    } catch (error: any) {
        console.error('[diagnose] Error:', error);
        return NextResponse.json({ error: 'Failed to run diagnostic', details: error.message }, { status: 500 });
    }
}
