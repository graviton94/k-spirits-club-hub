// app/api/spirits/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbAdminSearchSpiritsPublic, dbAdminListAllCategories, dbAdminListAllSubcategories, dbAdminListAllDistilleries } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';

/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data from PostgreSQL
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'search';

    // 3. Handle Index Mode (lightweight search index for client-side Fuse.js)
    if (mode === 'index') {
      // Fetches up to 500 spirits for the client-side search index.
      // This covers typical catalog sizes; increase if the catalog grows beyond 500 entries.
      const spirits = await dbAdminSearchSpiritsPublic({ limit: 500 });
      const searchIndex = (spirits || [])
        .filter((s: any) => s.id && String(s.id).toLowerCase() !== 'undefined')
        .map((s: any) => ({
          i: s.id,
          n: s.name || '이름 없음',
          en: s.nameEn || null,
          c: s.category || '기타',
          ce: s.categoryEn || null,
          mc: s.mainCategory || null,
          sc: s.subcategory || null,
          t: s.imageUrl || null,
          a: s.abv || 0,
          v: s.volume || null,
          d: s.distillery || null,
          b: s.bottler || null,
          co: s.country || null,
          re: s.region || null,
          tn: s.tastingNote || null,
        }));
      return NextResponse.json(
        { searchIndex, timestamp: Date.now() },
        {
          status: 200,
          // Cache for 15 minutes (spirits catalog is relatively stable)
          headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' },
        }
      );
    }

    // 1. Handle Metadata Mode (Dynamic Dropdowns)
    if (mode === 'meta') {
      const category = searchParams.get('category') || undefined;
      const categoryEn = searchParams.get('categoryEn') || undefined;
      const subcategory = searchParams.get('subcategory') || undefined;
      const distilleryMode = searchParams.get('distilleryMode') === '1';

      if (distilleryMode) {
        const distilleries = await dbAdminListAllDistilleries({ category, categoryEn, subcategory });
        return NextResponse.json({ distilleries }, { status: 200 });
      }
      
      if (category || categoryEn) {
        const subcategories = await dbAdminListAllSubcategories(category, categoryEn);
        return NextResponse.json({ subcategories }, { status: 200 });
      }

      const categories = await dbAdminListAllCategories();
      return NextResponse.json({ categories }, { status: 200 });
    }

    // 2. Handle Search Mode (Paginated Search)
    const category = searchParams.get('category') || undefined;
    const categoryEn = searchParams.get('categoryEn') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const distillery = searchParams.get('distillery') || undefined;
    const searchTerm = searchParams.get('searchTerm') || searchParams.get('q') || undefined;
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = parseInt(searchParams.get('offset') || '0');

    const spirits = await dbAdminSearchSpiritsPublic({
      category: category === 'ALL' || !category || category === '' ? undefined : category,
      categoryEn: !categoryEn || categoryEn === '' ? undefined : categoryEn,
      subcategory: !subcategory || subcategory === '' ? undefined : subcategory,
      distillery: !distillery || distillery === '' ? undefined : distillery,
      search: searchTerm,
      limit,
      offset
    });

    const validSpirits = (spirits || []).filter((s: any) => s.id && String(s.id).toLowerCase() !== 'undefined');

    if (!validSpirits || validSpirits.length === 0) {
      return NextResponse.json({
        spirits: [],
        count: 0,
        hasMore: false,
        timestamp: Date.now()
      }, { status: 200 });
    }

    const mappedSpirits = validSpirits.map((s: any) => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      ce: s.categoryEn || null,
      sc: s.subcategory || null,
      t: s.imageUrl || null,
      a: s.abv || 0,
      v: s.volume || null,
      d: s.distillery || null,
      b: s.bottler || null,
      co: s.country || null,
      re: s.region || null,
      nt: s.noseTags || [],
      pt: s.palateTags || [],
      ft: s.finishTags || [],
      tn: s.tastingNote || null,
      r: s.rating || 0,
      rc: s.reviewCount || 0,
      m: s.metadata || {},
      mc: s.mainCategory || null,
      h: Boolean(
        (s.tastingNote && s.tastingNote.trim()) ||
        (s.noseTags?.filter(Boolean)?.length || 0) > 0 ||
        (s.palateTags?.filter(Boolean)?.length || 0) > 0 ||
        (s.finishTags?.filter(Boolean)?.length || 0) > 0
      ),
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
