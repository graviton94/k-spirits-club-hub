import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enrichSpiritMetadata } from '@/lib/services/gemini';
import { fetchSpiritImage } from '@/lib/services/image-search';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { action, spiritIds } = await req.json();
        let processedCount = 0;
        let errors: string[] = [];

        if (action === 'AUTO_PROCESS') {
            // Combined: ENRICH + FETCH_IMAGE for selected spirits
            if (!spiritIds || spiritIds.length === 0) {
                return NextResponse.json({ error: 'spiritIds required for AUTO_PROCESS' }, { status: 400 });
            }

            for (const spiritId of spiritIds) {
                try {
                    const spirit = await db.getSpirit(spiritId);
                    if (!spirit) continue;

                    // Step 1: AI Enrichment
                    const enrichedData = await enrichSpiritMetadata(spirit);
                    await db.updateSpirit(spirit.id, enrichedData);

                    // Step 2: Image Search
                    const nameEn = enrichedData.metadata?.name_en || spirit.metadata?.name_en || spirit.name;
                    const imgUrl = await fetchSpiritImage(nameEn, spirit.distillery);

                    await db.updateSpirit(spirit.id, {
                        imageUrl: imgUrl,
                        thumbnailUrl: imgUrl,
                        status: 'READY_FOR_CONFIRM',
                        updatedAt: new Date()
                    });

                    processedCount++;

                    // Delay to avoid rate limits
                    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

                } catch (error: any) {
                    console.error(`Auto-process failed for ${spiritId}:`, error);
                    errors.push(`[${spiritId}] ${error.message}`);
                }
            }

            return NextResponse.json({
                success: true,
                action: 'AUTO_PROCESS',
                processed: processedCount,
                errors,
                message: `Successfully processed ${processedCount} / ${spiritIds.length} items.`
            });

        } else if (action === 'ENRICH') {
            // 1. Fetch RAW spirits (Batch 5 to avoid timeout)
            const { data: rawSpirits } = await db.getSpirits({ status: 'RAW' }, { page: 1, pageSize: 5 });

            if (rawSpirits.length === 0) {
                return NextResponse.json({ message: 'No RAW spirits found to enrich.', count: 0 });
            }

            for (const spirit of rawSpirits) {
                try {
                    const enrichedData = await enrichSpiritMetadata(spirit);
                    await db.updateSpirit(spirit.id, enrichedData);
                    processedCount++;
                } catch (error: any) {
                    console.error(`Enrichment failed for ${spirit.name}:`, error);
                    errors.push(`[${spirit.name}] ${error.message}`);
                }
            }

        } else if (action === 'FETCH_IMAGE') {
            // 2. Fetch ENRICHED spirits (Batch 5)
            const { data: enrichedSpirits } = await db.getSpirits({ status: 'ENRICHED' }, { page: 1, pageSize: 5 });

            if (enrichedSpirits.length === 0) {
                return NextResponse.json({ message: 'No ENRICHED spirits found for image search.', count: 0 });
            }

            for (const spirit of enrichedSpirits) {
                try {
                    const nameEn = spirit.metadata?.name_en || spirit.name;
                    const imgUrl = await fetchSpiritImage(nameEn, spirit.distillery);

                    await db.updateSpirit(spirit.id, {
                        imageUrl: imgUrl,
                        thumbnailUrl: imgUrl,
                        status: 'READY_FOR_CONFIRM', // Move to next stage regardless, admin can fix if null
                        updatedAt: new Date()
                    });
                    processedCount++;

                    // Random delay to be polite to Google (1-2s)
                    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));

                } catch (error: any) {
                    console.error(`Image fetch failed for ${spirit.name}:`, error);
                    errors.push(`[${spirit.name}] ${error.message}`);
                }
            }

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            action,
            processed: processedCount,
            errors,
            message: `Successfully processed ${processedCount} items.`
        });

    } catch (error: any) {
        console.error('Pipeline API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
