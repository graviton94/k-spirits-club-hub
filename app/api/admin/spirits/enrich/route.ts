import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
import {
    auditSpiritInfo,
    generateSensoryData,
    generatePairingGuide,
    type SpiritEnrichmentInput
} from '@/lib/services/gemini-translation';

export async function POST(req: NextRequest) {
    let stage = 'unknown';
    try {
        const body = await req.json();
        const { stage: bodyStage, ...spiritInput } = body;
        stage = bodyStage;

        if (!spiritInput.name || !spiritInput.category) {
            return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
        }

        let result;
        switch (stage) {
            case 'audit':
                result = await auditSpiritInfo(spiritInput);
                break;
            case 'sensory':
                result = await generateSensoryData(spiritInput);
                break;
            case 'pairing':
                result = await generatePairingGuide(spiritInput);
                break;
            default:
                return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error(`[enrich:${stage}] Error:`, error);
        return NextResponse.json({ error: 'Enrichment failed', details: error.message }, { status: 500 });
    }
}
