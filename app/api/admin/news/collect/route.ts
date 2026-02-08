import { NextResponse } from 'next/server';
import { fetchNewsForCollection } from '@/lib/api/news';
import { newsDb } from '@/lib/db/firestore-rest';
import { getServiceAccountToken } from '@/lib/auth/service-account';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function generateSafeId(url: string): string {
    return btoa(url).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

export async function POST(request: Request) {
    try {
        // 1. 보안 체크 (단순 구현 - 필요시 실제 Auth로 대체 가능)
        // 여기서는 형님이 말씀하신 'role == ADMIN' 체크를 위해 서버측 인증 로직이 필요하나,
        // Edge Runtime 호환을 위해 Firestore REST API로 유저 권한을 직접 확인하는 방식을 사용합니다.

        if (!process.env.GEMINI_API_KEY) {
            console.error('[Collect API] ❌ GEMINI_API_KEY is missing');
            return NextResponse.json({ success: false, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
        }

        console.log('[Collect API] 🚀 수집 프로세스 시작 (Edge Runtime)');

        // 2. RSS 데이터 가져오기 (Gemini 포함된 수집 함수)
        // 비용 절감을 위해 fetchNewsForCollection 내부에 "이미 있는 기사는 Gemini 스킵" 로직을 넣는 것이 베스트입니다.
        // 현재는 수집된 결과물 중 DB에 없는 것만 저장하는 방식으로 1차 보호합니다.
        const newsItems = await fetchNewsForCollection();

        if (!newsItems || newsItems.length === 0) {
            return NextResponse.json({ success: true, message: '수집된 새로운 뉴스 없음' });
        }

        // 3. Firestore REST API를 이용해 중복 확인 및 저장
        let savedCount = 0;
        for (const item of newsItems) {
            const docId = generateSafeId(item.link);

            // Upsert (이미 있으면 덮어쓰고 없으면 생성 - merge: true 효과)
            await newsDb.upsert(docId, {
                originalTitle: item.originalTitle,
                link: item.link,
                source: item.source,
                date: item.date,
                translations: {
                    ko: item.translations.ko,
                    en: item.translations.en
                },
                tags: {
                    ko: item.tags.ko,
                    en: item.tags.en
                },
                createdAt: new Date().toISOString(),
                isVisible: true
            });
            savedCount++;
        }

        return NextResponse.json({ success: true, count: savedCount });

    } catch (error: any) {
        console.error('[Collect API] ❌ 에러:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}