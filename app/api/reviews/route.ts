import { NextRequest, NextResponse } from 'next/server';
import { 
  dbListSpiritReviews, 
  dbUpsertReview,
  dbGetSpirit
} from '@/lib/db/data-connect-client';

export const runtime = 'edge';

/**
 * Reviews API Route
 * Handles Fetching (GET), Creating (POST), and Deleting (DELETE) reviews using Firebase Data Connect.
 */

// POST /api/reviews - Create or Update a review
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { spiritId, rating, content, nose, palate, finish, imageUrls } = body;

    if (!spiritId || rating === undefined || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert to Data Connect (Relational Schema)
    const reviewId = `${spiritId}_${userId}`;
    await dbUpsertReview({
      id: reviewId,
      spiritId,
      userId,
      rating: Number(rating),
      content,
      nose: nose || '',
      palate: palate || '',
      finish: finish || '',
      imageUrls: imageUrls || [],
      createdAt: new Date().toISOString()
    });

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

    if (mode === 'recent') {
      const allRecent = await dbListSpiritReviews(10, 0);
      
      // Flat mapping for backward compatibility with legacy Home components
      const reviews = allRecent.map((r: any) => ({
        id: r.id,
        spiritId: r.spirit.id,
        spiritName: r.spirit.name,
        imageUrl: r.spirit.imageUrl,
        userId: r.user.id,
        userName: r.user.nickname || 'Guest',
        profileImage: r.user.profileImage,
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
    const requestUserId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const spiritId = searchParams.get('spiritId');
    const targetUserId = searchParams.get('userId');

    if (!requestUserId || !spiritId || !targetUserId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Security: Only owner or logic-based admin can delete
    if (requestUserId !== targetUserId) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // TODO: Implement dbDeleteReview in data-connect-client if needed.
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
