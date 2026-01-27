import { NextResponse } from 'next/server';
import { newArrivalsDb } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

export async function GET() {
    try {
        // 1. Force Sync (Updates cache from Spirits collection)
        const syncResult = await newArrivalsDb.syncCache();

        // 2. Read Cache
        const cached = await newArrivalsDb.getAll();

        return NextResponse.json({
            syncResult,
            cacheCount: cached.length,
            sample: cached.slice(0, 3)
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Test Endpoint Failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
