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
 * - mode=index: Returns only lightweight search index (optimized for listing)
 * - mode=full (default): Returns both full spirits and search index
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'full';
    
    console.log(`[API] GET /api/spirits?mode=${mode} - Fetching published spirits...`);

    // Fetch all published spirits from Firestore
    const spirits = await spiritsDb.getAll({ isPublished: true });

    if (!spirits || spirits.length === 0) {
      console.warn('[API] No published spirits found');
      return NextResponse.json({
        publishedSpirits: [],
        searchIndex: [],
        count: 0,
        timestamp: Date.now()
      }, { status: 200 });
    }

    // Create minimized search index for client-side filtering
    const searchIndex: SpiritSearchIndex[] = spirits.map(s => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.metadata?.name_en || null,
      c: s.category || '기타',
      mc: s.mainCategory || null,
      sc: s.subcategory || null,
      t: s.thumbnailUrl || s.imageUrl || null, // Thumbnail fallback to imageUrl
      a: s.abv || 0, // ABV for display
      d: s.distillery || null, // distillery
      cre: s.createdAt ? (typeof s.createdAt === 'string' ? s.createdAt : s.createdAt.toISOString()) : null, // createdAt for sorting by registration date
      m: s.metadata ? {
        tasting_note: s.metadata.tasting_note
          ? s.metadata.tasting_note.split(',').slice(0, 2).join(',') // Only first 2 tags
          : null
      } : {}
    }));

    // Calculate data sizes for optimization tracking
    const indexSize = JSON.stringify(searchIndex).length;
    const indexSizeKB = (indexSize / 1024).toFixed(2);

    // MODE: INDEX - Return only lightweight index
    if (mode === 'index') {
      console.log(`[OPTIMIZATION] Index-only mode: ${indexSizeKB} KB for ${searchIndex.length} items`);
      
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

    // MODE: FULL - Return both full data and index (backward compatible)
    // Limit published spirits to 100 items (consistent with original implementation)
    const limitedSpirits = spirits.slice(0, 100);
    const fullSize = JSON.stringify(limitedSpirits).length;
    const fullSizeKB = (fullSize / 1024).toFixed(2);

    console.log(`[OPTIMIZATION] Full mode: Index=${indexSizeKB} KB, Full Data=${fullSizeKB} KB`);
    console.log(`[API] ✅ Successfully fetched ${limitedSpirits.length} spirits, ${searchIndex.length} in search index`);

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
