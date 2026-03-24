export const revalidate = 0; // Force fetching dynamically so latest spirits always show

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getSpiritCategory } from '@/lib/constants/spirits-guide-data'
import { spiritsDb } from '@/lib/db/firestore-rest'
import SpiritGuideLayout from '@/components/contents/SpiritGuideLayout'
import { redirect } from 'next/navigation'
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url'
import { selectFeaturedSpiritsForWiki } from '@/lib/utils/wiki-spirit-match'

const KO_TO_EN_MAP: Record<string, string> = {
    '소주-가이드': 'soju-guide',
    '막걸리-가이드': 'makgeolli-guide',
    '한국-위스키-증류소': 'korean-whisky',
    '전통주-종류-정리': 'korean-traditional-spirits',
    '도수별-증류주': 'korean-spirits-by-abv',
};

const LEGACY_EN_SLUG_MAP: Record<string, string> = {
    'korean-soju': 'soju-guide',
}

const RELATED_COMPARISON_SLUGS: Record<string, string[]> = {
    cheongju: ['cheongju-vs-sake', 'yakju-vs-cheongju'],
    sake: ['cheongju-vs-sake'],
    yakju: ['yakju-vs-cheongju'],
    'single-malt': ['single-malt-vs-blended'],
    whisky: ['single-malt-vs-blended'],
}

interface CategoryPageProps {
    params: Promise<{ lang: string; category: string }>
}


export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { lang, category: slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    // Unified Slug Policy: Always redirect Korean slugs to English slugs for stability
    if (KO_TO_EN_MAP[decodedSlug]) {
        redirect(`/${lang}/contents/wiki/${KO_TO_EN_MAP[decodedSlug]}`)
    }
    if (LEGACY_EN_SLUG_MAP[decodedSlug]) {
        redirect(`/${lang}/contents/wiki/${LEGACY_EN_SLUG_MAP[decodedSlug]}`)
    }

    const cat = getSpiritCategory(decodedSlug) || getSpiritCategory(slug)
    if (!cat) return { title: 'Not Found' }

    const isEn = lang === 'en'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const name = isEn ? cat.nameEn : cat.nameKo
    const tagline = isEn ? cat.taglineEn : cat.taglineKo
    const section = isEn ? (cat.sectionsEn || cat.sections) : cat.sections
    const definition = section?.definition || tagline

    // 롱테일 키워드 추출 (분류 이름, 맛 태그 등) 및 질문형 자동 확장
    const baseKeywords = [
        name,
        slug,
        ...(section?.classifications?.map(c => c.name) || []),
        ...(section?.flavorTags?.map(t => t.label) || []),
        isEn ? 'Spirits Wiki' : '주류 백과사전',
        isEn ? 'Drinking Temperature' : '시음 온도',
        isEn ? 'Food Pairing' : '푸드 페어링',
    ]

    const longTailClassifications = section?.classifications?.flatMap(c =>
        isEn ? [`What is ${c.name}`, `${c.name} meaning`, `${c.name} vs`] : [`${c.name}란`, `${c.name} 특징`, `${c.name} 차이`]
    ) || [];

    const longTailMetrics = section?.sensoryMetrics?.flatMap(m =>
        isEn ? [`What is ${m.metric}`, `${m.metric} meaning`] : [`${m.metric} 뜻`, `${m.metric} 의미`]
    ) || [];

    const keywords = [...baseKeywords, ...longTailClassifications, ...longTailMetrics]

    let title = isEn
        ? `Everything about ${cat.nameEn}: History, Serving, & Food Pairing`
        : `${cat.nameKo} 완벽 가이드: 역사, 종류, 최적 시음 온도 및 안주 추천`;

    if (isEn && title.length > 70) {
        title = `${cat.nameEn} Guide: Serving & Pairing`;
    } else if (!isEn && title.length > 60) {
        title = `${cat.nameKo} 완벽 가이드: 시음 및 페어링`;
    }

    const description = isEn
        ? `Learn all about ${cat.nameEn}. Professional guide including historical origins, production methods, optimal serving temperatures, and food pairings.`
        : `${cat.nameKo}의 모든 것: 유래, 제조 공정, 가장 맛있는 시음 온도와 어울리는 안주까지 전문가가 정리한 가이드입니다.`

    const ogDescription = tagline || description

    // JSON-LD는 page 컴포넌트에서 단일 출력 (중복 방지)
    // generateMetadata에서 JSON-LD를 출력하면 Google이 동일 URL에서 두 개의 구조화 데이터를 받아 혼란 발생
    let ogImageUrl = `${baseUrl}/default-og.jpg`;
    try {
        const ogParams = new URLSearchParams();
        ogParams.set('title', isEn ? cat.nameEn : cat.nameKo);
        ogParams.set('emoji', cat.emoji);
        ogParams.set('tagline', isEn ? (cat.taglineEn || '') : (cat.taglineKo || ''));
        ogParams.set('color', cat.color || 'amber');
        ogImageUrl = `${baseUrl}/api/og/wiki?${ogParams.toString()}`;
    } catch (e) {
        // fail silently back to default
    }

    const canonicalUrl = getCanonicalUrl(`/${lang}/contents/wiki/${cat.slug}`)
    const hreflangAlternates = getHreflangAlternates(`/contents/wiki/${cat.slug}`)

    return {
        title,
        description,
        keywords: keywords.join(', '),
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangAlternates,
        },
        openGraph: {
            title: isEn
                ? `${cat.nameEn} — Professional Spirits Wiki`
                : `${cat.nameKo} - 전문가용 주류 백과사전`,
            description: tagline,
            type: 'article',
            siteName: 'K-Spirits Club',
            url: canonicalUrl,
            images: [ogImageUrl],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl],
        },
    }
}

export default async function SpiritWikiCategoryPage({ params }: CategoryPageProps) {
    const { lang, category: slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    // Unified Slug Policy: Always redirect Korean slugs to English slugs for stability
    if (KO_TO_EN_MAP[decodedSlug]) {
        redirect(`/${lang}/contents/wiki/${KO_TO_EN_MAP[decodedSlug]}`)
    }
    if (LEGACY_EN_SLUG_MAP[decodedSlug]) {
        redirect(`/${lang}/contents/wiki/${LEGACY_EN_SLUG_MAP[decodedSlug]}`)
    }

    const cat = getSpiritCategory(decodedSlug) || getSpiritCategory(slug)

    if (!cat) {
        notFound()
    }

    const isEn = lang === 'en'
    const section = isEn ? (cat.sectionsEn || cat.sections) : (cat.sections || cat.sectionsEn)
    const dbCategories = section?.dbCategories

    // 해당 카테고리의 추천 제품 조회 (최대 6개)
    let featuredSpirits: {
        id: string
        name: string
        nameEn?: string | null
        category: string
        subcategory?: string | null
        imageUrl?: string
    }[] = []

    if (slug !== 'oak-barrel' && dbCategories && dbCategories.length > 0) {
        try {
            const spiritGroups = await Promise.all(
                dbCategories.map((dbCategory) =>
                    spiritsDb.getAll(
                        { category: dbCategory, isPublished: true },
                        { page: 1, pageSize: 60 },
                    ).catch(() => []),
                ),
            )

            const uniqueSpirits = Array.from(
                new Map(spiritGroups.flat().map((spirit: any) => [spirit.id, spirit])).values(),
            )

            featuredSpirits = selectFeaturedSpiritsForWiki(uniqueSpirits, cat, 6)
                .map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    nameEn: s.metadata?.name_en || s.name_en || null,
                    category: s.category,
                    subcategory: s.subcategory || null,
                    imageUrl: s.thumbnailUrl || s.imageUrl || null,
                }))
        } catch {
            // 무시
        }
    }

    const comparisonLinks = (RELATED_COMPARISON_SLUGS[cat.slug] || [])
        .map((relatedSlug) => getSpiritCategory(relatedSlug))
        .filter((relatedCategory): relatedCategory is NonNullable<typeof relatedCategory> => Boolean(relatedCategory))

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const title = isEn
        ? `${cat.nameEn} Guide — Spirits Wiki | K-Spirits Club`
        : `${cat.nameKo} 가이드 — 주류 백과사전 | K-Spirits Club`

    // 통합 JSON-LD: WebPage + Article + HowTo + FAQPage 단일 그래프
    // generateMetadata에서 JSON-LD를 중복 출력하던 코드 제거 후 여기서만 출력
    const faqItems = [
        // 1. 카테고리 정의 FAQ
        section?.definition && {
            '@type': 'Question',
            name: isEn ? `What is ${cat.nameEn}?` : `${cat.nameKo}이란 무엇인가요?`,
            acceptedAnswer: { '@type': 'Answer', text: section.definition }
        },
        // 2. 최적 시음 온도
        section?.servingGuidelines?.optimalTemperatures?.[0] && {
            '@type': 'Question',
            name: isEn ? `What is the best serving temperature for ${cat.nameEn}?` : `${cat.nameKo}의 최적 시음 온도는?`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: isEn
                    ? `${section.servingGuidelines!.optimalTemperatures![0].temp}: ${section.servingGuidelines!.optimalTemperatures![0].description}`
                    : `${section.servingGuidelines!.optimalTemperatures![0].temp}: ${section.servingGuidelines!.optimalTemperatures![0].description}`
            }
        },
        // 3. 추천 잔
        section?.servingGuidelines?.recommendedGlass && {
            '@type': 'Question',
            name: isEn ? `What glass is best for ${cat.nameEn}?` : `${cat.nameKo}에 추천하는 잔은?`,
            acceptedAnswer: { '@type': 'Answer', text: section.servingGuidelines!.recommendedGlass! }
        },
        // 4. 분류별 FAQ (최대 3개)
        ...(section?.classifications?.slice(0, 3).map(c => ({
            '@type': 'Question',
            name: isEn ? `What is ${c.name}?` : `${c.name}(이)란? (분류/특징)`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: `${c.criteria ? c.criteria + ' — ' : ''}${c.description}`
            }
        })) || []),
        // 5. sections.faqs 직접 활용
        ...(section?.faqs?.slice(0, 3).map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer }
        })) || [])
    ].filter(Boolean)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/${lang}/contents/wiki/${slug}`,
                url: `${baseUrl}/${lang}/contents/wiki/${slug}`,
                name: title,
                description: isEn ? cat.taglineEn : cat.taglineKo,
                inLanguage: isEn ? 'en' : 'ko',
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : '홈', item: `${baseUrl}/${lang}` },
                        { '@type': 'ListItem', position: 2, name: isEn ? 'Spirits Wiki' : '주류 백과사전', item: `${baseUrl}/${lang}/contents/wiki` },
                        { '@type': 'ListItem', position: 3, name: isEn ? cat.nameEn : cat.nameKo, item: `${baseUrl}/${lang}/contents/wiki/${slug}` },
                    ]
                }
            },
            {
                '@type': 'Article',
                '@id': `${baseUrl}/${lang}/contents/wiki/${slug}#article`,
                headline: isEn
                    ? `${cat.nameEn} Guide: Everything You Need to Know`
                    : `${cat.nameKo} 완벽 가이드: 정의부터 테이스팅 방법까지`,
                description: isEn ? cat.taglineEn : cat.taglineKo,
                image: `${baseUrl}/default-og.jpg`,
                author: { '@type': 'Organization', name: 'K-Spirits Club', url: baseUrl },
                publisher: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                    url: baseUrl,
                    logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` }
                },
                datePublished: '2024-01-01',
                dateModified: new Date().toISOString().split('T')[0],
                mainEntityOfPage: `${baseUrl}/${lang}/contents/wiki/${slug}`,
                inLanguage: isEn ? 'en' : 'ko',
            },
            ...(section?.servingGuidelines?.methods && section.servingGuidelines.methods.length > 0 ? [{
                '@type': 'HowTo',
                name: isEn ? `How to Enjoy ${cat.nameEn}` : `${cat.nameKo} 최적으로 즐기는 법`,
                description: isEn ? `Professional serving guide for ${cat.nameEn}` : `${cat.nameKo}의 맛을 극대화하는 전문가 음용 가이드`,
                step: section.servingGuidelines.methods.map((m, idx) => ({
                    '@type': 'HowToStep',
                    position: idx + 1,
                    name: m.name,
                    text: m.description,
                }))
            }] : []),
            ...(faqItems.length > 0 ? [{
                '@type': 'FAQPage',
                mainEntity: faqItems
            }] : [])
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SpiritGuideLayout category={cat} lang={lang} featuredSpirits={featuredSpirits} />

            {/* Bidirectional navigation links */}
            <div className="container mx-auto max-w-3xl px-4 pb-6">
                <div className="space-y-3 pt-4 border-t border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        {isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
                    </p>
                    <ul className="flex flex-wrap gap-2 text-sm">
                        {comparisonLinks.map((comparison) => (
                            <li key={comparison.slug}>
                                <Link href={`/${lang}/contents/wiki/${comparison.slug}`} className="px-3 py-1.5 rounded-full border border-border hover:border-cyan-500/60 hover:text-cyan-500 transition-colors">
                                    {isEn ? comparison.nameEn : comparison.nameKo}
                                </Link>
                            </li>
                        ))}
                        <li><Link href={`/${lang}/contents/wiki`} className="px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/60 hover:text-emerald-500 transition-colors">{isEn ? 'All Spirit Categories — Spirits Wiki' : '주류 백과사전 전체 카테고리'}</Link></li>
                        <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/60 hover:text-emerald-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
                        <li><Link href={`/${lang}/contents/reviews`} className="px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/60 hover:text-emerald-500 transition-colors">{isEn ? 'Spirit Tasting Reviews' : '주류 시음 리뷰'}</Link></li>
                        <li><Link href={`/${lang}/contents/mbti`} className="px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/60 hover:text-emerald-500 transition-colors">{isEn ? 'Spirit MBTI Test' : '주류 MBTI 테스트'}</Link></li>
                        <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/60 hover:text-emerald-500 transition-colors">{isEn ? 'Explore Spirits' : '주류 탐색'}</Link></li>
                    </ul>
                </div>
            </div>

        </>
    )
}
