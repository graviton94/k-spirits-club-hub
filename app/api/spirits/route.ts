// app/api/spirits/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbSearchSpiritsPublic, dbListAllCategories, dbListAllSubcategories } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data from PostgreSQL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'search';

    // 1. Handle Metadata Mode (Dynamic Dropdowns)
    if (mode === 'meta') {
      const category = searchParams.get('category') || undefined;
      
      if (category) {
        // Fetch subcategories for a specific category
        const subcategories = await dbListAllSubcategories(category);
        return NextResponse.json({ subcategories }, { status: 200 });
      }

      // Fetch all unique categories
      const categories = await dbListAllCategories();
      return NextResponse.json({ categories }, { status: 200 });
    }

    // 2. Handle Search Mode (Paginated Search)
    // Extract parameters
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const searchTerm = searchParams.get('searchTerm') || searchParams.get('q') || undefined;
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch matching spirits from Data Connect
    const spirits = await dbSearchSpiritsPublic({
      category: category === 'ALL' || !category || category === '' ? undefined : category,
      subcategory: !subcategory || subcategory === '' ? undefined : subcategory,
      search: searchTerm,
      limit,
      offset
    });

    if (!spirits || spirits.length === 0) {
      return NextResponse.json({
        spirits: [],
        count: 0,
        hasMore: false,
        timestamp: Date.now()
      }, { status: 200 });
    }

    // Map to simplified search index format for the frontend
    const mappedSpirits = spirits.map((s: any) => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      sc: s.subcategory || null,
      t: s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null,
      r: s.rating || 0,
      rc: s.reviewCount || 0,
      m: s.metadata || {},
      mc: s.mainCategory || null,
      h: s.metadata?.hasTastingNotes ?? false,
      cre: s.createdAt,
    }));

    return NextResponse.json({
      spirits: mappedSpirits,
      count: mappedSpirits.length,
      hasMore: mappedSpirits.length === limit,
      timestamp: Date.now()
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      }
    });

  } catch (error) {
    console.error('[API] ❌ Error fetching spirits:', error);

    return NextResponse.json({
      error: 'Failed to fetch spirits data',
      spirits: [],
      count: 0,
      hasMore: false,
      timestamp: Date.now()
    }, { status: 500 });
  }
}
