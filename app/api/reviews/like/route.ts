// app/api/reviews/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { 
    dbFindReview, 
    dbUpsertReviewLike, 
    dbDeleteReviewLike, 
    dbGetReviewDetail,
    dbUpsertReview,
    dbGetReviewLikesCount,
    dbGetReviewLike
} from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { spiritId, reviewUserId, likerUserId } = body;

        if (!spiritId || !reviewUserId || !likerUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Find the review (using user + spirit mapping)
        const review = await dbFindReview({ userId: reviewUserId, spiritId });
        if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

        const reviewId = review.id;

        // 2. Check current status via explicit ReviewLike check
        const userLike = await dbGetReviewLike(likerUserId, reviewId);
        const isLiked = !!userLike;

        // 3. Toggle Relational Like
        if (isLiked) {
            await dbDeleteReviewLike({ userId: likerUserId, reviewId });
        } else {
            await dbUpsertReviewLike({ userId: likerUserId, reviewId });
        }

        // 4. Sync Total Likes Count on the Review object (Denormalization for performance)
        const newTotalLikes = await dbGetReviewLikesCount(reviewId);
        
        // Update the review object with the new likes count
        await dbUpsertReview({ 
            id: reviewId, 
            spiritId, 
            userId: reviewUserId,
            likes: newTotalLikes 
        });

        return NextResponse.json({ 
            success: true, 
            isLiked: !isLiked, 
            likes: newTotalLikes
        }, { status: 200 });

    } catch (error) {
        console.error('Review like error:', error);
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }
}
