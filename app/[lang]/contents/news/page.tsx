export const runtime = 'edge';

import { Metadata } from 'next';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import NewsContentPage from './news-client';

interface NewsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/news`);
  const hreflangAlternates = getHreflangAlternates('/contents/news');

  return {
    title: isEn ? 'Global Spirits News | K-Spirits Club' : '글로벌 주류 뉴스 | K-Spirits Club',
    description: isEn
      ? 'Latest global spirits industry news and in-depth reports analyzed by AI.'
      : 'AI가 분석한 글로벌 주류 트렌드와 심층 리포트.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Global Spirits News' : '글로벌 주류 뉴스',
      description: isEn
        ? 'Global spirits industry news and insights.'
        : '글로벌 주류업계 주요 뉴스 및 인사이트',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default function NewsPage() {
  return <NewsContentPage />;
}
