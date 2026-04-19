import { Metadata } from 'next';
import { Trophy, ChevronLeft, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import { dbGetWorldCupResult } from '@/lib/db/data-connect-client';

interface WinnerData {
  id: string;
  name: string;
  nameEn?: string | null;
  category: string;
  categoryEn?: string | null;
  subcategory?: string | null;
  distillery?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  noseTags?: string[] | null;
  palateTags?: string[] | null;
  finishTags?: string[] | null;
  abv?: number | null;
  country?: string | null;
  region?: string | null;
}

interface ResultData {
  winner: WinnerData;
  category: string;
  subcategory?: string | null;
  timestamp?: string | null;
}

async function getResult(id: string): Promise<ResultData | null> {
  try {
    const raw = await dbGetWorldCupResult(id);
    if (!raw || !raw.winner) return null;
    return raw as ResultData;
  } catch (error) {
    console.error('Error fetching worldcup result:', error);
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;
  const isEn = lang === 'en';
  const result = await getResult(id);
  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/worldcup/result/${id}`);
  const hreflangAlternates = getHreflangAlternates(`/contents/worldcup/result/${id}`);

  if (!result) {
    return {
      title: isEn ? 'Result Not Found | K-Spirits Club' : '결과를 찾을 수 없습니다 | K-Spirits Club',
      robots: { index: false, follow: true },
      alternates: {
        canonical: canonicalUrl,
        languages: hreflangAlternates,
      },
    };
  }

  const { winner } = result;
  const description = isEn
    ? 'See the winning spirit from this tournament share page and start your own bracket on K-Spirits Club.'
    : '이 토너먼트 결과를 확인하고 K-Spirits Club에서 직접 월드컵을 시작해보세요.';
  const image = winner.imageUrl || winner.thumbnailUrl || '/og-image.png';
  const title = isEn ? `${winner.name} | World Cup Result` : `${winner.name} | 월드컵 결과`;
  const ogTitle = isEn ? `My World Cup Champion: ${winner.name}` : `나의 월드컵 우승 픽: ${winner.name}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: isEn ? 'en_US' : 'ko_KR',
      siteName: 'K-Spirits Club',
      images: [{ url: image, width: 800, height: 800, alt: winner.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

export default async function WorldCupResultPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const isEn = lang === 'en';
  const result = await getResult(id);

  if (!result) {
    notFound();
  }

  const { winner } = result;
  const tags = [
    ...(winner.noseTags ?? []),
    ...(winner.palateTags ?? []),
    ...(winner.finishTags ?? []),
  ]
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag));

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4">
          <Link
            href={`/${lang}/contents/worldcup`}
            className="p-2.5 bg-card/50 backdrop-blur-md rounded-2xl border border-border hover:bg-muted transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-amber-500 text-xs font-black uppercase tracking-widest">
            World Cup Result
          </span>
        </div>

        <h2 className="text-3xl font-black text-foreground mb-8 tracking-tighter">
          {isEn ? 'Your Champion Pick!' : '나의 최고의 선택!'}
        </h2>

        <div className="bg-white p-8 rounded-[32px] mb-10 mx-auto w-fit shadow-xl border border-neutral-100">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1 mb-2">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">
                K-Spirits World Cup
              </span>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                <h4 className="text-xl font-black text-[#1a1a1a] tracking-tighter italic">
                  CHAMPION
                </h4>
              </div>
            </div>

            <div className="w-64 bg-white border border-[#e5e5e5] rounded-[24px] overflow-hidden shadow-lg relative">
              <div className="aspect-square relative p-6 bg-[#f8f8f8] border-b border-[#e5e5e5]">
                <Image
                  src={getOptimizedImageUrl(winner.imageUrl || winner.thumbnailUrl || '', 600)}
                  alt={winner.name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                  priority
                />
              </div>

              <div className="p-5 flex flex-col gap-3 text-center bg-white items-center text-[#1a1a1a]">
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                    {winner.category}
                  </span>
                  {winner.subcategory && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      {winner.subcategory}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black leading-tight line-clamp-2 px-1">
                  {winner.name}
                </h3>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {winner.country && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">
                      {winner.country}
                    </span>
                  )}
                  {winner.region && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-medium rounded-full uppercase">
                      {winner.region}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {winner.abv !== undefined && winner.abv !== null && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full">
                      {winner.abv}%
                    </span>
                  )}
                  {winner.distillery && (
                    <span className="px-2 py-0.5 bg-gray-500 text-white text-[10px] font-medium rounded-full">
                      {winner.distillery}
                    </span>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-[9px] text-amber-600 font-bold whitespace-nowrap"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 opacity-30">
              <span className="text-[8px] text-[#1a1a1a] font-bold tracking-widest uppercase">
                k-spirits.club
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-72 mx-auto">
          <Link
            href={`/${lang}/contents/worldcup`}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Gamepad2 className="w-5 h-5" />
            {isEn ? 'Start Your Own Tournament' : '나도 월드컵 하러 가기'}
          </Link>

          <p className="mt-4 text-xs text-muted-foreground font-medium">
            {isEn
              ? 'Find more spirits that match your taste on K-Spirits Club.'
              : 'K-Spirits에서 당신에게 맞는 취향을 찾아보세요.'}
          </p>
        </div>
      </div>
    </div>
  );
}
