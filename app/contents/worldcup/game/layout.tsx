import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '진행 중... | 주류 취향 월드컵',
    description: '당신의 최고의 술을 골라보세요!',
};

export default function WorldCupGameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
