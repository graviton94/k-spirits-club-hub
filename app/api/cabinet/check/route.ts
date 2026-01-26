
import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb } from '@/lib/db/firestore-rest';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('uid');
    const spiritId = searchParams.get('sid');

    if (!userId || !spiritId) {
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 400 });
    }

    try {
        const item = await cabinetDb.getById(userId, spiritId);

        if (!item) {
            return NextResponse.json({ isOwned: false, isWishlist: false, data: null });
        }

        return NextResponse.json({
            isOwned: !item.isWishlist,
            isWishlist: item.isWishlist === true,
            data: item
        });
    } catch (error) {
        console.error('Error checking cabinet status:', error);
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 500 });
    }
}
