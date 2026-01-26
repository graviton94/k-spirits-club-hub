import { NextRequest, NextResponse } from 'next/server';
import { cabinetDb, spiritsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('uid');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Get user's cabinet items - Snapshot data only (Fast)
        const cabinetItems = await cabinetDb.getAll(userId);

        if (cabinetItems.length === 0) {
            return NextResponse.json({ data: [] });
        }

        return NextResponse.json({ data: cabinetItems });

    } catch (error: any) {
        console.error('Error fetching user cabinet:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
