import { NextRequest, NextResponse } from 'next/server';
import { trendingDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { spiritId, action } = body;

        if (!spiritId || !action) {
            return NextResponse.json({ error: 'Missing spiritId or action' }, { status: 400 });
        }

        // Action can be: view, wishlist, cabinet, review
        await trendingDb.logEvent(spiritId, action);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Trending log error:', error);
        return NextResponse.json({ error: 'Failed to log trending event' }, { status: 500 });
    }
}
