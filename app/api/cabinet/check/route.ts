// app/api/cabinet/check/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListUserCabinet, dbAdminGetSpirit } from '@/lib/db/data-connect-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('uid');
    const spiritId = searchParams.get('sid');

    if (!userId || !spiritId) {
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 400 });
    }

    try {
        // Parallel Fetch: Cabinet Status & Master Data via Admin Data Connect
        const [cabinetItems, masterItem] = await Promise.all([
            dbAdminListUserCabinet(userId),
            dbAdminGetSpirit(spiritId).catch(() => null)
        ]);

        const cabinetItem = cabinetItems.find((i: any) => i.spiritId === spiritId);

        if (!cabinetItem) {
            return NextResponse.json({ isOwned: false, isWishlist: false, data: masterItem || null });
        }

        // Merge: Master Data (Base) + Cabinet Snapshot (Overlay)
        const spiritData = (masterItem || {}) as any;
        const mergedData = {
            ...spiritData,
            ...cabinetItem,
            id: spiritId,
            title: spiritData.name || 'Unknown Spirit',
            name: spiritData.name || 'Unknown Spirit',
            category: spiritData.category || 'Unknown',
            thumbnailUrl: spiritData.thumbnailUrl || spiritData.imageUrl || null
        };

        return NextResponse.json({
            isOwned: !cabinetItem.isWishlist,
            isWishlist: !!cabinetItem.isWishlist,
            data: mergedData
        });
    } catch (error) {
        console.error('Error checking cabinet status:', error);
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 500 });
    }
}
