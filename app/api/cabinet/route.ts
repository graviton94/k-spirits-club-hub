import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb, spiritsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 });
    }

    try {
        // 1. Get user's cabinet items
        const cabinetItems = await cabinetDb.getAll(userId);

        if (cabinetItems.length === 0) {
            return NextResponse.json({ data: [] });
        }

        // 2. Get master spirits data
        // cabinetItems should have 'id' which corresponds to spiritId
        const spiritIds = Array.from(new Set(cabinetItems.map((i: any) => i.id))).filter(Boolean);

        if (spiritIds.length === 0) {
            return NextResponse.json({ data: [] });
        }

        const masterSpirits = await spiritsDb.getByIds(spiritIds);

        // 3. Merge data
        // Flavor engine expects { ...Spirit, isWishlist, userReview }
        // cabinetItem should strictly contain user-specific overrides.
        // We prioritize cabinetItem fields (like isWishlist, userReview).

        const joined = cabinetItems.map((c: any) => {
            const master = masterSpirits.find(m => m.id === c.id);
            if (!master) {
                // If master spirit is missing (deleted?), we might skip or return partial.
                // For safety, we skip.
                return null;
            }
            return {
                ...master,
                ...c, // user overrides
            };
        }).filter(Boolean);

        return NextResponse.json({ data: joined });
    } catch (error) {
        console.error('Cabinet GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch cabinet' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing Spirit ID' }, { status: 400 });
        }

        // We only save user-specific data to cabinet. 
        // We shouldn't duplicate all Spirit fields if possible, 
        // BUT current Frontend treats the object as a whole.
        // For simplicity, we save the object as provided by frontend (which is merged).
        // Optimally, we should only save { isWishlist, userReview, id }.
        // However, saving full object is safer for offline-first architecture if we switch later,
        // but bad for sync.
        // Let's sanitize to save only user-context fields to keep DB clean?
        // User fields: isWishlist, userReview, maybe rating/notes if we added them.

        const userFields = {
            id,
            isWishlist: data.isWishlist ?? false,
            userReview: data.userReview || null,
            addedAt: new Date().toISOString()
        };

        await cabinetDb.upsert(userId, id, userFields);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cabinet POST Error:', error);
        return NextResponse.json({ error: 'Failed to update cabinet' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    try {
        await cabinetDb.delete(userId, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cabinet DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
