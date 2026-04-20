// app/api/new-arrivals/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListNewArrivals } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

// GET /api/new-arrivals - Get the top 10 new arrivals from PostgreSQL
export async function GET(request: NextRequest) {
  try {
    const spirits = await dbListNewArrivals(10);
    
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
