// app/api/cabinet/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListUserCabinet } from '@/lib/db/data-connect-admin';
import { verifyRequestToken } from '@/lib/auth/verifyToken';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const traceId = crypto.randomUUID();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('uid');

    if (!userId) {
        return NextResponse.json({
            error: 'User ID is required',
            code: 'CABINET_UID_REQUIRED',
            traceId,
            source: 'api/cabinet/list'
        }, { status: 400 });
    }

    const verified = await verifyRequestToken(req.headers.get('authorization'));

    if (!verified) {
        return NextResponse.json({
            error: 'Unauthorized: Invalid or missing token',
            code: 'CABINET_UNAUTHORIZED',
            traceId,
            source: 'api/cabinet/list'
        }, { status: 401 });
    }

    if (verified.uid !== userId && !verified.isAdmin) {
        return NextResponse.json({
            error: 'Forbidden',
            code: 'CABINET_FORBIDDEN',
            traceId,
            source: 'api/cabinet/list'
        }, { status: 403 });
    }

    try {
        // Get user's cabinet items - returns relational join data
        const cabinetItems = await dbAdminListUserCabinet(userId);

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

        return NextResponse.json({ data: mappedItems, traceId });

    } catch (error: any) {
        console.error(`[cabinet/list][${traceId}] Error fetching user cabinet:`, error);
        return NextResponse.json({
            error: error.message,
            code: 'CABINET_FETCH_FAILED',
            traceId,
            source: 'api/cabinet/list',
            debug: {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                envAudit: 'Check /api/health for environment variable status'
            }
        }, { status: 500 });
    }
}
