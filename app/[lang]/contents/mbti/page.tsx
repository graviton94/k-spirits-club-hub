import { Metadata } from 'next';
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
    <div className="flex flex-col min-h-screen">
      {/* Interactive Content First */}
      <MBTIClient lang={lang} />

      {/* Landing Description Section - Below the fold for better UX */}
      <section className="bg-background border-t border-border/40 py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl space-y-8 md:space-y-12">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
              {isEn ? 'The Spirit Within' : '주류 MBTI 테스트 소개'}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
              <p>
                {isEn 
                  ? "Ever wondered if your personality matches the complex notes of an aged whiskey or the crisp clarity of a cold premium brew? The Spirit MBTI Test is an interactive journey designed to bridge the gap between human psychology and the rich world of alcohols." 
                  : "나의 성격이 숙성된 위스키의 복합적인 노트와 닮았는지, 아니면 프리미엄 맥주의 갈끔한 청량감과 닮았는지 궁금해 본 적 있나요? 주류 MBTI 테스트는 인간의 심리와 다채로운 주류의 세계를 잇는 인터랙티브 여정입니다."}
              </p>
              <p>
                {isEn
                  ? "By exploring your social tendencies, flavor preferences, and decision-making patterns, we match you with one of 16 distinct spirit personas. It's more than just a test; it's a way to discover new favorites and share your unique 'vibe' with friends."
                  : "사회적 성향, 선호하는 풍미, 의사결정 패턴을 분석하여 당신을 16가지 고유한 '주류 페르소나' 중 하나와 매칭해 드립니다. 단순한 테스트를 넘어, 새로운 취향을 발견하고 나만의 고유한 '바이브'를 친구들과 공유해 보세요."}
              </p>
            </div>
          </div>

          <div className="space-y-6 border-t border-border/10 pt-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary italic">
              {isEn ? 'Why Take This Test?' : '테스트를 해야 하는 이유'}
            </h3>
            <ul className="grid gap-4 text-sm font-bold">
              {[
                isEn ? "Personalized recommendations based on your persona" : "페르소나에 기반한 맞춤형 주류 추천",
                isEn ? "Compare drinking styles with friends and partners" : "친구, 연인과 마시는 스타일 궁합 확인",
                isEn ? "Discover hidden gems in categories you haven't tried" : "시도해보지 않은 주류 카테고리 속 숨은 보석 발견",
                isEn ? "Fun, shareable results with premium design" : "프리미엄 디자인이 가미된 공유하기 좋은 결과"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <RelatedContentLinks 
            title={isEn ? 'Explore More' : '관련 콘텐츠 탐색'}
            links={[
              { href: `/${lang}/contents`, label: isEn ? 'Contents Hub' : '콘텐츠 허브', icon: getRelatedIconKey('hub', '/contents') },
              { href: `/${lang}/contents/worldcup`, label: isEn ? 'Spirit World Cup' : '주류 월드컵', icon: getRelatedIconKey('worldcup', '/contents/worldcup') },
              { href: `/${lang}/contents/news`, label: isEn ? 'Global News' : '글로벌 뉴스', icon: getRelatedIconKey('news', '/contents/news') },
              { href: `/${lang}/explore`, label: isEn ? 'Explore' : '주류 탐색', icon: getRelatedIconKey('explore', '/explore') },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
