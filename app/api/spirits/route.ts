import { NextRequest, NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/firestore-rest';
import { Spirit, SpiritSearchIndex } from '@/lib/db/schema';

// Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data
 * Returns both full spirits array and minimized search index
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/spirits - Fetching published spirits...');

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
      en: s.name_en || s.metadata?.name_en || null,
      c: s.category || '기타',
      mc: s.mainCategory || null,
      sc: s.subcategory || null,
      t: s.thumbnailUrl || s.imageUrl || null // Thumbnail fallback to imageUrl
    }));

    // Limit published spirits to 100 items (consistent with original implementation)
    const limitedSpirits = spirits.slice(0, 100);

    console.log(`[API] ✅ Successfully fetched ${limitedSpirits.length} spirits, ${searchIndex.length} in search index`);

    return NextResponse.json({
      publishedSpirits: limitedSpirits as Spirit[],
      searchIndex,
      count: searchIndex.length,
      timestamp: Date.now()
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
