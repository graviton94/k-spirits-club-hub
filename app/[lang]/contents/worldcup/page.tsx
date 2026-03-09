export const runtime = 'edge';

import { Metadata } from 'next';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import WorldCupSelectionPage from './worldcup-client';

interface WorldCupPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: WorldCupPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/worldcup`);
  const hreflangAlternates = getHreflangAlternates('/contents/worldcup');

  return {
    title: isEn ? 'Spirit World Cup | K-Spirits Club' : '술 취향 월드컵 | K-Spirits Club',
    description: isEn
      ? "What's your favorite spirit? Vote in our ranking tournament and find your perfect match."
      : '당신의 최애 술은? 랭킹 토너먼트로 나만의 최고의 술을 찾아보세요.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirit World Cup' : '술 취향 월드컵',
      description: isEn
        ? "Vote for your favorite spirits in our ranking tournament!"
        : '술 취향 월드컵에서 나만의 최애 술을 찾아보세요!',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default function WorldCupPage() {
  return <WorldCupSelectionPage />;
}
