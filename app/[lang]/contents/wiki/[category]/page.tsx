export const runtime = 'edge';
export const revalidate = 0; // Force fetching dynamically so latest spirits always show

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { SPIRIT_CATEGORIES, getSpiritCategory } from '@/lib/constants/spirits-guide-data'
import { db } from '@/lib/db/index'
import SpiritGuideLayout from '@/components/contents/SpiritGuideLayout'
import { redirect } from 'next/navigation'
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url'

const KO_TO_EN_MAP: Record<string, string> = {
    '소주-가이드': 'soju-guide',
    '막걸리-가이드': 'makgeolli-guide',
    '한국-위스키-증류소': 'korean-whisky',
    '전통주-종류-정리': 'korean-traditional-spirits',
    '도수별-증류주': 'korean-spirits-by-abv',
};

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

    // 복합 JSON-LD 구성
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/${lang}/contents/wiki/${slug}`,
                url: `${baseUrl}/${lang}/contents/wiki/${slug}`,
                name: title,
                description: tagline,
                inLanguage: isEn ? 'en' : 'ko',
            },
            {
                '@type': 'Article',
                headline: isEn
                    ? `${cat.nameEn} Guide: Everything You Need to Know`
                    : `${cat.nameKo} 완벽 가이드: 정의부터 테이스팅 방법까지`,
                description: tagline,
                image: `${baseUrl}/images/wiki/${slug}-og.jpg`, // 존재한다고 가정하거나 기본 이미지 사용
                author: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                    logo: {
                        '@type': 'ImageObject',
                        url: `${baseUrl}/logo.png`,
                    },
                },
                datePublished: '2024-01-01', // 초기 게시일
                dateModified: new Date().toISOString().split('T')[0],
            },
            {
                '@type': 'HowTo',
                name: isEn ? `How to Enjoy ${cat.nameEn}` : `${cat.nameKo} 최적으로 즐기는 법`,
                description: isEn ? `Professional serving guide for ${cat.nameEn}` : `${cat.nameKo}의 맛을 극대화하는 전문가 음용 가이드`,
                step: section?.servingGuidelines?.methods?.map((m, idx) => ({
                    '@type': 'HowToStep',
                    position: idx + 1,
                    name: m.name,
                    text: m.description,
                })) || [],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    section?.servingGuidelines?.optimalTemperatures?.[0] && {
                        '@type': 'Question',
                        name: isEn ? `What is the best temperature for ${cat.nameEn}?` : `${cat.nameKo}의 최적 시음 온도는?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: section.servingGuidelines.optimalTemperatures[0].description
                        }
                    },
                    section?.servingGuidelines?.recommendedGlass && {
                        '@type': 'Question',
                        name: isEn ? `What glass should I use for ${cat.nameEn}?` : `${cat.nameKo}를 마실 때 추천하는 잔은?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: section.servingGuidelines.recommendedGlass
                        }
                    },
                    ...(section?.classifications?.map(c => ({
                        '@type': 'Question',
                        name: isEn ? `What is ${c.name}?` : `${c.name}(이)란? (분류/특징)`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: `${c.criteria ? c.criteria + ' - ' : ''}${c.description}`
                        }
                    })) || []),
                    ...(section?.sensoryMetrics?.map(m => ({
                        '@type': 'Question',
                        name: isEn ? `What is ${m.label} (${m.metric})?` : `${m.metric} (${m.label})(이)란?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: m.description
                        }
                    })) || [])
                ].filter(Boolean)
            }
        ]
    }

    const ogImageUrl = `${baseUrl}/default-og.jpg`;

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

    const cat = getSpiritCategory(decodedSlug) || getSpiritCategory(slug)

    if (!cat) {
        notFound()
    }

    const isEn = lang === 'en'
    const section = isEn ? (cat.sectionsEn || cat.sections) : cat.sections
    const dbCategories = section?.dbCategories

    // 해당 카테고리의 추천 제품 조회 (최대 6개)
    let featuredSpirits: { id: string; name: string; category: string; imageUrl?: string }[] = []

    if (slug !== 'oak-barrel' && dbCategories && dbCategories.length > 0) {
        try {
            // Use the first category in the list for featured spirits
            const result = await db.getLatestFeatured(dbCategories[0], 6)
            featuredSpirits = result.map((s: any) => ({
                id: s.id,
                name: s.name,
                category: s.category,
                imageUrl: s.imageUrl,
            }))
        } catch {
            // 무시
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const title = isEn
        ? `${cat.nameEn} Guide — Spirits Wiki | K-Spirits Club`
        : `${cat.nameKo} 가이드 — 주류 백과사전 | K-Spirits Club`

    // 복합 JSON-LD 구성
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
            },
            {
                '@type': 'Article',
                headline: isEn
                    ? `${cat.nameEn} Guide: Everything You Need to Know`
                    : `${cat.nameKo} 완벽 가이드: 정의부터 테이스팅 방법까지`,
                description: isEn ? cat.taglineEn : cat.taglineKo,
                image: `${baseUrl}/default-og.jpg`,
                author: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                },
                datePublished: '2024-01-01',
                dateModified: new Date().toISOString().split('T')[0],
            },
            {
                '@type': 'HowTo',
                name: isEn ? `How to Enjoy ${cat.nameEn}` : `${cat.nameKo} 최적으로 즐기는 법`,
                description: isEn ? `Professional serving guide for ${cat.nameEn}` : `${cat.nameKo}의 맛을 극대화하는 전문가 음용 가이드`,
                step: section?.servingGuidelines?.methods?.map((m, idx) => ({
                    '@type': 'HowToStep',
                    position: idx + 1,
                    name: m.name,
                    text: m.description,
                })) || [],
            }
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
