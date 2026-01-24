import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

// PATCH /api/admin/spirits/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();

        // Validate if spirit exists
        const spirit = await db.getSpirit(id);
        if (!spirit) {
            return NextResponse.json({ error: 'Spirit not found' }, { status: 404 });
        }

        // Update spirit in DB
        const updated = await db.updateSpirit(id, body);

        return NextResponse.json(updated);
    } catch (error) {
        console.error(`API Update Error for ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to update spirit' }, { status: 500 });
    }
}

// DELETE /api/admin/spirits/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const success = await db.deleteSpirit(id);

        if (!success) {
            return NextResponse.json({ error: 'Spirit not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`API Delete Error for ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to delete spirit' }, { status: 500 });
    }
}
