export const runtime = 'edge';
export const revalidate = 0; // Force fetching dynamically so latest spirits always show

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { SPIRIT_CATEGORIES, getSpiritCategory } from '@/lib/constants/spirits-guide-data'
import { db } from '@/lib/db/index'
import SpiritGuideLayout from '@/components/contents/SpiritGuideLayout'
import GoogleAd from '@/components/ui/GoogleAd'

interface CategoryPageProps {
    params: Promise<{ lang: string; category: string }>
}


export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { lang, category: slug } = await params
    const cat = getSpiritCategory(slug)
    if (!cat) return { title: 'Not Found' }

    const isEn = lang === 'en'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const name = isEn ? cat.nameEn : cat.nameKo
    const tagline = isEn ? cat.taglineEn : cat.taglineKo
    const definition = cat.sections?.definition || tagline

    // 롱테일 키워드 추출 (분류 이름, 맛 태그 등)
    const keywords = [
        name,
        slug,
        ...(cat.sections?.classifications?.map(c => c.name) || []),
        ...(cat.sections?.flavorTags?.map(t => t.label) || []),
        isEn ? 'Spirits Wiki' : '주류 백과사전',
        isEn ? 'Drinking Temperature' : '시음 온도',
        isEn ? 'Food Pairing' : '푸드 페어링',
    ]

    const title = isEn
        ? `Everything about ${cat.nameEn}: History, Serving, & Food Pairing | K-Spirits Club Wiki`
        : `${cat.nameKo} 완벽 가이드: 역사, 종류, 최적 시음 온도 및 안주 추천 | 주류 백과사전`

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
                step: cat.sections?.servingGuidelines?.methods?.map((m, idx) => ({
                    '@type': 'HowToStep',
                    position: idx + 1,
                    name: m.name,
                    text: m.description,
                })) || [],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    cat.sections?.servingGuidelines?.optimalTemperatures?.[0] && {
                        '@type': 'Question',
                        name: isEn ? `What is the best temperature for ${cat.nameEn}?` : `${cat.nameKo}의 최적 시음 온도는?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: cat.sections.servingGuidelines.optimalTemperatures[0].description
                        }
                    },
                    cat.sections?.servingGuidelines?.recommendedGlass && {
                        '@type': 'Question',
                        name: isEn ? `What glass should I use for ${cat.nameEn}?` : `${cat.nameKo}를 마실 때 추천하는 잔은?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: cat.sections.servingGuidelines.recommendedGlass
                        }
                    }
                ].filter(Boolean)
            }
        ]
    }

    return {
        title,
        description,
        keywords: keywords.join(', '),
        alternates: {
            languages: {
                'ko-KR': `${baseUrl}/ko/contents/wiki/${slug}`,
                'en-US': `${baseUrl}/en/contents/wiki/${slug}`,
            },
        },
        openGraph: {
            title: isEn
                ? `${cat.nameEn} — Professional Spirits Wiki | K-Spirits Club`
                : `${cat.nameKo} - 전문가용 주류 백과사전 | K-Spirits Club`,
            description: tagline,
            type: 'article',
            siteName: 'K-Spirits Club',
            url: `${baseUrl}/${lang}/contents/wiki/${slug}`,
        },
        other: {
            'application/ld+json': JSON.stringify(jsonLd),
        },
    }
}

export default async function SpiritWikiCategoryPage({ params }: CategoryPageProps) {
    const { lang, category: slug } = await params
    const cat = getSpiritCategory(slug)
    if (!cat) notFound()

    // 해당 카테고리의 추천 제품 조회 (최대 6개)
    let featuredSpirits: { id: string; name: string; category: string; imageUrl?: string }[] = []

    if (slug !== 'oak-barrel') {
        const categoryMap: Record<string, string> = {
            'single-malt': '위스키',
            'blended-whisky': '위스키',
            'cognac': '브랜디',
            'brandy': '브랜디',
            'champagne': '과실주',
            'red-wine': '과실주',
            'white-wine': '과실주',
            'wine': '과실주',
            'gin': '일반증류주',
            'vodka': '일반증류주',
            'rum': '일반증류주',
            'tequila': '일반증류주',
            'mezcal': '일반증류주',
            'baijiu': '일반증류주',
            'soju-distilled': '소주',
            'soju-diluted': '소주',
            'shochu': '소주',
            'yakju': '약주',
            'sake': '청주',
            'makgeolli': '탁주',
            'beer': '맥주',
            'liqueur': '리큐르'
        };

        const dbCategory = categoryMap[slug];

        try {
            if (dbCategory) {
                // Now using direct, robust fetch logic ensuring updatedAt DESC and isPublished = true
                const result = await db.getLatestFeatured(dbCategory, 6)
                featuredSpirits = result.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    imageUrl: s.imageUrl,
                }))
            }

            // 만약 결과가 없으면 전체에서 최신 순으로 6개 (회생 대책 - 임시로 아무 카테고리나 가져오되 isPublished 조건 추가)
            if (featuredSpirits.length === 0) {
                const fallback = await db.getSpirits({ status: 'PUBLISHED', isPublished: true }, { page: 1, pageSize: 6 })
                featuredSpirits = fallback.data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    imageUrl: s.imageUrl,
                }))
            }
        } catch {
            // 무시
        }
    }

    return (
        <>
            <SpiritGuideLayout category={cat} lang={lang} featuredSpirits={featuredSpirits} />

            {/* 하단 수익화 영역 (수수료 회생 대책) */}
            <div className="container mx-auto max-w-3xl px-4 pb-12">
                <div className="rounded-2xl border border-dashed border-border/60 p-4 bg-muted/5">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest text-center mb-4">Advertisement</p>
                    {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
                        <GoogleAd
                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                            slot="3222851412" // Wiki 전용 하단 슬롯 (임시 ID)
                            format="auto"
                            responsive={true}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
