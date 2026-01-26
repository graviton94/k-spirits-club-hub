
import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb, spiritsDb } from '@/lib/db/firestore-rest';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('uid');
    const spiritId = searchParams.get('sid');

    if (!userId || !spiritId) {
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 400 });
    }

    try {
        // Parallel Fetch: Cabinet Status & Master Data
        const [cabinetItem, masterItem] = await Promise.all([
            cabinetDb.getById(userId, spiritId),
            spiritsDb.getById(spiritId).catch(() => null) // Allow master fetch fail (e.g. custom user item?)
        ]);

        if (!cabinetItem) {
            return NextResponse.json({ isOwned: false, isWishlist: false, data: null });
        }

        // Merge: Master Data (Base) + Cabinet Snapshot (Overlay)
        // Cabinet snapshot fields (like custom name/image) should take precedence if they differ? 
        // Actually, usually Master > Snapshot for static fields, but Snapshot > Master for user fields.
        // Let's do { ...masterItem, ...cabinetItem } to let cabinet properties override (e.g. if we allow editing)
        // But for things like metadata tags, they are only in master.
        const mergedData = {
            ...(masterItem || {}),
            ...cabinetItem,
        };

        return NextResponse.json({
            isOwned: !cabinetItem.isWishlist,
            isWishlist: cabinetItem.isWishlist === true,
            data: mergedData
        });
    } catch (error) {
        console.error('Error checking cabinet status:', error);
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 500 });
    }
}
