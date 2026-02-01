import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '황금 비율 마스터 (소맥 제조기) | K-Spirits Club',
    description: '당신의 소맥 비율은 몇 점? 0.1%의 오차도 허용하지 않는 황금 비율에 도전하세요.',
    openGraph: {
        title: '황금 비율 마스터 | K-Spirits Club',
        description: '당신의 소맥 비율은 몇 점? 0.1%의 오차도 허용하지 않는 황금 비율에 도전하세요.',
    },
};

export default function PerfectPourLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
