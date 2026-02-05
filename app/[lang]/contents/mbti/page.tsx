import { Metadata } from 'next';
import { MBTIClient } from './mbti-client';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEn = lang === 'en';

    return {
        title: isEn
            ? 'Find Your Spirit MBTI | K-Spirits Club'
            : '내 술 취향 MBTI 찾기 | K-Spirits Club',
        description: isEn
            ? 'Find your alcohol ego with 12 questions! Which drink suits you best?'
            : '12가지 질문으로 알아보는 나의 알코올 자아 찾기 테스트! 나와 어울리는 술은 무엇일까요?',
        openGraph: {
            title: isEn ? 'Spirit MBTI Test' : '내 술 취향 MBTI 테스트',
            description: isEn
                ? 'Personalized drink recommendations for you! Check it out now.'
                : '당신을 위한 맞춤형 술 추천! 지금 바로 확인해보세요.',
            images: ['/MBTI/og-mbti.webp'],
        },
    };
}

export default async function MbtiPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="min-h-screen bg-black text-white">
            <MBTIClient lang={lang} />
        </div>
    );
}
