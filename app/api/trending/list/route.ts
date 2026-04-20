// app/api/trending/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListTrendingSpirits } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitCount = parseInt(searchParams.get('limit') || '5');

        // Fetch top trending spirits directly from PostgreSQL
        const trendingSpirits = await dbListTrendingSpirits(limitCount);

        if (trendingSpirits.length === 0) {
            return NextResponse.json({ spirits: [] }, { status: 200 });
        }

        // Return the spirits with a mock trendingScore for frontend compatibility
        const spiritsWithScore = trendingSpirits.map((spirit: any, index: number) => ({
            ...spirit,
            trendingScore: trendingSpirits.length - index, // Simplified score
            trendingStats: {
                views: spirit.reviewCount * 10,
                reviews: spirit.reviewCount
            }
        }));

        return NextResponse.json({ spirits: spiritsWithScore }, { status: 200 });
    } catch (error) {
        console.error('Trending list error:', error);
        return NextResponse.json({ error: 'Failed to fetch trending spirits' }, { status: 500 });
    }
}
