import { NextRequest, NextResponse } from 'next/server';
import { dbAdminDeleteSpirit } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const traceId = crypto.randomUUID();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({
        error: 'Missing id',
        code: 'ADMIN_SPIRIT_ID_REQUIRED',
        traceId,
        source: 'api/admin/spirits/delete'
      }, { status: 400 });
    }

    await dbAdminDeleteSpirit(id);

    return NextResponse.json({ success: true, id, traceId });
  } catch (error: any) {
    console.error(`[admin/spirits/delete][${traceId}]`, error);
    return NextResponse.json({
      error: error?.message || 'Failed to delete spirit',
      code: 'ADMIN_SPIRIT_DELETE_FAILED',
      traceId,
      source: 'api/admin/spirits/delete'
    }, { status: 500 });
  }
}
