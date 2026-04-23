import { NextResponse } from 'next/server';
import { dbAdminListRawSpirits, dbAdminUpsertSpirit } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    const traceId = crypto.randomUUID();
    try {
        console.log('[Backfill API] 🚀 Starting Spirit Image URL Backfill');

        // 1. Fetch all spirits (this might need pagination if DB is huge, but for now we'll do a batch)
        const spirits = await dbAdminListRawSpirits({ limit: 1000 });
        
        console.log(`[Backfill API] 📋 Processing ${spirits.length} spirits`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const spirit of spirits) {
            const hasHttp = 
                (spirit.imageUrl && spirit.imageUrl.startsWith('http://')) || 
                (spirit.thumbnailUrl && spirit.thumbnailUrl.startsWith('http://'));

            if (hasHttp) {
                // dbAdminUpsertSpirit already has the logic to replace http with https
                // We just need to pass the current data back through it.
                await dbAdminUpsertSpirit(spirit as any);
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            total: spirits.length,
            updated: updatedCount,
            skipped: skippedCount,
            traceId
        });

    } catch (error: any) {
        console.error('[Backfill API] ❌ Failure:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            traceId
        }, { status: 500 });
    }
}
