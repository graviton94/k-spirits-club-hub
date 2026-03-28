import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';

export const runtime = 'edge';

// GET /api/admin/spirits/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const spirit = await db.getSpirit(id);

        if (!spirit) {
            return NextResponse.json({ error: 'Spirit not found' }, { status: 404 });
        }

        return NextResponse.json(spirit);
    } catch (error) {
        console.error(`API Get Error for ${(await params).id}:`, error);
        return NextResponse.json({ error: 'Failed to get spirit' }, { status: 500 });
    }
}

// PATCH /api/admin/spirits/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Validate if spirit exists
        const spirit = await db.getSpirit(id);
        if (!spirit) {
            return NextResponse.json({ error: 'Spirit not found' }, { status: 404 });
        }

        // Update spirit in DB
        const updated = await db.updateSpirit(id, body);

        // Invalidate caching for related spirits
        revalidateTag('related-spirits');

        return NextResponse.json(updated);
    } catch (error) {
        const { id } = await params;
        console.error(`API Update Error for ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update spirit' }, { status: 500 });
    }
}

// DELETE /api/admin/spirits/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const success = await db.deleteSpirit(id);

        if (!success) {
            return NextResponse.json({ error: 'Spirit not found' }, { status: 404 });
        }

        // Invalidate caching for related spirits
        revalidateTag('related-spirits');

        return NextResponse.json({ success: true });
    } catch (error) {
        const { id } = await params;
        console.error(`API Delete Error for ${id}:`, error);
        return NextResponse.json({ error: 'Failed to delete spirit' }, { status: 500 });
    }
}
