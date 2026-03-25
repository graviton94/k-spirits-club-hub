import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RED_WINE_GRAPES } from '@/lib/constants/wiki/grapes/index'
import { SpiritCategory } from '@/lib/constants/wiki/types'

interface RedGrapeHubProps {
    params: Promise<{ lang: string }>
}

export default async function RedGrapeHub({ params }: RedGrapeHubProps) {
    const { lang } = await params
    const isEn = lang === 'en'

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative py-16 px-4 overflow-hidden bg-gradient-to-b from-rose-950/20 to-background border-b border-rose-500/10">
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 mb-6 border border-rose-500/20">
                        <span className="text-4xl text-rose-500">🍷</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {isEn ? 'Red Wine Grape Varieties' : '레드 와인 포도 품종'}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {isEn
                            ? 'Explore the diverse world of red wine grapes, from the robust Cabernet Sauvignon to the elegant Pinot Noir.'
                            : '강인한 카베르네 소비뇽부터 우아한 피노 누아까지, 레드 와인을 만드는 다채로운 포도 품종의 세계를 탐험해보세요.'}
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RED_WINE_GRAPES.map((grape) => (
                        <Link
                            key={grape.slug}
                            href={`/${lang}/contents/wiki/${grape.slug}`}
                            className="group relative p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl">{grape.emoji}</span>
                            </div>

                            <div className="relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{grape.emoji}</span>
                                    <h2 className="text-xl font-bold group-hover:text-rose-500 transition-colors">
                                        {isEn ? grape.nameEn : grape.nameKo}
                                    </h2>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {isEn ? grape.taglineEn : grape.taglineKo}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center text-xs font-semibold text-rose-500/80 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                {isEn ? 'View Guide' : '가이드 보기'} →
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back Link */}
                <div className="mt-16 text-center">
                    <Link
                        href={`/${lang}/contents/wiki/wine`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← {isEn ? 'Back to Wine Guide' : '와인 가이드로 돌아가기'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
