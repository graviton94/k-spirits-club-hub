// app/api/reviews/like/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { 
    dbFindReview, 
    dbUpsertReviewLike, 
    dbDeleteReviewLike, 
    dbGetReviewDetail,
    dbUpdateReviewLikesCount,
    dbGetReviewLikesCount,
    dbGetReviewLike,
    dbGetReview,
    dbIncrementUserHeartsReceived
} from '@/lib/db/data-connect-client';
import { verifyRequestToken } from '@/lib/auth/verifyToken';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const verified = await verifyRequestToken(request.headers.get('authorization'));
        if (!verified) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { spiritId, reviewUserId, reviewId: explicitReviewId } = body;
        const likerUserId = verified.uid;

        if (!explicitReviewId && (!spiritId || !reviewUserId)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let reviewId = explicitReviewId;
        let finalSpiritId = spiritId;
        let finalReviewUserId = reviewUserId;

        // 1. Find the review if UUID is not provided
        if (!reviewId) {
            const review = await dbFindReview({ userId: reviewUserId, spiritId: spiritId! });
            if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
            reviewId = review.id;
        } else {
            // Find parent spirit/user if not provided (needed for denormalized update)
            if (!finalSpiritId || !finalReviewUserId) {
                const reviewDetail = await dbGetReview(reviewId);
                if (!reviewDetail) return NextResponse.json({ error: 'Review detail not found' }, { status: 404 });
                finalSpiritId = reviewDetail.spirit.id;
                finalReviewUserId = reviewDetail.user.id;
            }
        }

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
        
        // Update ONLY the likes count using the specialized update mutation
        // This avoids validation errors for missing non-nullable fields like 'content' or 'rating'
        await dbUpdateReviewLikesCount({
            id: reviewId,
            likes: newTotalLikes
        });

        // 5. Sync Author's total heartsReceived count
        if (finalReviewUserId) {
            await dbIncrementUserHeartsReceived(finalReviewUserId, isLiked ? -1 : 1);
        }

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
