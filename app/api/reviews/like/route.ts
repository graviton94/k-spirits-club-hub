// app/api/reviews/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbFindReview, dbUpdateReview } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { spiritId, reviewUserId, likerUserId } = body;

        if (!spiritId || !reviewUserId || !likerUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Find the review (Data Connect uses UUID, but legacy API passes user+spirit)
        const review = await dbFindReview({ userId: reviewUserId, spiritId });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        // 2. Toggle legacy logic
        const currentLikedBy = review.likedBy || [];
        const isLiked = currentLikedBy.includes(likerUserId);
        
        let newLikedBy: string[];
        if (isLiked) {
            newLikedBy = currentLikedBy.filter((id: string) => id !== likerUserId);
        } else {
            newLikedBy = [...currentLikedBy, likerUserId];
        }

        // 3. Update in PostgreSQL
        await dbUpdateReview({
            id: review.id,
            likes: newLikedBy.length,
            likedBy: newLikedBy
        });

        return NextResponse.json({ 
            success: true, 
            isLiked: !isLiked, 
            likes: newLikedBy.length 
        }, { status: 200 });

    } catch (error) {
        console.error('Review like error:', error);
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }
}
