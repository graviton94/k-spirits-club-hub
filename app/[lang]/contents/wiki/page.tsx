export const runtime = 'edge';

import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data'
import GoogleAd from '@/components/ui/GoogleAd'

interface WikiHubPageProps {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: WikiHubPageProps): Promise<Metadata> {
    const { lang } = await params
    const isEn = lang === 'en'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com'

    return {
        title: isEn
            ? 'Spirits Wiki | K-Spirits Club'
            : '주류 백과사전 | K-Spirits Club',
        description: isEn
            ? 'Your complete guide to the world of spirits. Explore whisky, sake, gin, rum, tequila, and more — definitions, history, flavor profiles, and pairing tips.'
            : '위스키부터 사케, 진, 럼, 데킬라까지 — 세계의 주류를 한눈에. 정의, 역사, 맛·향 특징, 페어링 정보를 K-Spirits Club에서 확인하세요.',
        alternates: {
            languages: {
                'ko-KR': `${baseUrl}/ko/contents/wiki`,
                'en-US': `${baseUrl}/en/contents/wiki`,
            },
        },
        openGraph: {
            title: isEn ? 'Spirits Wiki | K-Spirits Club' : '주류 백과사전 | K-Spirits Club',
            description: isEn
                ? 'Your complete guide to the world of spirits.'
                : '세계의 주류를 한눈에 — 주류 백과사전',
            type: 'website',
            siteName: 'K-Spirits Club',
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

export default async function WikiHubPage({ params }: WikiHubPageProps) {
    const { lang } = await params
    const isEn = lang === 'en'

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl pb-24">

            {/* Header */}
            <div className="mb-8 relative text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <BookOpen className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                        {isEn ? 'Spirits Wiki' : '주류 백과사전'}
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase">
                        {isEn ? 'Everything about the world of spirits' : '세계의 주류를 한눈에'}
                    </p>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 relative z-10">
                {SPIRIT_CATEGORIES.map((cat) => {
                    const c = COLOR_CARD_MAP[cat.color] ?? COLOR_CARD_MAP.amber
                    return (
                        <Link
                            key={cat.slug}
                            href={`/${lang}/contents/wiki/${cat.slug}`}
                            className={`
                group relative overflow-hidden
                bg-card/40 backdrop-blur-md border border-border/50
                rounded-2xl p-4
                transition-all duration-300
                hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
                ${c.border}
              `}
                        >
                            {/* Hover gradient */}
                            <div className={`absolute inset-0 bg-linear-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col gap-2">
                                <span className="text-3xl">{cat.emoji}</span>
                                <div>
                                    <p className="font-bold text-sm text-foreground group-hover:text-white transition-colors">
                                        {isEn ? cat.nameEn : cat.nameKo}
                                    </p>
                                    {!isEn && (
                                        <p className={`text-[10px] font-semibold ${c.text} opacity-70`}>{cat.nameEn}</p>
                                    )}
                                </div>
                                <p className="text-[10px] text-muted-foreground/60 group-hover:text-white/70 transition-colors line-clamp-2 leading-relaxed">
                                    {isEn ? cat.taglineEn : cat.taglineKo}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <ChevronRight className="w-4 h-4 text-white/70" />
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
                <div className="mt-8 flex justify-center w-full">
                    <GoogleAd
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
                        format="horizontal"
                    />
                </div>
            </div>
        </div>
    )
}
