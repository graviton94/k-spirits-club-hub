import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SpiritStatus } from '@/lib/db/schema';

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
        if (status && status !== 'ALL') filter.status = status as SpiritStatus;
        if (category && category !== 'ALL') filter.category = category;
        if (subcategory && subcategory !== 'ALL') filter.subcategory = subcategory;

        const spirits = await db.getSpirits(filter, { page, pageSize });
        console.log(`[API] Admin fetch returned ${spirits.data.length} spirits (Total: ${spirits.total})`);
        return NextResponse.json(spirits);
    } catch (error: any) {
        // Log error to a file for debugging in the absence of terminal access
        try {
            const fs = require('fs');
            fs.appendFileSync('api-error.log', `[${new Date().toISOString()}] GET Spirits Error: ${error.message}\n${error.stack}\n`);
        } catch (e) { }

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
