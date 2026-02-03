import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '진행 중... | 주류 취향 월드컵',
    description: '당신의 최고의 술을 골라보세요!',
    openGraph: {
        title: '주류 취향 월드컵 | K-Spirits Club',
        description: '당신의 최고의 술을 골라보세요!',
        images: [{ url: '/worldcup.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/worldcup.jpg'],
    }
};

export default function WorldCupGameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
