export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { enrichSpiritWithAI, type SpiritEnrichmentInput } from '@/lib/services/gemini-translation';

/**
 * POST /api/admin/spirits/enrich
 * 
 * Generates AI-powered enrichment for a spirit including:
 * - name_en: English name translation
 * - description_en: English description
 * - pairing_guide_en: Global food pairing recommendations
 * - pairing_guide_ko: Korean food pairing recommendations
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, category, subcategory, distillery, abv, region, metadata } = body;

        if (!name || !category) {
            return NextResponse.json(
                { error: 'Name and category are required' },
                { status: 400 }
            );
        }

        const spiritInput: SpiritEnrichmentInput = {
            name,
            category,
            subcategory,
            distillery,
            abv,
            region,
            metadata
        };

        const enrichmentData = await enrichSpiritWithAI(spiritInput);
        return NextResponse.json(enrichmentData);

    } catch (error: any) {
        console.error('[enrich] Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to enrich spirit data',
                details: error.message 
            },
            { status: 500 }
        );
    }
}
