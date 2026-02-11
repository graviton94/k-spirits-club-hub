import { NextRequest, NextResponse } from 'next/server';
import { generateDescriptionOnly } from '@/lib/services/gemini-translation';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const spiritData = await req.json();

        // Generate description only using the provided data
        const descriptionData = await generateDescriptionOnly({
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
            finish_tags: spiritData.finish_tags
        });

        return NextResponse.json({
            success: true,
            descriptionData
        });
    } catch (error: any) {
        console.error('[Description API] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate description'
        }, { status: 500 });
    }
}
