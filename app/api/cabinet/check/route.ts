// app/api/cabinet/check/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListUserCabinet, dbGetSpirit } from '@/lib/db/data-connect-client';

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
        // Parallel Fetch: Cabinet Status & Master Data via Data Connect
        const [cabinetItems, masterItem] = await Promise.all([
            dbListUserCabinet(userId),
            dbGetSpirit(spiritId).catch(() => null)
        ]);

        const cabinetItem = cabinetItems.find((i: any) => i.spiritId === spiritId);

        if (!cabinetItem) {
            return NextResponse.json({ isOwned: false, isWishlist: false, data: null });
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
            isOwned: (cabinetItem.rating ?? 0) > 0,
            isWishlist: (cabinetItem.rating ?? 0) === 0,
            data: mergedData
        });
    } catch (error) {
        console.error('Error checking cabinet status:', error);
        return NextResponse.json({ isOwned: false, isWishlist: false, data: null }, { status: 500 });
    }
}
