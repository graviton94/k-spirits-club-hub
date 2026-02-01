import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enrichSpiritWithAI, type SpiritEnrichmentInput } from '@/lib/services/gemini-translation';

export const runtime = 'edge';

/**
 * POST /api/admin/spirits/bulk-publish
 * 
 * Emergency endpoint to bulk publish spirits.
 * This will set isPublished=true for all spirits that meet certain criteria.
 * Now includes AI enrichment for each spirit (name_en, description_en, pairing guides).
 * 
 * Request body options:
 * - publishAll: boolean - If true, publishes ALL spirits regardless of status
 * - publishByStatus: string - Publish only spirits with this status (e.g., 'READY_FOR_CONFIRM')
 * - spiritIds: string[] - Publish only specific spirit IDs
 * - updateStatus: boolean - (Optional, default: true) If true, also sets status to 'PUBLISHED'
 * - skipEnrichment: boolean - (Optional, default: false) If true, skips AI enrichment
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publishAll, publishByStatus, spiritIds, updateStatus = true, skipEnrichment = false } = body;

        console.log('[bulk-publish] Starting bulk publish with options:', { publishAll, publishByStatus, spiritIds, skipEnrichment });

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

        // Publish each spirit with AI enrichment
        const results = {
            success: [] as string[],
            failed: [] as { id: string; error: string }[],
            enriched: [] as string[],
            enrichmentFailed: [] as string[]
        };

        for (const spirit of spiritsToPublish) {
            try {
                const updateData: any = { 
                    isPublished: true,
                    isReviewed: true,
                    reviewedBy: 'ADMIN',
                    reviewedAt: new Date().toISOString()
                };
                
                // Only update status to PUBLISHED if explicitly requested (default: true)
                if (updateStatus) {
                    updateData.status = 'PUBLISHED';
                }

                // AI Enrichment (unless skipped)
                if (!skipEnrichment) {
                    try {
                        console.log(`[bulk-publish] Enriching: ${spirit.id} - ${spirit.name}`);
                        const spiritInput: SpiritEnrichmentInput = {
                            name: spirit.name,
                            category: spirit.category,
                            subcategory: spirit.subcategory,
                            distillery: spirit.distillery,
                            abv: spirit.abv,
                            region: spirit.region,
                            metadata: spirit.metadata
                        };

                        const enrichmentData = await enrichSpiritWithAI(spiritInput);
                        
                        // Add enriched data to update
                        updateData.name_en = enrichmentData.name_en;
                        updateData.description_en = enrichmentData.description_en;
                        updateData.metadata = {
                            ...spirit.metadata,
                            pairing_guide_en: enrichmentData.pairing_guide_en,
                            pairing_guide_ko: enrichmentData.pairing_guide_ko
                        };
                        
                        results.enriched.push(spirit.id);
                        console.log(`[bulk-publish] ✓ Enriched: ${spirit.id}`);
                    } catch (enrichError: any) {
                        console.error(`[bulk-publish] ⚠ Enrichment failed for ${spirit.id}:`, enrichError.message);
                        results.enrichmentFailed.push(spirit.id);
                        // Continue with publish even if enrichment fails
                    }
                }
                
                await db.updateSpirit(spirit.id, updateData);
                results.success.push(spirit.id);
                console.log(`[bulk-publish] ✓ Published: ${spirit.id} - ${spirit.name} (enriched: ${!skipEnrichment && results.enriched.includes(spirit.id)})`);
            } catch (error: any) {
                results.failed.push({ id: spirit.id, error: error.message });
                console.error(`[bulk-publish] ✗ Failed to publish ${spirit.id}:`, error);
            }
        }

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
