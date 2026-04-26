// app/api/cabinet/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListUserCabinet, dbUpsertCabinet, dbDeleteCabinet } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 });
    }

    try {
        const cabinetItems = await dbListUserCabinet(userId);
        
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
    const userId = req.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Missing User ID' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, isWishlist, userReview } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing Spirit ID' }, { status: 400 });
        }

        // Logic check: if it's a wishlist item, rating is 0. 
        // If it's a review, it has a rating.
        await dbUpsertCabinet({
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
        await dbDeleteCabinet({ userId, spiritId: id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cabinet DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
