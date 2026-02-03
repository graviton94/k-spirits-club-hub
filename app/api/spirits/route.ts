import { NextRequest, NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/firestore-rest';
import { Spirit, SpiritSearchIndex } from '@/lib/db/schema';

// Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data
 * 
 * Query Parameters:
 * - mode=index: Returns lightweight search index
 * - mode=full (default): Returns full spirits and search index
 * - q/searchTerm: Search term for server-side filtering
 * - category: Category filter
 * - subcategory: Subcategory filter
 * - country: Country filter
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

    console.log(`[API] GET /api/spirits?mode=${mode}&q=${searchTerm || ''} - Fetching spirits...`);

    // Fetch matching spirits from Firestore
    // spiritsDb.getAll handles category/subcategory/country at DB level if provided
    const spirits = await spiritsDb.getAll({
      isPublished: true,
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
      filteredResults = spirits.filter(s =>
        (s.name && s.name.toLowerCase().includes(lowerSearch)) ||
        (s.name_en && s.name_en.toLowerCase().includes(lowerSearch)) ||
        (s.metadata?.name_en && s.metadata.name_en.toLowerCase().includes(lowerSearch)) ||
        (s.distillery && s.distillery.toLowerCase().includes(lowerSearch)) ||
        (s.category && s.category.toLowerCase().includes(lowerSearch))
      );
    }

    // OPTIMIZATION: If no search filters are provided and we are in index mode, 
    // limit results to 100 items to reduce initial metadata payload.
    // This significantly reduces the first load size while still providing enough data for DailyPick/etc.
    const isInitialLoad = !searchTerm && !category && !subcategory && !country;
    if (isInitialLoad && mode === 'index') {
      filteredResults = filteredResults.slice(0, 100);
      console.log(`[OPTIMIZATION] Capping initial index to 100 items to reduce payload.`);
    }

    // Create minimized search index
    const searchIndex: SpiritSearchIndex[] = filteredResults.map(s => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.name_en || s.metadata?.name_en || null,
      c: s.category || '기타',
      mc: s.mainCategory || null,
      sc: s.subcategory || null,
      t: s.thumbnailUrl || s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null,
      cre: s.createdAt ? (typeof s.createdAt === 'string' ? s.createdAt : s.createdAt.toISOString()) : null,
      m: s.metadata ? {
        tasting_note: s.metadata.tasting_note
          ? s.metadata.tasting_note.split(',').slice(0, 2).join(',')
          : null
      } : {}
    }));

    const indexSize = JSON.stringify(searchIndex).length;
    const indexSizeKB = (indexSize / 1024).toFixed(2);

    if (mode === 'index') {
      console.log(`[OPTIMIZATION] Index-only mode: ${indexSizeKB} KB for ${searchIndex.length} items (Source: ${spirits.length})`);

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
    const fullSize = JSON.stringify(limitedSpirits).length;
    const fullSizeKB = (fullSize / 1024).toFixed(2);

    console.log(`[OPTIMIZATION] Full mode: Index=${indexSizeKB} KB, Full Data=${fullSizeKB} KB`);

    return NextResponse.json({
      publishedSpirits: limitedSpirits as Spirit[],
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
