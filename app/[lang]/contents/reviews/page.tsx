export const runtime = 'edge';

import { Metadata } from 'next';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import ReviewBoardPage from './reviews-client';

interface ReviewsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/reviews`);
  const hreflangAlternates = getHreflangAlternates('/contents/reviews');

  return {
    title: isEn ? 'Spirits Review Board | K-Spirits Club' : '주류 리뷰 보드 | K-Spirits Club',
    description: isEn
      ? 'Check and share real tasting reviews from other spirits enthusiasts.'
      : '다른 사용자들의 리얼한 시음평을 확인하고 공유해보세요.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirits Review Board' : '주류 리뷰 보드',
      description: isEn
        ? 'Real tasting reviews from spirits enthusiasts.'
        : '주류 애호가들의 리얼한 시음 리뷰.',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default function ReviewsPage() {
  return <ReviewBoardPage />;
}
