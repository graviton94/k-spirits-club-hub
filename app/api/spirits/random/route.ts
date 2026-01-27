import { NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/index';

export const runtime = 'edge';

export async function GET() {
    try {
        // 1. Fetch a batch of spirits (limiting for performance)
        // In a real large-scale app, we'd use a more sophisticated random strategy, 
        // but for this MVP, sampling 50 and picking 1 is efficient and effective.
        const spirits = await spiritsDb.getAll({ isPublished: true });

        if (!spirits || spirits.length === 0) {
            return NextResponse.json({ error: 'No spirits found' }, { status: 404 });
        }

        // 2. Pick one at random
        const randomIndex = Math.floor(Math.random() * spirits.length);
        const spirit = spirits[randomIndex];

        return NextResponse.json({
            id: spirit.id,
            name: spirit.name,
            category: spirit.category,
        });
    } catch (error) {
        console.error('Failed to fetch random spirit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
