// app/api/spirits/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListSpirits } from '@/lib/db/data-connect-client';

// Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data from PostgreSQL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'full';

    // Extract filters
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const country = searchParams.get('country') || undefined;
    const searchTerm = searchParams.get('searchTerm') || searchParams.get('q') || undefined;

    // Fetch matching spirits from Data Connect
    const spirits = await dbListSpirits({
      category,
      subcategory,
      country
    });

    if (!spirits || spirits.length === 0) {
      return NextResponse.json({
        publishedSpirits: [],
        searchIndex: [],
        count: 0,
        timestamp: Date.now()
      }, { status: 200 });
    }

    // Apply server-side search filtering if searchTerm is provided
    let filteredResults = spirits;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredResults = spirits.filter((s: any) =>
        (s.name && s.name.toLowerCase().includes(lowerSearch)) ||
        (s.nameEn && s.nameEn.toLowerCase().includes(lowerSearch)) ||
        (s.distillery && s.distillery.toLowerCase().includes(lowerSearch)) ||
        (s.category && s.category.toLowerCase().includes(lowerSearch))
      );
    }

    // Create minimized search index for instant client-side search
    const searchIndex = filteredResults.map((s: any) => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      sc: s.subcategory || null,
      t: s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null,
      tn: s.tastingNote || null,
    }));

    if (mode === 'index') {
      return NextResponse.json({
        searchIndex,
        count: searchIndex.length,
        timestamp: Date.now()
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      });
    }

    // MODE: FULL
    const limitedSpirits = filteredResults.slice(0, 100);

    return NextResponse.json({
      publishedSpirits: limitedSpirits,
      searchIndex,
      count: searchIndex.length,
      timestamp: Date.now()
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });

  } catch (error) {
    console.error('[API] ❌ Error fetching spirits:', error);

    return NextResponse.json({
      error: 'Failed to fetch spirits data',
      publishedSpirits: [],
      searchIndex: [],
      count: 0,
      timestamp: Date.now()
    }, { status: 500 });
  }
}
