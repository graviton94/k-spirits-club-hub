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
    const { spiritId, spiritName, rating, noseRating, palateRating, finishRating, content, nose, palate, finish, userName } = body;

    // Validate required fields
    if (!spiritId || !spiritName || rating === undefined || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create review document
    const reviewData = {
      spiritId,
      spiritName,
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
          finish: r.tagsF
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
          finish: r.tagsF
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
