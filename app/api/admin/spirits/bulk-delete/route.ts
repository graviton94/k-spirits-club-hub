import { NextRequest, NextResponse } from 'next/server';
import { dbDeleteSpirit } from '@/lib/db/data-connect-client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { spiritIds } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        let deletedCount = 0;
        for (const id of spiritIds) {
            try {
                await dbDeleteSpirit(id);
                deletedCount++;
            } catch (e) {
                console.error(`Failed to delete spirit ${id}`, e);
            }
        }

        return NextResponse.json({ success: true, deletedCount });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to bulk delete spirits', details: error.message }, { status: 500 });
    }
}
