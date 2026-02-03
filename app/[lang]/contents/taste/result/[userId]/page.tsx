import { Metadata } from 'next';
import { tasteProfileDb } from '@/lib/db/firestore-rest';
import TastePublicReport from '@/components/cabinet/TastePublicReport';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
    const profile = await tasteProfileDb.get(params.userId);

    if (!profile) {
        return {
            title: '취향 분석 결과를 찾을 수 없습니다 - K-Spirits',
        };
    }

    const title = `🧬 나의 미각 DNA: "${profile.persona.title}"`;
    const description = `${profile.persona.keywords.join(' ')} | AI가 분석한 나의 주류 취향을 확인해보세요.`;

    // 카카오톡 캐시를 방지하고 최신 이미지를 불러오기 위해 유저 ID 기반 쿼리 추가
    const image = `/cabinet.jpg?v=${params.userId}`;

    return {
        title: `${profile.persona.title} - 미각 DNA 리포트`,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: profile.persona.title,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function TasteResultPage({ params }: { params: { userId: string } }) {
    const profileData = await tasteProfileDb.get(params.userId);

    if (!profileData) {
        notFound();
    }

    // Convert string ISO to Date object for the component
    const profile = {
        ...profileData,
        analyzedAt: new Date(profileData.analyzedAt)
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
            {/* 배경 글로우 효과 */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 pt-10 md:pt-20">
                <TastePublicReport profile={profile} isPublic={true} />

                {/* Footer 하단 작게 표시 */}
                <div className="mt-20 text-center opacity-30">
                    <p className="text-[10px] text-neutral-500 font-bold tracking-[0.4em] uppercase">
                        k-spirits.club | Advanced AI Taste Analysis
                    </p>
                </div>
            </div>
        </div>
    );
}

// ISR 설정 (1시간마다 갱신 혹은 공유 시점에 최신화)
export const revalidate = 3600;
