import { NextRequest, NextResponse } from 'next/server';
import { 
  dbListSpiritReviews
} from '@/lib/db/data-connect-client';
import {
  dbAdminFindReview,
  dbAdminUpsertReview,
  dbAdminIncrementUserReviews,
  dbAdminListUserReviews
} from '@/lib/db/data-connect-admin';
import { verifyRequestToken } from '@/lib/auth/verifyToken';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

/**
 * Reviews API Route
 * Handles Fetching (GET), Creating (POST), and Deleting (DELETE) reviews using Firebase Data Connect.
 */

// POST /api/reviews - Create or Update a review
export async function POST(request: NextRequest) {
  try {
    const verified = await verifyRequestToken(request.headers.get('authorization'));
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = verified.uid;

    const body = await request.json();
    const { spiritId, rating, content, nose, palate, finish, imageUrls } = body;

    if (!spiritId || rating === undefined || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert to Data Connect using admin REST module (bypasses @auth for server-side context)
    const existingReview = await dbAdminFindReview({ userId, spiritId });
    const reviewId = existingReview?.id || uuidv4();
    const now = new Date().toISOString();
    await dbAdminUpsertReview({
      id: reviewId,
      spiritId,
      userId,
      rating: Math.max(1, Math.min(5, Math.round(Number(rating)))),
      title: body.title || '',
      content,
      nose: nose || '',
      palate: palate || '',
      finish: finish || '',
      likes: existingReview?.likes || 0,
      isPublished: true,
      imageUrls: imageUrls || [],
      createdAt: now,
      updatedAt: now
    });

    // Increment user stats
    try {
      await dbAdminIncrementUserReviews(userId);
    } catch (e) {
      console.error('Failed to increment user reviews stat:', e);
    }

    return NextResponse.json({
      success: true,
      id: reviewId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({
      error: 'Failed to create review',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// GET /api/reviews - List reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const userIdParam = searchParams.get('userId');

    if (userIdParam) {
      const userReviews = await dbAdminListUserReviews(userIdParam);
      const reviews = userReviews.map((r: any) => ({
        id: r.id,
        spiritId: r.spiritId,
        spiritName: r.spirit?.name || 'Unknown',
        imageUrl: r.spirit?.imageUrl,
        category: r.spirit?.category,
        rating: r.rating,
        content: r.content,
        nose: r.nose,
        palate: r.palate,
        finish: r.finish,
        createdAt: r.createdAt,
        imageUrls: r.imageUrls || []
      }));
      return NextResponse.json({ reviews }, { status: 200 });
    }

    if (mode === 'recent') {
      const allRecent = await dbListSpiritReviews(10, 0);
      
      // Flat mapping for backward compatibility with legacy Home components
      const reviews = allRecent.map((r: any) => ({
        id: r.id,
        spiritId: r.spirit?.id,
        spiritName: r.spirit?.name || 'Unknown Bottle',
        imageUrl: r.spirit?.imageUrl,
        userId: r.user?.id,
        userName: r.user?.nickname || 'Guest',
        profileImage: r.user?.profileImage,
        rating: r.rating,
        content: r.content,
        createdAt: r.createdAt,
        imageUrls: r.imageUrls || []
      }));

      return NextResponse.json({ reviews }, { status: 200 });
    }

    // Default: Empty for now
    return NextResponse.json({ reviews: [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/reviews - Remove a review (Owner or Admin)
export async function DELETE(request: NextRequest) {
  try {
    const verified = await verifyRequestToken(request.headers.get('authorization'));
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const requestUserId = verified.uid;

    const { searchParams } = new URL(request.url);
    const spiritId = searchParams.get('spiritId');
    const targetUserId = searchParams.get('userId');

    if (!spiritId || !targetUserId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Security: Only owner or admin can delete
    if (requestUserId !== targetUserId && !verified.isAdmin) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const existingReview = await dbAdminFindReview({ userId: targetUserId, spiritId });
    if (!existingReview?.id) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await dbAdminUpsertReview({
      id: existingReview.id,
      spiritId,
      userId: targetUserId,
      rating: 1,
      title: '',
      content: '[deleted]',
      nose: '',
      palate: '',
      finish: '',
      likes: 0,
      isPublished: false,
      imageUrls: [],
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
