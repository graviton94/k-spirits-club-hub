import { NextRequest, NextResponse } from 'next/server';
import { reviewsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

// GET /api/users/stats - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await reviewsDb.getUserStats(userId);

    return NextResponse.json({
      reviewCount: stats.reviewCount,
      totalLikes: stats.totalLikes
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch user stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
