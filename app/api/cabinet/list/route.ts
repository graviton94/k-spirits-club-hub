// app/api/cabinet/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbListUserCabinet } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('uid');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Get user's cabinet items - returns relational join data
        const cabinetItems = await dbListUserCabinet(userId);

        if (cabinetItems.length === 0) {
            return NextResponse.json({ data: [] });
        }

        // Map to flat structure for UI compatibility
        const mappedItems = cabinetItems.map((item: any) => {
            if (!item) return null;
            const spirit = item.spirit || {};
            return {
                ...item,
                ...spirit,
                title: spirit.name || 'Unknown Spirit',
                nameEn: spirit.nameEn || '',
                id: spirit.id || item.spiritId,
                thumbnailUrl: spirit.thumbnailUrl || spirit.imageUrl || null
            };
        }).filter(Boolean);

        return NextResponse.json({ data: mappedItems });

    } catch (error: any) {
        console.error('Error fetching user cabinet:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
