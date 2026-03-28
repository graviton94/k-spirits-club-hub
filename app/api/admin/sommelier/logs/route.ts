import { NextRequest, NextResponse } from 'next/server';
import { sommelierDb } from '@/lib/db/firestore-rest';

export const runtime = 'nodejs'; // Use nodejs runtime for Firebase Service Account

/**
 * Admin API to fetch AI Sommelier discovery logs
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get('limit')) || 100;

        const logs = await sommelierDb.getDiscoveryLogs(limit);
        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('[Admin Logs API Error]', error);
        return NextResponse.json(
            { error: 'Failed to fetch logs', details: error.message },
            { status: 500 }
        );
    }
}
