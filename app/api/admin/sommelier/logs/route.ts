import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListAiDiscoveryLogs } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';

/**
 * Admin API to fetch AI Sommelier discovery logs from SQL (PostgreSQL)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get('limit')) || 100;

        const logs = await dbAdminListAiDiscoveryLogs(limit);
        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('[Admin SQL Logs API Error]', error);
        return NextResponse.json(
            { error: 'Failed to fetch logs from SQL', details: error.message },
            { status: 500 }
        );
    }
}
