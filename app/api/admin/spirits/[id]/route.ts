import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { dbGetSpirit, dbUpsertSpirit, dbDeleteSpirit } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

// GET /api/admin/spirits/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const spirit = await dbGetSpirit(id);

        if (!spirit) {
            return NextResponse.json({ error: 'Spirit not found in SQL' }, { status: 404 });
        }

        return NextResponse.json(spirit);
    } catch (error: any) {
        const { id } = await params;
        console.error(`API Get Error for ${id}:`, error);
        return NextResponse.json({ error: 'Failed to get spirit from SQL', details: error.message }, { status: 500 });
    }
}

// PATCH /api/admin/spirits/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // Validate if spirit exists
        const spirit = await dbGetSpirit(id);
        if (!spirit) {
            return NextResponse.json({ error: 'Spirit not found in SQL' }, { status: 404 });
        }

        // Update spirit in SQL (Upsert acts as update if ID exists)
        await dbUpsertSpirit({ ...spirit, ...body, id });

        // Invalidate caching
        revalidatePath('/[lang]/admin/spirits', 'page');
        revalidatePath(`/[lang]/spirits/${id}`, 'page');
        revalidateTag('spirits');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const { id } = await params;
        console.error(`API Update Error for ${id}:`, error);
        return NextResponse.json({ error: 'Failed to update spirit in SQL', details: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/spirits/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await dbDeleteSpirit(id);

        // Invalidate caching
        revalidatePath('/[lang]/admin/spirits', 'page');
        revalidateTag('spirits');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const { id } = await params;
        console.error(`API Delete Error for ${id}:`, error);
        return NextResponse.json({ error: 'Failed to delete spirit from SQL', details: error.message }, { status: 500 });
    }
}
