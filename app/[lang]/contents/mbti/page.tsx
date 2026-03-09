import { Metadata } from 'next';
import Link from 'next/link';
import { MBTIClient } from './mbti-client';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEn = lang === 'en';

    const canonicalUrl = getCanonicalUrl(`/${lang}/contents/mbti`);
    const hreflangAlternates = getHreflangAlternates('/contents/mbti');

    return {
        title: isEn
            ? 'Find Your Spirit MBTI — 12 Questions to Discover Your Drink Personality'
            : '내 술 취향 MBTI 찾기 — 12가지 질문으로 알아보는 나의 주류 성격 유형',
        description: isEn
            ? 'Take the Spirit MBTI test and discover which of 12 drink personality types matches you. Get personalized spirit recommendations based on your taste preferences and drinking style.'
            : '12가지 질문에 답하고 나만의 주류 성격 유형을 찾아보세요. 소주형, 위스키형, 막걸리형 등 12가지 유형 중 나와 딱 맞는 술과 취향 분석 결과를 확인하세요.',
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangAlternates,
        },
        openGraph: {
            title: isEn ? 'Spirit MBTI Test | K-Spirits Club' : '내 술 취향 MBTI 테스트 | K-Spirits Club',
            description: isEn
                ? 'Discover your drink personality type and get personalized spirit recommendations.'
                : '나의 주류 성격 유형을 발견하고 맞춤형 술 추천을 받아보세요.',
            url: canonicalUrl,
            images: ['/MBTI/og-mbti.webp'],
        },
        twitter: {
            card: 'summary_large_image',
            title: isEn ? 'Spirit MBTI Test | K-Spirits Club' : '내 술 취향 MBTI 테스트 | K-Spirits Club',
            description: isEn
                ? 'Find your drink personality type in 12 questions. Get personalized spirit recommendations matched to your taste.'
                : '12가지 질문으로 나의 주류 성격 유형을 찾아보세요. 취향에 딱 맞는 술 추천을 받아보세요.',
            images: ['/MBTI/og-mbti.webp'],
        },
    };
}

export default async function MbtiPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isEn = lang === 'en';

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                <MBTIClient lang={lang} />
            </div>

            {/* SSR landing content — provides substantial indexed copy for both KO and EN */}
            <section className="bg-background border-t border-border/40 py-14 px-4">
                <div className="container mx-auto max-w-2xl space-y-10">

                    {/* Introduction */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {isEn ? 'Find Your Spirit MBTI' : '내 술 취향 MBTI 찾기'}
                        </h1>
                        {isEn ? (
                            <>
                                <p className="text-muted-foreground leading-relaxed">
                                    The K-Spirits Club Spirit MBTI test analyses your drinking personality through 12 carefully crafted questions. Whether you gravitate toward sweet and approachable drinks, or bold and complex spirits, your honest answers reveal one of 12 distinct drink personality types — each paired with tailored spirit recommendations.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Unlike generic taste quizzes, our test explores your social drinking style, preferred flavor profiles, and attitude toward adventurous choices. The result gives you a personality profile alongside curated recommendations from our database of over 100,000 spirits worldwide.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground leading-relaxed">
                                    K-Spirits Club 주류 MBTI 테스트는 12가지 질문을 통해 당신의 음주 성격을 분석합니다. 달콤하고 편안한 술을 선호하는지, 복합적이고 강렬한 증류주에 끌리는지, 혼술과 혼잡 중 어느 쪽이 편한지 — 솔직한 답변을 바탕으로 12가지 주류 성격 유형 중 당신에게 딱 맞는 유형을 찾아드립니다.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    단순한 취향 설문과 달리, 이 테스트는 음주 사교 스타일, 선호하는 풍미 프로파일, 새로운 술에 대한 개방성까지 탐구합니다. 결과 페이지에서는 성격 분석과 함께 전 세계 10만 종 이상의 주류 데이터베이스에서 엄선한 맞춤 추천을 확인할 수 있습니다.
                                </p>
                            </>
                        )}
                    </div>

                    {/* How It Works */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">
                            {isEn ? 'How the Spirit MBTI Test Works' : '테스트 진행 방식'}
                        </h2>
                        {isEn ? (
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                                <li>Answer 12 short questions about your taste preferences and drinking habits — no wrong answers.</li>
                                <li>Our algorithm maps your responses across four personality dimensions: flavor preference, drinking occasion, adventurousness, and social style.</li>
                                <li>Receive your spirit personality type — for example, &ldquo;The Soju Socialite&rdquo;, &ldquo;The Whisky Contemplator&rdquo;, or &ldquo;The Makgeolli Romantic&rdquo;.</li>
                                <li>Explore your recommended spirits and discover new bottles that match your profile on the K-Spirits Club explore page.</li>
                            </ol>
                        ) : (
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                                <li>취향과 음주 습관에 관한 12가지 짧은 질문에 솔직하게 답하세요 — 틀린 답은 없습니다.</li>
                                <li>알고리즘이 풍미 선호도, 음주 상황, 모험성, 사교 스타일 등 4가지 성격 차원으로 답변을 분석합니다.</li>
                                <li>나만의 주류 성격 유형을 확인하세요 — &ldquo;소주 소셜라이트&rdquo;, &ldquo;위스키 사색가&rdquo;, &ldquo;막걸리 낭만파&rdquo; 등 12가지 유형 중 하나를 받게 됩니다.</li>
                                <li>추천 주류를 살펴보고 K-Spirits Club 탐색 페이지에서 나의 유형에 맞는 새로운 술을 발견해보세요.</li>
                            </ol>
                        )}
                    </div>

                    {/* Spirit Personality Types Teaser */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">
                            {isEn ? 'What Result Types Can You Get?' : '어떤 유형이 나올까요?'}
                        </h2>
                        {isEn ? (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                There are 12 distinct spirit personality types, each reflecting a different combination of taste preference and drinking character. Some types align with the warm communal spirit of Korean soju, others with the refined solitude of aged whisky, and still others with the bright spontaneity of cocktail culture. No type is better than another — each reveals a genuine facet of your relationship with drinks.
                            </p>
                        ) : (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                12가지 주류 성격 유형은 각각 서로 다른 취향과 음주 캐릭터의 조합을 반영합니다. 한국 소주의 따뜻한 공동체 정신에 어울리는 유형도 있고, 숙성 위스키의 고요한 사색과 맞닿은 유형도 있으며, 칵테일 문화의 발랄한 즉흥성을 담은 유형도 있습니다. 어떤 유형이 더 낫거나 나쁜 것이 아닙니다 — 각 결과는 술과 나의 관계를 진솔하게 보여주는 거울입니다.
                            </p>
                        )}
                    </div>

                    {/* FAQ */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            {isEn ? 'Frequently Asked Questions' : '자주 묻는 질문'}
                        </h2>
                        <dl className="space-y-4 text-sm">
                            {isEn ? (
                                <>
                                    <div>
                                        <dt className="font-semibold text-foreground">How long does the test take?</dt>
                                        <dd className="text-muted-foreground mt-1">The test takes about 2–3 minutes. There are 12 multiple-choice questions with no time limit.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">Do I need an account to take the test?</dt>
                                        <dd className="text-muted-foreground mt-1">No account is required. Anyone can take the Spirit MBTI test for free. Creating an account lets you save your result and track your spirit collection.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">How are spirit recommendations chosen?</dt>
                                        <dd className="text-muted-foreground mt-1">Recommendations are drawn from our curated database of 100,000+ spirits worldwide, filtered to match your personality type&rsquo;s flavor and style profile.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">Can my result change if I retake the test?</dt>
                                        <dd className="text-muted-foreground mt-1">Yes. Your tastes can evolve, and retaking the test may reveal a new or refined personality type as your palate develops.</dd>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <dt className="font-semibold text-foreground">테스트는 얼마나 걸리나요?</dt>
                                        <dd className="text-muted-foreground mt-1">약 2~3분이면 충분합니다. 12개의 객관식 문항이며 시간 제한은 없습니다.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">계정이 없어도 테스트를 할 수 있나요?</dt>
                                        <dd className="text-muted-foreground mt-1">네, 계정 없이도 무료로 주류 MBTI 테스트를 진행할 수 있습니다. 계정을 만들면 결과를 저장하고 나만의 주류 컬렉션을 관리할 수 있습니다.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">주류 추천은 어떻게 선정되나요?</dt>
                                        <dd className="text-muted-foreground mt-1">전 세계 10만 종 이상의 주류 데이터베이스에서 내 성격 유형의 풍미와 스타일 프로파일에 맞게 필터링된 결과를 추천해드립니다.</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-foreground">재검사 시 다른 결과가 나올 수 있나요?</dt>
                                        <dd className="text-muted-foreground mt-1">네. 취향은 변화하기 때문에, 팔레트가 발전함에 따라 다시 테스트하면 새롭거나 더 세밀한 유형이 나올 수 있습니다.</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>

                    {/* Internal Links */}
                    <div className="space-y-3 pt-2 border-t border-border/40">
                        <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-widest text-sm">
                            {isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
                        </h2>
                        <ul className="flex flex-wrap gap-2 text-sm">
                            <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
                            <li><Link href={`/${lang}/contents/worldcup`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Spirit World Cup Tournament' : '술 취향 월드컵'}</Link></li>
                            <li><Link href={`/${lang}/contents/wiki/soju-guide`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Korean Soju Guide' : '소주 가이드'}</Link></li>
                            <li><Link href={`/${lang}/contents/wiki/makgeolli-guide`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Makgeolli Guide' : '막걸리 가이드'}</Link></li>
                            <li><Link href={`/${lang}/contents/wiki/korean-whisky`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Korean Whisky Distilleries' : '한국 위스키'}</Link></li>
                            <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Explore Spirits' : '주류 탐색'}</Link></li>
                        </ul>
                    </div>

                </div>
            </section>
        </>
    );
}
