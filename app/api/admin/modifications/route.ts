import { NextRequest, NextResponse } from 'next/server';
import { modificationDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

// GET /api/admin/modifications
export async function GET(req: NextRequest) {
    try {
        const requests = await modificationDb.getAll();
        return NextResponse.json({ data: requests });
    } catch (error: any) {
        console.error('[API /api/admin/modifications] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch modification requests', details: error.message }, { status: 500 });
    }
}

// PATCH /api/admin/modifications
export async function PATCH(req: NextRequest) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        if (!['pending', 'checked', 'resolved'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        await modificationDb.updateStatus(id, status);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API /api/admin/modifications] Error:', error);
        return NextResponse.json({ error: 'Failed to update modification request', details: error.message }, { status: 500 });
    }
}
