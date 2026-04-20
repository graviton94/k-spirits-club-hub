// app/api/users/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbGetUserProfile } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

// GET /api/users/stats - Get user statistics from PostgreSQL
export async function GET(request: NextRequest) {
  try {
    // Note: In production, userId should come from a secure session/header
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await dbGetUserProfile(userId);

    if (!profile) {
       return NextResponse.json({
        reviewCount: 0,
        totalLikes: 0
      }, { status: 200 });
    }

    return NextResponse.json({
      reviewCount: profile.reviewsWritten || 0,
      totalLikes: profile.heartsReceived || 0
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch user stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
