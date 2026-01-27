import { NextRequest, NextResponse } from 'next/server';
import { newArrivalsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

// GET /api/new-arrivals - Get the cached top 10 new arrivals
export async function GET(request: NextRequest) {
  try {
    const spirits = await newArrivalsDb.getAll();
    
    return NextResponse.json({
      spirits,
      count: spirits.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json({
      error: 'Failed to fetch new arrivals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
