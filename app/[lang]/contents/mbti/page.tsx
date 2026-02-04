import { Metadata } from 'next';
import { MBTIClient } from '@/app/[lang]/contents/mbti/mbti-client';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
    const isEn = params.lang === 'en';
    return {
        title: isEn ? 'Spirit MBTI Test | K-Spirits Club Hub' : '내 술 취향 MBTI 테스트 | K-Spirits Club Hub',
        description: isEn
            ? 'What alcohol suits you best? Find your spirit MBTI with 12 questions and get personalized recommendations.'
            : '나와 가장 잘 맞는 술은 무엇일까? 12개의 질문을 통해 당신의 술 취향 MBTI를 확인하고 맞춤 전통주/위스키를 추천받으세요.',
        openGraph: {
            title: isEn ? 'Spirit MBTI Test' : '내 술 취향 MBTI 테스트',
            description: isEn ? 'Analyze your drinking taste.' : '당신의 술 취향을 분석해 드립니다.',
            images: [{ url: '/MBTI/og-mbti.png' }], // Base OG image
        },
    };
}

export default function MBTIPage({ params }: { params: { lang: string } }) {
    return (
        <main className="min-h-screen bg-background">
            <MBTIClient lang={params.lang} />
        </main>
    );
}
