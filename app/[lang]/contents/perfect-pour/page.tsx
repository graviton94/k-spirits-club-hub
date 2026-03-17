import { Metadata } from 'next';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import PerfectPourPage from './perfect-pour-client';

interface PerfectPourPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PerfectPourPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/perfect-pour`);
  const hreflangAlternates = getHreflangAlternates('/contents/perfect-pour');

  return {
    title: isEn ? 'Golden Ratio Master' : '황금 비율 마스터',
    description: isEn
      ? 'Test your pouring skills! Can you hit the perfect Somaek ratio in this timing mini-game?'
      : '당신의 소맥 비율은 몇 점? 타이밍 미니게임으로 황금 비율에 도전해보세요.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Golden Ratio Master' : '황금 비율 마스터',
      description: isEn
        ? 'Test your Somaek pouring skills in this mini-game!'
        : '소맥 황금 비율 미니게임에 도전하세요!',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default function PerfectPourServerPage() {
  return <PerfectPourPage />;
}
