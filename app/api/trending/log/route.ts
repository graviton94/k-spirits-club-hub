// app/api/trending/log/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Trending Log API
 * Placeholder for engagement tracking (Post-Firestore Migration)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { spiritId, action } = body;

        if (!spiritId || !action) {
            return NextResponse.json({ error: 'Missing spiritId or action' }, { status: 400 });
        }

        // TODO: Implement relational analytics storage in a future sprint.
        // For now, we return success to maintain frontend stability.
        console.log(`[TRENDING_LOG] Spirit: ${spiritId}, Action: ${action}`);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Trending log error:', error);
        return NextResponse.json({ error: 'Failed to log trending event' }, { status: 500 });
    }
}
