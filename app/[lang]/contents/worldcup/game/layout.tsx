import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEn = lang === 'en';
    return {
        title: isEn ? 'In Progress… | Spirit World Cup' : '진행 중… | 술 취향 월드컵',
        description: isEn ? 'Choose your favorite spirit!' : '당신의 최고의 술을 골라보세요!',
        openGraph: {
            title: isEn ? 'Spirit World Cup | K-Spirits Club' : '술 취향 월드컵 | K-Spirits Club',
            description: isEn ? 'Choose your favorite spirit!' : '당신의 최고의 술을 골라보세요!',
            images: [{ url: '/worldcup.jpg' }],
        },
        twitter: {
            card: 'summary_large_image',
            images: ['/worldcup.jpg'],
        },
    };
}

export default function WorldCupGameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
