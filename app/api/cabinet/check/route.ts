import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    const { searchParams } = new URL(req.url);
    const spiritId = searchParams.get('spiritId');

    if (!userId || !spiritId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const item = await cabinetDb.getById(userId, spiritId);
        if (!item) {
            return NextResponse.json({ isOwned: false, isWishlist: false });
        }

        return NextResponse.json({
            isOwned: !item.isWishlist,
            isWishlist: !!item.isWishlist,
            data: item
        });
    } catch (error) {
        console.error('Cabinet Check Error:', error);
        return NextResponse.json({ error: 'Failed to check cabinet' }, { status: 500 });
    }
}
