import { NextRequest, NextResponse } from 'next/server';
import { reviewsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { spiritId, reviewUserId, likerUserId } = body;

        if (!spiritId || !reviewUserId || !likerUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await reviewsDb.toggleLike(spiritId, reviewUserId, likerUserId);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Review like error:', error);
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }
}
