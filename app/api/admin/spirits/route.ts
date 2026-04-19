import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { dbAdminListRawSpirits, dbUpsertSpirit } from '@/lib/db/data-connect-client';


// export const runtime = 'edge';

// GET /api/admin/spirits?category=...&distillery=...&isPublished=...&search=...
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const distillery = searchParams.get('distillery') || undefined;
    const isPublishedParam = searchParams.get('isPublished');
    const search = searchParams.get('search') || undefined;
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const offset = (page - 1) * pageSize;

    try {
        const isPublished = isPublishedParam === 'ALL' ? undefined : (isPublishedParam === 'true');

        console.log('[API /api/admin/spirits] Fetching from SQL with:', { category, distillery, isPublished, search, offset });
        
        const spirits = await dbAdminListRawSpirits({
            limit: pageSize,
            offset,
            category: category === 'ALL' ? undefined : category,
            distillery: distillery === 'ALL' ? undefined : distillery,
            isPublished,
            search
        });

        return NextResponse.json({
            data: spirits,
            total: 13000, // Estimated or static for now
            page,
            pageSize
        });
    } catch (error: any) {
        console.error('[API /api/admin/spirits] SQL Error:', error);
        return NextResponse.json({ error: 'Failed to fetch spirits from SQL', details: error.message }, { status: 500 });
    }
}

// POST /api/admin/spirits (Create New Spirit in SQL)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.category) {
            return NextResponse.json({ error: 'Name and Category are required.' }, { status: 400 });
        }

        const now = new Date().toISOString();
        const nextId = `kspt-${Math.random().toString(36).substring(2, 10)}`; // Temporary ID generation for SQL

        const newSpirit = {
            id: nextId,
            name: body.name,
            nameEn: body.nameEn || null,
            abv: parseFloat(body.abv) || 0,
            volume: Number(body.volume) || 700,
            category: body.category,
            subcategory: body.subcategory || null,
            country: body.country || null,
            region: body.region || null,
            distillery: body.distillery || null,
            bottler: body.bottler || null,
            imageUrl: body.imageUrl || '/icons/bottle-fallback.png',
            thumbnailUrl: body.thumbnailUrl || body.imageUrl || null,
            descriptionKo: body.descriptionKo || null,
            descriptionEn: body.descriptionEn || null,
            pairingGuideKo: body.pairingGuideKo || null,
            pairingGuideEn: body.pairingGuideEn || null,
            noseTags: body.noseTags || [],
            palateTags: body.palateTags || [],
            finishTags: body.finishTags || [],
            status: body.isPublished ? 'PUBLISHED' : 'RAW',
            isPublished: body.isPublished || false,
            isReviewed: body.isPublished || false,
            updatedAt: now,
            createdAt: now
        };

        await dbUpsertSpirit(newSpirit);
        
        revalidatePath('/[lang]/admin/spirits', 'page');
        revalidateTag('spirits');

        return NextResponse.json({ success: true, id: nextId, spirit: newSpirit }, { status: 201 });

    } catch (error: any) {
        console.error('[API POST /api/admin/spirits] SQL Error:', error);
        return NextResponse.json({ error: 'Failed to create spirit in SQL', details: error.message }, { status: 500 });
    }
}
