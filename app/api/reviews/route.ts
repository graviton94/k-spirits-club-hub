import { NextRequest, NextResponse } from 'next/server';
import { reviewsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { spiritId, spiritName, imageUrl, imageUrls, rating, noseRating, palateRating, finishRating, content, nose, palate, finish, userName } = body;

    // Validate required fields
    if (!spiritId || !spiritName || rating === undefined || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create review document
    const reviewData = {
      spiritId,
      spiritName,
      imageUrl: imageUrl || '',
      imageUrls: imageUrls || [],
      userId,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      ratingN: noseRating ? Number(noseRating) : Number(rating),
      ratingP: palateRating ? Number(palateRating) : Number(rating),
      ratingF: finishRating ? Number(finishRating) : Number(rating),
      notes: content,
      tagsN: nose || '',
      tagsP: palate || '',
      tagsF: finish || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true
    };

    // Save to public reviews using reviewsDb
    await reviewsDb.upsert(spiritId, userId, reviewData);

    // Log 'review' event for trending stats
    const { trendingDb } = await import('@/lib/db/firestore-rest');
    await trendingDb.logEvent(spiritId, 'review');

    return NextResponse.json({
      success: true,
      id: `${spiritId}_${userId}`,
      message: 'Review created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({
      error: 'Failed to create review',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spiritId = searchParams.get('spiritId');
    const userId = searchParams.get('userId');
    const mode = searchParams.get('mode');

    if (mode === 'recent') {
      const allRecent = await reviewsDb.getRecent();
      // Only return the top 3 to the frontend (even if we store more)
      const reviews = allRecent.slice(0, 3);

      return NextResponse.json({
        reviews: reviews.map(r => ({
          id: `${r.spiritId}_${r.userId}`,
          ...r,
          noseRating: r.ratingN,
          palateRating: r.ratingP,
          finishRating: r.ratingF,
          content: r.notes,
          nose: r.tagsN,
          palate: r.tagsP,
          finish: r.tagsF,
          imageUrls: r.imageUrls || []
        }))
      }, { status: 200 });
    }

    if (spiritId) {
      // Get reviews for a specific spirit
      const reviews = await reviewsDb.getAllForSpirit(spiritId);

      return NextResponse.json({
        reviews: reviews.map(r => ({
          id: `${r.spiritId}_${r.userId}`,
          ...r,
          // Map REST API fields to expected frontend fields
          noseRating: r.ratingN,
          palateRating: r.ratingP,
          finishRating: r.ratingF,
          content: r.notes,
          nose: r.tagsN,
          palate: r.tagsP,
          finish: r.tagsF,
          imageUrls: r.imageUrls || []
        }))
      }, { status: 200 });
    }

    if (userId) {
      // Get reviews by a specific user
      const reviews = await reviewsDb.getAllForUser(userId);

      return NextResponse.json({
        reviews: reviews.map(r => ({
          id: `${r.spiritId}_${r.userId}`,
          ...r,
          // Map REST API fields to expected frontend fields
          noseRating: r.ratingN,
          palateRating: r.ratingP,
          finishRating: r.ratingF,
          content: r.notes,
          nose: r.tagsN,
          palate: r.tagsP,
          finish: r.tagsF,
          imageUrls: r.imageUrls || []
        }))
      }, { status: 200 });
    }

    // If no filters, return empty array (could implement getAll if needed)
    return NextResponse.json({ reviews: [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
// DELETE /api/reviews - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const requestUserId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const spiritId = searchParams.get('spiritId');
    const targetUserId = searchParams.get('userId'); // The owner of the review

    if (!requestUserId || !spiritId || !targetUserId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Permission Check
    let hasPermission = false;

    // Check if requester is the owner
    if (requestUserId === targetUserId) {
      hasPermission = true;
    } else {
      // Check if requester is an admin
      const { getServiceAccountToken } = await import('@/lib/auth/service-account');
      const token = await getServiceAccountToken();
      const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
      const userUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${requestUserId}`;

      const userRes = await fetch(userUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const role = userData.fields?.role?.stringValue;
        if (role === 'ADMIN') {
          hasPermission = true;
        }
      }
    }

    if (!hasPermission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Perform deletion in all 3 locations via reviewsDb
    await reviewsDb.delete(spiritId, targetUserId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({
      error: 'Failed to delete review',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
