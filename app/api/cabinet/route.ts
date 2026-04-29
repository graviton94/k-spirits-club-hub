// app/api/cabinet/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListUserCabinet, dbAdminUpsertCabinet, dbAdminDeleteCabinet } from '@/lib/db/data-connect-admin';
import { verifyRequestToken } from '@/lib/auth/verifyToken';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const verified = await verifyRequestToken(req.headers.get('authorization'));
    if (!verified) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = verified.uid;

    try {
        const cabinetItems = await dbAdminListUserCabinet(userId);
        
        // Map to flat structure for backward compatibility
        const joined = cabinetItems.map((item: any) => ({
            ...item.spirit,
            ...item,
            id: item.spiritId
        }));

        return NextResponse.json({ data: joined });
    } catch (error) {
        console.error('Cabinet GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch cabinet' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const verified = await verifyRequestToken(req.headers.get('authorization'));
    if (!verified) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = verified.uid;

    try {
        const body = await req.json();
        const { id, isWishlist, userReview } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing Spirit ID' }, { status: 400 });
        }

        await dbAdminUpsertCabinet({
            userId,
            spiritId: id,
            notes: userReview?.comment || '',
            rating: userReview?.ratingOverall || 0,
            isFavorite: false,
            isWishlist: !!isWishlist,
            addedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cabinet POST Error:', error);
        return NextResponse.json({ error: 'Failed to update cabinet' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const verified = await verifyRequestToken(req.headers.get('authorization'));
    if (!verified) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = verified.uid;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    try {
        await dbAdminDeleteCabinet({ userId, spiritId: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cabinet DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
