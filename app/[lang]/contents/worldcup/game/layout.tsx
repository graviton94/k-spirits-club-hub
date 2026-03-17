import { Metadata } from 'next';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/worldcup/game`);
  const hreflangAlternates = getHreflangAlternates('/contents/worldcup/game');

  return {
    title: isEn ? 'In Progress | Spirit World Cup' : '진행 중 | 주류 월드컵',
    description: isEn ? 'Choose your favorite spirit!' : '당신의 취향에 더 맞는 술을 골라보세요.',
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirit World Cup | K-Spirits Club' : '주류 월드컵 | K-Spirits Club',
      description: isEn ? 'Choose your favorite spirit!' : '당신의 취향에 더 맞는 술을 골라보세요.',
      url: canonicalUrl,
      locale: isEn ? 'en_US' : 'ko_KR',
      siteName: 'K-Spirits Club',
      images: [{ url: '/worldcup.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'Spirit World Cup | K-Spirits Club' : '주류 월드컵 | K-Spirits Club',
      description: isEn ? 'Choose your favorite spirit!' : '당신의 취향에 더 맞는 술을 골라보세요.',
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
