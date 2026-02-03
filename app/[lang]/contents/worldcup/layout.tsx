import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '주류 취향 월드컵 | K-Spirits Club',
    description: '당신의 최애 술을 찾아보세요! 다양한 카테고리의 주류 월드컵 토너먼트.',
    openGraph: {
        title: '주류 취향 월드컵 | K-Spirits Club',
        description: '당신의 최애 술을 찾아보세요! 다양한 카테고리의 주류 월드컵 토너먼트.',
        images: [{ url: '/worldcup.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/worldcup.jpg'],
    }
};

export default function WorldCupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
