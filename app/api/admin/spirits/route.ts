import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SpiritStatus } from '@/lib/db/schema';

export const runtime = 'edge';

// GET /api/admin/spirits?status=...
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    try {
        const filter: any = {};
        // CRITICAL FIX: Only apply status filter if explicitly provided and not 'ALL'
        // This ensures admin can see ALL spirits by default
        if (status && status !== 'ALL') {
            filter.status = status as SpiritStatus;
        }
        // Note: Admin should see ALL spirits regardless of isPublished flag
        // Do NOT add isPublished filter for admin view
        
        if (category && category !== 'ALL') filter.category = category;
        if (subcategory && subcategory !== 'ALL') filter.subcategory = subcategory;

        const search = searchParams.get('search');
        if (search) filter.searchTerm = search;

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

        return NextResponse.json({ success: true, deletedCount });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete spirits', details: error.message }, { status: 500 });
    }
}
