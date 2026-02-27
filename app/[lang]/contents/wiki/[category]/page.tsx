export const runtime = 'edge';

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { SPIRIT_CATEGORIES, getSpiritCategory } from '@/lib/constants/spirits-guide-data'
import { db } from '@/lib/db/index'
import SpiritGuideLayout from '@/components/contents/SpiritGuideLayout'

interface CategoryPageProps {
    params: Promise<{ lang: string; category: string }>
}

// 모든 카테고리 slug를 정적으로 사전 생성 (ko + en)
export async function generateStaticParams() {
    return SPIRIT_CATEGORIES.flatMap((cat) => [
        { lang: 'ko', category: cat.slug },
        { lang: 'en', category: cat.slug },
    ])
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { lang, category: slug } = await params
    const cat = getSpiritCategory(slug)
    if (!cat) return { title: 'Not Found' }

    const isEn = lang === 'en'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'
    const name = isEn ? cat.nameEn : cat.nameKo
    const tagline = isEn ? cat.taglineEn : cat.taglineKo

    return {
        title: isEn
            ? `${cat.nameEn} — What is it? History, Types & Pairing | K-Spirits Club`
            : `${cat.nameKo}란? 정의, 역사, 종류, 페어링 정보 | K-Spirits Club`,
        description: tagline,
        alternates: {
            languages: {
                'ko-KR': `${baseUrl}/ko/contents/wiki/${slug}`,
                'en-US': `${baseUrl}/en/contents/wiki/${slug}`,
            },
        },
        openGraph: {
            title: isEn
                ? `${cat.nameEn} — Spirits Wiki | K-Spirits Club`
                : `${cat.nameKo} 백과사전 | K-Spirits Club`,
            description: tagline,
            type: 'article',
            siteName: 'K-Spirits Club',
        },
        // JSON-LD: Article 스키마 (검색결과 기사 Rich Snippet)
        other: {
            'application/ld+json': JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: isEn
                    ? `${cat.nameEn}: Definition, History, Types and Food Pairing`
                    : `${cat.nameKo}란? 정의, 역사, 종류, 페어링`,
                name,
                description: tagline,
                url: `${baseUrl}/${lang}/contents/wiki/${slug}`,
                publisher: {
                    '@type': 'Organization',
                    name: 'K-Spirits Club',
                    url: baseUrl,
                },
                inLanguage: isEn ? 'en' : 'ko',
            }),
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
