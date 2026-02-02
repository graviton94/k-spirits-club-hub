import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

        // Optimize: Parallel fetch for target spirits (much faster than sequential)
        const targets = (await Promise.all(spiritIds.map((id: string) => db.getSpirit(id)))).filter((s): s is any => !!s);

        let updatedCount = 0;
        let enrichedCount = 0;
        let normalizedCount = 0;
        const enrichmentErrors: any[] = [];

        // Optimize: Process all updates in parallel
        await Promise.all(targets.map(async (spirit) => {
            try {
                let currentUpdates = { ...updates };

                if (enrich) {
                    try {
                        const enrichmentData = await enrichSpiritWithAI({
                            name: spirit.name,
                            category: spirit.category,
                            subcategory: spirit.subcategory ?? undefined,
                            distillery: spirit.distillery ?? undefined,
                            abv: spirit.abv,
                            region: spirit.region ?? undefined,
                            country: spirit.country ?? undefined,
                            metadata: spirit.metadata
                        });

                        currentUpdates = {
                            ...currentUpdates,
                            name_en: enrichmentData.name_en,
                            description_en: enrichmentData.description_en,
                            pairing_guide_ko: enrichmentData.pairing_guide_ko,
                            pairing_guide_en: enrichmentData.pairing_guide_en,
                            // Apply AI-Corrected Metadata
                            distillery: enrichmentData.distillery || spirit.distillery,
                            region: enrichmentData.region || spirit.region,
                            country: enrichmentData.country || spirit.country,
                            abv: enrichmentData.abv || spirit.abv,
                            metadata: {
                                ...spirit.metadata,
                                ...currentUpdates.metadata,
                                name_en: enrichmentData.name_en,
                                nose_tags: enrichmentData.nose_tags || spirit.metadata?.nose_tags,
                                palate_tags: enrichmentData.palate_tags || spirit.metadata?.palate_tags,
                                finish_tags: enrichmentData.finish_tags || spirit.metadata?.finish_tags
                            }
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

                await db.updateSpirit(spirit.id, currentUpdates);
                updatedCount++;
            } catch (e) {
                console.error(`Failed to update spirit ${spirit.id}`, e);
            }
        }));

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
