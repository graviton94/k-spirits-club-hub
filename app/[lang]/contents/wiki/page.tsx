import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data'
import GoogleAd from '@/components/ui/GoogleAd'
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url'

interface WikiHubPageProps {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: WikiHubPageProps): Promise<Metadata> {
    const { lang } = await params
    const isEn = lang === 'en'

    const canonicalUrl = getCanonicalUrl(`/${lang}/contents/wiki`)
    const hreflangAlternates = getHreflangAlternates('/contents/wiki')

    return {
        title: isEn
            ? 'Spirits Wiki — Complete Guide to Whisky, Soju, Cheongju, Sake & More'
            : '주류 백과사전 — 위스키, 소주, 청주, 사케, 막걸리 완벽 가이드',
        description: isEn
            ? 'Your complete guide to the world of spirits. Explore whisky, cheongju, sake, gin, rum, tequila, and comparison guides — definitions, history, flavor profiles, and pairing tips.'
            : '위스키부터 청주, 사케, 진, 럼, 데킬라와 비교 가이드까지 — 정의, 역사, 맛·향 특징, 페어링 정보를 K-Spirits Club에서 확인하세요.',
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangAlternates,
        },
        openGraph: {
            title: isEn ? 'Spirits Wiki | K-Spirits Club' : '주류 백과사전 | K-Spirits Club',
            description: isEn
                ? 'Your complete guide to the world of spirits.'
                : '세계의 주류를 한눈에 — 주류 백과사전',
            type: 'website',
            siteName: 'K-Spirits Club',
            url: canonicalUrl,
        },
    }
}

const COLOR_CARD_MAP: Record<string, { gradient: string; text: string; border: string }> = {
    amber: { gradient: 'from-amber-500/20 to-orange-600/20', text: 'text-amber-400', border: 'group-hover:border-amber-500/50' },
    rose: { gradient: 'from-rose-500/20 to-pink-600/20', text: 'text-rose-400', border: 'group-hover:border-rose-500/50' },
    sky: { gradient: 'from-sky-500/20 to-cyan-600/20', text: 'text-sky-400', border: 'group-hover:border-sky-500/50' },
    cyan: { gradient: 'from-cyan-500/20 to-teal-600/20', text: 'text-cyan-400', border: 'group-hover:border-cyan-500/50' },
    emerald: { gradient: 'from-emerald-500/20 to-green-600/20', text: 'text-emerald-400', border: 'group-hover:border-emerald-500/50' },
    orange: { gradient: 'from-orange-500/20 to-amber-600/20', text: 'text-orange-400', border: 'group-hover:border-orange-500/50' },
    blue: { gradient: 'from-blue-500/20 to-indigo-600/20', text: 'text-blue-400', border: 'group-hover:border-blue-500/50' },
    lime: { gradient: 'from-lime-500/20 to-green-600/20', text: 'text-lime-400', border: 'group-hover:border-lime-500/50' },
    purple: { gradient: 'from-purple-500/20 to-violet-600/20', text: 'text-purple-400', border: 'group-hover:border-purple-500/50' },
    yellow: { gradient: 'from-yellow-500/20 to-amber-600/20', text: 'text-yellow-400', border: 'group-hover:border-yellow-500/50' },
    red: { gradient: 'from-red-500/20 to-rose-600/20', text: 'text-red-400', border: 'group-hover:border-red-500/50' },
}

const COMPARISON_SLUGS = ['yakju-vs-cheongju', 'cheongju-vs-sake', 'single-malt-vs-blended']

export default async function WikiHubPage({ params }: WikiHubPageProps) {
    const { lang } = await params
    const isEn = lang === 'en'
    const gridCategories = SPIRIT_CATEGORIES.filter((category) => !category.hideFromWikiHubGrid)
    const comparisonCategories = COMPARISON_SLUGS
        .map((slug) => SPIRIT_CATEGORIES.find((category) => category.slug === slug))
        .filter((category): category is NonNullable<typeof category> => Boolean(category))

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl pb-24">

            <BackButton fallbackUrl={`/${lang}/contents`} label={isEn ? 'Back' : '뒤로가기'} />

            {/* Header */}
            <div className="mb-14 relative text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-center">
                         <div className="p-4 bg-card/20 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl">
                            <BookOpen className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-brand-gradient bg-clip-text text-transparent uppercase italic leading-none">
                            {isEn ? 'Spirits Wiki' : '주류 백과사전'}
                        </h1>
                        <p className="text-[10px] md:text-sm font-black text-muted-foreground/40 tracking-[0.5em] uppercase flex items-center justify-center gap-3">
                            <span className="w-12 h-px bg-primary/20" />
                            {isEn ? 'Universal Spirits Compendium' : '글로벌 주류 지식의 모든 것'}
                            <span className="w-12 h-px bg-primary/20" />
                        </p>
                    </div>
                </div>
            </div>

            {/* Localized intro copy for SEO */}
            <div className="mb-8 max-w-2xl mx-auto text-center px-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {isEn
                        ? 'The K-Spirits Club Spirits Wiki is your authoritative reference for understanding and exploring the world of alcoholic beverages. Each category guide covers definition and origin, production methods, flavor profiles, optimal serving temperatures, food pairing recommendations, key brands, and high-intent comparison topics such as Cheongju vs Sake or Single Malt vs Blended.'
                        : 'K-Spirits Club 주류 백과사전은 세계의 주류를 이해하고 탐험하기 위한 전문 레퍼런스입니다. 각 카테고리 가이드는 정의와 역사, 제조 공정, 풍미 프로파일, 최적 시음 온도, 음식 페어링 추천, 주요 브랜드를 담고 있으며, 청주 vs 사케나 싱글 몰트 vs 블렌디드 같은 비교 가이드도 함께 제공합니다.'}
                </p>
            </div>

            {/* In-Feed Ad: between intro copy and category grid */}
            {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT && (
                <div className="mb-8 flex justify-center w-full overflow-hidden">
                    <GoogleAd
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT}
                        format="auto"
                        responsive={true}
                        style={{ display: 'block', width: '100%' }}
                    />
                </div>
            )}

            <div className="mb-8 rounded-2xl border border-border/40 bg-card/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    {isEn ? 'Popular Comparison Guides' : '인기 비교 가이드'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {comparisonCategories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/${lang}/contents/wiki/${category.slug}`}
                            className="px-3 py-1.5 rounded-full border border-border hover:border-cyan-500/60 hover:text-cyan-500 transition-colors text-sm"
                        >
                            {isEn ? category.nameEn : category.nameKo}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                {gridCategories.map((cat) => {
                    return (
                        <Link
                            key={cat.slug}
                            href={`/${lang}/contents/wiki/${cat.slug}`}
                            className="group relative overflow-hidden bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-8 transition-all duration-700 hover:scale-[1.05] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] hover:border-primary/30"
                        >
                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="text-5xl group-hover:scale-110 transition-transform duration-700 block grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100">
                                    {cat.emoji}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors italic uppercase tracking-tighter">
                                        {isEn ? cat.nameEn : cat.nameKo}
                                    </h3>
                                    {!isEn && (
                                        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest leading-none">{cat.nameEn}</p>
                                    )}
                                </div>
                                <p className="text-[10px] md:text-xs text-muted-foreground/50 group-hover:text-foreground/70 transition-colors line-clamp-3 leading-relaxed font-medium">
                                    {isEn ? cat.taglineEn : cat.taglineKo}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                                <ChevronRight className="w-6 h-6 text-primary" />
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center relative z-10">
                <p className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-widest">
                    {isEn ? 'More categories coming soon' : '더 많은 카테고리가 추가될 예정입니다'}
                </p>
            </div>
        </div>
    )
}
