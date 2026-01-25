import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

// POST /api/admin/spirits/bulk-delete
// We use POST because some clients/proxies don't support bodies in DELETE requests well,
// though standard DELETE is also fine if handled.
export async function POST(req: NextRequest) {
    try {
        const { spiritIds } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        let deletedCount = 0;
        for (const id of spiritIds) {
            try {
                const success = await db.deleteSpirit(id);
                if (success) deletedCount++;
            } catch (e) {
                console.error(`Failed to delete spirit ${id}`, e);
            }
        }

        return NextResponse.json({ success: true, deletedCount });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to bulk delete spirits', details: error.message }, { status: 500 });
    }
}
