import { NextRequest, NextResponse } from 'next/server';
import { generatePairingGuide } from '@/lib/services/gemini-translation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'iad1';

export async function POST(req: NextRequest) {
    try {
        const spiritData = await req.json();

        const pairingData = await generatePairingGuide({
            name: spiritData.name,
            category: spiritData.category,
            subcategory: spiritData.subcategory,
            distillery: spiritData.distillery,
            abv: spiritData.abv,
            region: spiritData.region,
            country: spiritData.country,
            nameEn: spiritData.nameEn,
            noseTags: spiritData.noseTags,
            palateTags: spiritData.palateTags,
            finishTags: spiritData.finishTags,
            pairingGuideKo: spiritData.pairingGuideKo,
            pairingGuideEn: spiritData.pairingGuideEn
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
