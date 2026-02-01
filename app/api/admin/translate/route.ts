export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { translateSpiritName } from '@/lib/services/gemini-translation';

export async function POST(req: NextRequest) {
    try {
        const { name, category, distillery } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const { name_en } = await translateSpiritName(name, category, distillery);

        return NextResponse.json({ name_en });
    } catch (error: any) {
        console.error('Translation API Error:', error);
        return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 });
    }
}
