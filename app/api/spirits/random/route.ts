import { NextResponse } from 'next/server';
import { dbListSpirits } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function GET() {
    try {
        // 1. Fetch a batch of published spirits
        const spirits = await dbListSpirits();

        if (!spirits || spirits.length === 0) {
            return NextResponse.json({ error: 'No spirits found' }, { status: 404 });
        }

        // 2. Pick one at random
        const randomIndex = Math.floor(Math.random() * spirits.length);
        const spirit = spirits[randomIndex];

        return NextResponse.json({
            id: spirit.id,
            name: spirit.name,
            nameEn: spirit.nameEn || null,
            category: spirit.category,
            imageUrl: spirit.imageUrl,
            thumbnailUrl: spirit.thumbnailUrl
        });
    } catch (error: any) {
        console.error('Failed to fetch random spirit:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
