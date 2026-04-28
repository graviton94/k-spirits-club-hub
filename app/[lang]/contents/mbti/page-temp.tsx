import { Metadata } from 'next';
import Link from 'next/link';
import { MBTIClient } from './mbti-client';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import { RelatedContentLinks } from '@/components/common/related-content-links';
import { getRelatedIconKey } from '@/components/common/related-content-icon-key';

interface MbtiPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MbtiPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/mbti`);
  const hreflangAlternates = getHreflangAlternates('/contents/mbti');

  return {
    title: isEn
      ? 'Spirit MBTI Test — Discover Your Drink Persona'
      : '주류 MBTI 테스트 — 나만의 알코올 유형을 찾아보세요',
    description: isEn
      ? 'Find your ultimate spirit match through 12 fun personality questions. Are you a refined single malt or a refreshing craft gin? Discover your drinking style and share with friends.'
      : '12가지 질문으로 알아보는 나만의 알코올 성향 테스트. 내가 만약 술이라면 어떤 술일까? 친구와 함께 나의 진짜 취향을 발견하고 딱 맞는 주류 제품도 확인해보세요.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirit MBTI Test | K-Spirits Club' : '주류 MBTI 테스트 | K-Spirits Club',
      description: isEn
        ? 'Find your alcohol personality type in 12 questions. Get personalized spirit recommendations matched to your taste.'
        : '12가지 질문으로 발견하는 나의 알코올 페르소나. 나의 성향과 가장 닮은 술은 무엇일까요?',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default async function MbtiPage({ params }: MbtiPageProps) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <>
      <MBTIClient lang={lang} />

      {/* SSR landing content — moved below main content for better UX */}
      <section className="bg-background border-t border-border/40 py-14 px-4">
        <div className="container mx-auto max-w-2xl space-y-10">

          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isEn ? 'About Spirit MBTI Test' : '주류 MBTI 테스트 안내'}
            </h2>
            {isEn ? (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  The Spirit MBTI Test is an interactive tool designed to help you discover your personality through the lens of traditional and modern spirits. By answering 12 simple yet insightful questions about your social habits, taste preferences, and decision-making style, we map your persona to one of 16 distinct spirit types.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you are a deep and complex "Aged Single Malt" or a vibrant and adaptable "Craft Gin," your result provides more than just a label. It offers insights into why you enjoy certain flavors and environments, helping you choose your next drink with greater confidence.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  주류 MBTI 테스트는 성격 심리학과 전 세계 주류의 특성을 결합하여 나만의 '알코올 페르소나'를 찾아주는 소통형 도구입니다. 사회적 성향, 선호하는 맛, 의사결정 방식에 관한 12가지 질문을 통해 당신의 성격을 16가지 대표 주류 유형 중 하나로 매칭해 드립니다.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  깊고 복잡한 매력을 지닌 '숙성 싱글 몰트'부터 활기차고 변화무쌍한 '크래프트 진'까지, 결과는 단순한 레이블 그 이상을 제공합니다. 당신이 특정 풍미와 환경을 선호하는 이유를 이해하고, 다음에 즐길 술을 더 자신 있게 선택할 수 있도록 돕습니다.
                </p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              {isEn ? 'Why Take the Drink Persona Test?' : '테스트를 해봐야 하는 이유'}
            </h3>
            {isEn ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>Discover your subconscious taste preferences in a fun, relatable way.</li>
                <li>Get personalized spirit recommendations based on your unique profile.</li>
                <li>Compare results with friends to find your perfect "drinking buddy" compatibility.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>재미있고 공감 가는 방식으로 나의 잠재된 입맛 취향을 발견할 수 있습니다.</li>
                <li>나의 고유한 성향 프로필에 기반한 맞춤형 주류 추천을 받을 수 있습니다.</li>
                <li>친구들과 결과를 공유하며 환상의 '술친구' 궁합을 확인해 보세요.</li>
              </ul>
            )}
          </div>

          <RelatedContentLinks 
            title={isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
            links={[
              { href: `/${lang}/contents`, label: isEn ? 'Contents Hub' : '콘텐츠 허브', icon: getRelatedIconKey('hub', '/contents') },
              { href: `/${lang}/contents/worldcup`, label: isEn ? 'Spirit World Cup' : '주류 월드컵', icon: getRelatedIconKey('worldcup', '/contents/worldcup') },
              { href: `/${lang}/explore`, label: isEn ? 'Explore Spirits' : '주류 탐색', icon: getRelatedIconKey('explore', '/explore') },
            ]}
          />

        </div>
      </section>
    </>
  );
}
