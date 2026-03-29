import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { db, spiritsDb } from '@/lib/db';
import { newArrivalsDb } from '@/lib/db/firestore-rest';
import { SpiritStatus } from '@/lib/db/schema';
import { generateSpiritSearchKeywords } from '@/lib/utils/search-keywords';

export const runtime = 'edge';

// GET /api/admin/spirits?category=...&distillery=...&isPublished=...
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const distillery = searchParams.get('distillery');
    const isPublished = searchParams.get('isPublished');
    const searchTerm = searchParams.get('search');

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    try {
        const filter: any = {};

        // Category filter
        if (category && category !== 'ALL') filter.category = category;

        // Distillery filter
        if (distillery && distillery !== 'ALL') filter.distillery = distillery;

        // isPublished filter - admin can filter by published status
        if (isPublished !== null && isPublished !== undefined && isPublished !== 'ALL') {
            filter.isPublished = isPublished === 'true';
        }

        // SearchTerm filter
        if (searchTerm) filter.searchTerm = searchTerm;

        console.log('[API /api/admin/spirits] Fetching with filter:', JSON.stringify(filter));
        const spirits = await db.getSpirits(filter, { page, pageSize });
        console.log(`[API /api/admin/spirits] Returned ${spirits.data.length} spirits (Total: ${spirits.total}, Page: ${page}/${spirits.totalPages})`);

        // Add diagnostic info for zero results
        if (spirits.total === 0) {
            console.warn('[API /api/admin/spirits] ⚠️ ZERO RESULTS WARNING');
            console.warn('Filter applied:', JSON.stringify(filter));
            console.warn('This may indicate:');
            console.warn('  1. Database is empty');
            console.warn('  2. All spirits filtered out by the applied filter');
            console.warn('  3. Firestore query error (check previous logs)');
        }

        return NextResponse.json(spirits);
    } catch (error: any) {
        console.error('[API /api/admin/spirits] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch spirits', details: error.message }, { status: 500 });
    }
}

function parseTags(value: string | string[]): string[] {
    if (Array.isArray(value)) return value.filter(Boolean).map(t => t.trim());
    return (value || '').split(',').filter(Boolean).map(t => t.trim());
}

// POST /api/admin/spirits (Create New Spirit)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.category) {
            return NextResponse.json({ error: '제품명(name)과 카테고리(category)는 필수입니다.' }, { status: 400 });
        }

        // Generate next sequential ID in kspt-XXXXXXXX format
        const allIds = await spiritsDb.listAllIds();
        const ksptPattern = /^kspt-(\d{8})$/;
        const maxNum = Math.max(
            0,
            ...allIds
                .map(id => id.match(ksptPattern)?.[1])
                .filter((n): n is string => n !== undefined)
                .map(n => parseInt(n, 10))
        );
        const nextId = `kspt-${String(maxNum + 1).padStart(8, '0')}`;

        const now = new Date().toISOString();
        const spiritForKeywords = {
            name: body.name,
            name_en: body.name_en || null,
            distillery: body.distillery || null,
            metadata: {
                name_en: body.name_en || null,
            }
        };

        const isPublished = body.isPublished === true;
        const newSpirit = {
            id: nextId,
            name: body.name,
            name_en: body.name_en || null,
            abv: parseFloat(body.abv) || 0,
            volume: Number(body.volume) || 700,
            category: body.category,
            subcategory: body.subcategory || null,
            country: body.country || null,
            region: body.region || null,
            distillery: body.distillery || null,
            bottler: body.bottler || null,
            imageUrl: body.imageUrl || null,
            thumbnailUrl: body.imageUrl || null,
            mainCategory: null,
            tasting_note: body.tasting_note || null,
            nose_tags: parseTags(body.nose_tags),
            palate_tags: parseTags(body.palate_tags),
            finish_tags: parseTags(body.finish_tags),
            metadata: {
                description_ko: body.description_ko || null,
                description_en: body.description_en || null,
                pairing_guide_ko: body.pairing_guide_ko || null,
                pairing_guide_en: body.pairing_guide_en || null,
            },
            source: 'manual' as const,
            externalId: null,
            status: (isPublished ? 'PUBLISHED' : 'RAW') as SpiritStatus,
            isPublished: isPublished,
            isReviewed: isPublished,
            reviewedBy: isPublished ? 'ADMIN' : null,
            reviewedAt: isPublished ? now : null,
            searchKeywords: generateSpiritSearchKeywords(spiritForKeywords),
            createdAt: now,
            updatedAt: now,
        };

        await spiritsDb.upsert(nextId, newSpirit as any);

        // If published, sync the new arrivals cache immediately
        if (isPublished) {
            try {
                await newArrivalsDb.syncCache();
            } catch (error) {
                console.error('[API POST /api/admin/spirits] Cache sync failed:', error);
            }
        }

        return NextResponse.json({ success: true, id: nextId, spirit: newSpirit }, { status: 201 });

    } catch (error: any) {
        console.error('[API POST /api/admin/spirits] Error:', error);
        return NextResponse.json({ error: '새 제품 등록 실패', details: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/spirits (Bulk Delete)
export async function DELETE(req: NextRequest) {
    try {
        const { spiritIds } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        let deletedCount = 0;
        for (const id of spiritIds) {
            const success = await db.deleteSpirit(id);
            if (success) deletedCount++;
        }

        if (deletedCount > 0) {
            revalidateTag('related-spirits');
        }

        return NextResponse.json({ success: true, deletedCount });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete spirits', details: error.message }, { status: 500 });
    }
}
