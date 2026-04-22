import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbGetSpirit } from '@/lib/db/data-connect-client';
import { enrichSpiritWithAI, type SpiritEnrichmentInput } from '@/lib/services/gemini-translation';
import { dbAdminUpsertSpirit, dbAdminListRawSpirits } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';

/**
 * POST /api/admin/spirits/bulk-publish
 *
 * Bulk publish spirits with optional AI enrichment.
 * Options:
 * - publishAll: boolean
 * - publishByStatus: string
 * - spiritIds: string[]
 * - updateStatus: boolean (default: true)
 * - skipEnrichment: boolean (default: false)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publishAll, publishByStatus, spiritIds, updateStatus = true, skipEnrichment = false } = body;

        console.log('[bulk-publish] Starting with options:', { publishAll, publishByStatus, spiritIds, skipEnrichment });

        let spiritsToPublish: any[] = [];

        if (spiritIds && Array.isArray(spiritIds) && spiritIds.length > 0) {
            console.log(`[bulk-publish] Publishing ${spiritIds.length} specific spirits`);
            const fetched = await Promise.all(spiritIds.map((id: string) => dbGetSpirit(id)));
            spiritsToPublish = fetched.filter(Boolean);
        } else if (publishByStatus) {
            console.log(`[bulk-publish] Publishing spirits with status=${publishByStatus}`);
            const all = await dbAdminListRawSpirits({ limit: 5000, offset: 0 });
            spiritsToPublish = all.filter((s: any) => s.status === publishByStatus);
        } else if (publishAll === true) {
            console.log('[bulk-publish] Publishing ALL spirits');
            spiritsToPublish = await dbAdminListRawSpirits({ limit: 5000, offset: 0 });
        } else {
            return NextResponse.json({
                error: 'Invalid request. Provide one of: publishAll=true, publishByStatus="STATUS", or spiritIds=["id1","id2"]'
            }, { status: 400 });
        }

        if (spiritsToPublish.length === 0) {
            return NextResponse.json({ success: true, message: 'No spirits found matching the criteria', publishedCount: 0 });
        }

        const results = {
            success: [] as string[],
            failed: [] as { id: string; error: string }[],
            enriched: [] as string[],
            enrichmentFailed: [] as string[]
        };

        for (const spirit of spiritsToPublish) {
            try {
                const updateData: any = {
                    id: spirit.id,
                    isPublished: true,
                    isReviewed: true,
                };

                if (updateStatus) updateData.status = 'PUBLISHED';

                // AI Enrichment
                if (!skipEnrichment) {
                    try {
                        console.log(`[bulk-publish] Enriching: ${spirit.id} - ${spirit.name}`);
                        const spiritInput: SpiritEnrichmentInput = {
                            name: spirit.name,
                            category: spirit.category,
                            subcategory: spirit.subcategory ?? undefined,
                            distillery: spirit.distillery ?? undefined,
                            abv: spirit.abv ?? undefined,
                            region: spirit.region ?? undefined,
                            country: spirit.country ?? undefined,
                        };

                        const enriched = await enrichSpiritWithAI(spiritInput);

                        // Map camelCase fields from enrichSpiritWithAI
                        updateData.nameEn = enriched.nameEn;
                        updateData.descriptionEn = enriched.descriptionEn;
                        updateData.descriptionKo = enriched.descriptionKo;
                        updateData.noseTags = enriched.noseTags;
                        updateData.palateTags = enriched.palateTags;
                        updateData.finishTags = enriched.finishTags;
                        updateData.tastingNote = enriched.tastingNote;
                        updateData.pairingGuideKo = enriched.pairingGuideKo;
                        updateData.pairingGuideEn = enriched.pairingGuideEn;

                        results.enriched.push(spirit.id);
                        console.log(`[bulk-publish] ✓ Enriched: ${spirit.id}`);
                    } catch (enrichError: any) {
                        console.error(`[bulk-publish] ⚠ Enrichment failed for ${spirit.id}:`, enrichError.message);
                        results.enrichmentFailed.push(spirit.id);
                    }
                }

                await dbAdminUpsertSpirit(updateData);
                results.success.push(spirit.id);
                console.log(`[bulk-publish] ✓ Published: ${spirit.id} - ${spirit.name}`);
            } catch (error: any) {
                results.failed.push({ id: spirit.id, error: error.message });
                console.error(`[bulk-publish] ✗ Failed to publish ${spirit.id}:`, error);
            }
        }

        if (results.success.length > 0) revalidateTag('related-spirits');

        return NextResponse.json({
            success: true,
            message: `Published ${results.success.length} out of ${spiritsToPublish.length} spirits`,
            publishedCount: results.success.length,
            enrichedCount: results.enriched.length,
            enrichmentFailedCount: results.enrichmentFailed.length,
            failedCount: results.failed.length,
            publishedIds: results.success,
            enrichedIds: results.enriched,
            enrichmentFailedIds: results.enrichmentFailed,
            failures: results.failed
        });
    } catch (error: any) {
        console.error('[bulk-publish] Error:', error);
        return NextResponse.json({ error: 'Failed to bulk publish', details: error.message }, { status: 500 });
    }
}
