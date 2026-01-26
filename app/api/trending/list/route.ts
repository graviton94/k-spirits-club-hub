import { NextRequest, NextResponse } from 'next/server';
import { trendingDb, spiritsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitCount = parseInt(searchParams.get('limit') || '5');

        // 1. Get top spirit IDs and scores from trending DB
        const trendingItems = await trendingDb.getTopTrending(limitCount);

        if (trendingItems.length === 0) {
            return NextResponse.json({ spirits: [] }, { status: 200 });
        }

        // 2. Fetch full spirit data for these IDs
        const spiritIds = trendingItems.map(item => item.spiritId);
        const spirits = await spiritsDb.getByIds(spiritIds);

        // 3. Merged data with score for frontend sorting
        const spiritsWithScore = spirits.map(spirit => {
            const trending = trendingItems.find(t => t.spiritId === spirit.id);
            return {
                ...spirit,
                trendingScore: trending?.score || 0,
                trendingStats: trending?.stats || {}
            };
        }).sort((a, b) => b.trendingScore - a.trendingScore);

        return NextResponse.json({ spirits: spiritsWithScore }, { status: 200 });
    } catch (error) {
        console.error('Trending list error:', error);
        return NextResponse.json({ error: 'Failed to fetch trending spirits' }, { status: 500 });
    }
}
