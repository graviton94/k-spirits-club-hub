import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAppPath } from '@/lib/db/paths';

export const runtime = 'edge';

// Helper to safely get reviews path
function getReviewsPathSafe() {
  try {
    return getAppPath().reviews;
  } catch (e) {
    console.warn('getAppPath failed, using fallback path');
    return `artifacts/k-spirits-club-hub/public/data/reviews`;
  }
}

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
      noseRating: noseRating ? Number(noseRating) : Number(rating),
      palateRating: palateRating ? Number(palateRating) : Number(rating),
      finishRating: finishRating ? Number(finishRating) : Number(rating),
      content,
      nose: nose || null,
      palate: palate || null,
      finish: finish || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isPublished: true
    };

    const reviewsRef = collection(db, getAppPath().reviews);
    const docRef = await addDoc(reviewsRef, reviewData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
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

// GET /api/reviews - Get recent reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spiritId = searchParams.get('spiritId');
    const limitCount = parseInt(searchParams.get('limit') || '10');

    const reviewsRef = collection(db, getAppPath().reviews);
    let q;

    if (spiritId) {
      // Get reviews for a specific spirit
      q = query(
        reviewsRef,
        where('spiritId', '==', spiritId),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else {
      // Get recent reviews across all spirits
      q = query(
        reviewsRef,
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
