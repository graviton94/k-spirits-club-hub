import { NextResponse } from 'next/server';
import { getServiceAccountToken } from '@/lib/auth/service-account';
import { getAppPath } from '@/lib/db/paths';

export const runtime = 'edge';

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        // 1. REST API 인증 토큰 준비
        const token = await getServiceAccountToken();
        const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
        const newsPath = getAppPath().news;
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${newsPath}/${id}`;

        // 2. DELETE 요청 (Edge 호환 fetch)
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Delete failed: ${errText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Delete API] ❌ 에러:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}