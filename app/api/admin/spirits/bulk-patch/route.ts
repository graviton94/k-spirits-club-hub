import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbGetSpirit, dbUpsertSpirit } from '@/lib/db/data-connect-client';
import { enrichSpiritWithAI } from '@/lib/services/gemini-translation';
import { normalizeSpiritData } from '@/lib/utils/normalization';

export const runtime = 'edge';

// PATCH /api/admin/spirits/bulk-patch
export async function PATCH(req: NextRequest) {
    try {
        const { spiritIds, updates, enrich = false, normalize = false } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        const targets = (await Promise.all(spiritIds.map((id: string) => dbGetSpirit(id)))).filter((s): s is any => !!s);

        let updatedCount = 0;
        let enrichedCount = 0;
        let normalizedCount = 0;
        const enrichmentErrors: any[] = [];

        await Promise.all(targets.map(async (spirit) => {
            try {
                let currentUpdates = { ...updates };

                if (enrich) {
                    try {
                        const enriched = await enrichSpiritWithAI({
                            name: spirit.name,
                            category: spirit.category,
                            subcategory: spirit.subcategory ?? undefined,
                            distillery: spirit.distillery ?? undefined,
                            abv: spirit.abv ?? undefined,
                            region: spirit.region ?? undefined,
                            country: spirit.country ?? undefined,
                        });

                        console.log('[Bulk Patch] Enrichment - subcategory:', enriched.subcategory, '| region:', enriched.region);

                        // All fields from enrichSpiritWithAI are already camelCase — map directly
                        currentUpdates = {
                            ...currentUpdates,
                            nameEn: enriched.nameEn ?? spirit.nameEn,
                            subcategory: enriched.subcategory ?? spirit.subcategory,
                            distillery: enriched.distillery ?? spirit.distillery,
                            region: enriched.region ?? spirit.region,
                            country: enriched.country ?? spirit.country,
                            abv: enriched.abv ?? spirit.abv,
                            noseTags: enriched.noseTags?.length ? enriched.noseTags : (spirit.noseTags || []),
                            palateTags: enriched.palateTags?.length ? enriched.palateTags : (spirit.palateTags || []),
                            finishTags: enriched.finishTags?.length ? enriched.finishTags : (spirit.finishTags || []),
                            descriptionKo: enriched.descriptionKo || spirit.descriptionKo,
                            descriptionEn: enriched.descriptionEn || spirit.descriptionEn,
                            pairingGuideKo: enriched.pairingGuideKo || spirit.pairingGuideKo,
                            pairingGuideEn: enriched.pairingGuideEn || spirit.pairingGuideEn,
                            tastingNote: enriched.tastingNote || spirit.tastingNote,
                        };
                        enrichedCount++;
                    } catch (e: any) {
                        console.error(`Enrichment failed for ${spirit.id}`, e);
                        enrichmentErrors.push({ id: spirit.id, error: e.message || String(e) });
                    }
                }

                if (normalize) {
                    const normChanges = normalizeSpiritData({ ...spirit, ...currentUpdates });
                    if (Object.keys(normChanges).length > 0) {
                        currentUpdates = { ...currentUpdates, ...normChanges };
                        normalizedCount++;
                    }
                }

                await dbUpsertSpirit({ id: spirit.id, ...currentUpdates });
                updatedCount++;
            } catch (e) {
                console.error(`Failed to update spirit ${spirit.id}`, e);
            }
        }));

        if (updatedCount > 0) revalidateTag('related-spirits');

        return NextResponse.json({
            success: true,
            updatedCount,
            enrichedCount,
            normalizedCount,
            enrichmentErrors,
            message: `Successfully processed ${updatedCount} spirits (${enrichedCount} enriched, ${normalizedCount} normalized)`
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to bulk patch spirits', details: error.message }, { status: 500 });
    }
}
