import { NextRequest, NextResponse } from 'next/server';
import { dbAdminUpsertSpirit } from '@/lib/db/data-connect-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const traceId = crypto.randomUUID();

  try {
    const body = await req.json();

    if (!body?.id || !body?.name || !body?.category) {
      return NextResponse.json({
        error: 'Missing required fields: id, name, category',
        code: 'ADMIN_SPIRIT_REQUIRED_FIELDS',
        traceId,
        source: 'api/admin/spirits/upsert'
      }, { status: 400 });
    }

    await dbAdminUpsertSpirit(body);

    return NextResponse.json({
      success: true,
      id: body.id,
      traceId
    });
  } catch (error: any) {
    console.error(`[admin/spirits/upsert][${traceId}]`, error);
    return NextResponse.json({
      error: error?.message || 'Failed to upsert spirit',
      code: 'ADMIN_SPIRIT_UPSERT_FAILED',
      traceId,
      source: 'api/admin/spirits/upsert'
    }, { status: 500 });
  }
}
