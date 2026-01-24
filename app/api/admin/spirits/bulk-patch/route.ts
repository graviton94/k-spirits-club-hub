import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

// PATCH /api/admin/spirits/bulk-patch
export async function PATCH(req: NextRequest) {
    try {
        const { spiritIds, updates } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        if (!updates || typeof updates !== 'object') {
            return NextResponse.json({ error: 'Missing updates object' }, { status: 400 });
        }

        let updatedCount = 0;
        for (const id of spiritIds) {
            // We reuse the updateSpirit method
            // Ideally this should be a transaction or a bulk DB operation
            try {
                await db.updateSpirit(id, updates);
                updatedCount++;
            } catch (e) {
                console.error(`Failed to update spirit ${id}`, e);
            }
        }

        return NextResponse.json({ success: true, updatedCount });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to bulk patch spirits', details: error.message }, { status: 500 });
    }
}
