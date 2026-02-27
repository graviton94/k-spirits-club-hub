export const runtime = 'edge';

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { SPIRIT_CATEGORIES, getSpiritCategory } from '@/lib/constants/spirits-guide-data'
import { db } from '@/lib/db/index'
import SpiritGuideLayout from '@/components/contents/SpiritGuideLayout'

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
        ? `${cat.nameEn} Wiki: History, Types, Serving Temperature & Pairing | K-Spirits Club`
        : `${cat.nameKo} 백과사전: 역사, 등급, 종류, 최적 온도 및 음용법 | K-Spirits Club`

    const description = definition.length > 155
        ? definition.substring(0, 152) + '...'
        : definition

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
    // dbCategories가 정의된 경우에만 조회, 없으면 빈 배열
    let featuredSpirits: { id: string; name: string; category: string; imageUrl?: string }[] = []
    if (cat.sections?.dbCategories && cat.sections.dbCategories.length > 0) {
        try {
            const result = await db.getSpirits(
                { category: cat.sections.dbCategories[0], status: 'PUBLISHED' },
                { page: 1, pageSize: 6 },
            )
            featuredSpirits = result.data.map((s: any) => ({
                id: s.id,
                name: s.name,
                category: s.category,
                imageUrl: s.imageUrl,
            }))
        } catch {
            // 조회 실패해도 페이지는 정상 렌더링
        }
    }

    return <SpiritGuideLayout category={cat} lang={lang} featuredSpirits={featuredSpirits} />
}
