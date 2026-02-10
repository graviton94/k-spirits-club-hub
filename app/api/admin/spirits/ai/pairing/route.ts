import { NextRequest, NextResponse } from 'next/server';
import { generatePairingGuide } from '@/lib/services/gemini-translation';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const spiritData = await req.json();

        // Generate pairings only using the provided data
        const pairingData = await generatePairingGuide({
            name: spiritData.name,
            category: spiritData.category,
            subcategory: spiritData.subcategory,
            distillery: spiritData.distillery,
            abv: spiritData.abv,
            region: spiritData.region,
            country: spiritData.country,
            name_en: spiritData.name_en,
            nose_tags: spiritData.nose_tags,
            palate_tags: spiritData.palate_tags,
            finish_tags: spiritData.finish_tags,
            metadata: {
                pairing_guide_ko: spiritData.pairing_guide_ko,
                pairing_guide_en: spiritData.pairing_guide_en
            }
        });

        return NextResponse.json({
            success: true,
            pairingData
        });
    } catch (error: any) {
        console.error('[Pairing API] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate pairings'
        }, { status: 500 });
    }
}
