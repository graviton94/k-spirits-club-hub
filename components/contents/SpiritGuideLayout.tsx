'use client';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Clock, Layers, Droplets, FlaskConical, GlassWater, Utensils, ShoppingBag, Activity, Leaf, Thermometer, Search } from 'lucide-react'
import type { SpiritCategory } from '@/lib/constants/spirits-guide-data'
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback'
import BackButton from '@/components/ui/BackButton'

interface SpiritGuideLayoutProps {
    category: SpiritCategory
    lang: string
    /** 추천 제품 (DB에서 주입) */
    featuredSpirits?: { id: string; name: string; category: string; imageUrl?: string }[]
}

// ─── 색상 맵 ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-900 dark:text-amber-400', badge: 'bg-amber-500/10 text-black dark:text-amber-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-900 dark:text-rose-400', badge: 'bg-rose-500/10 text-black dark:text-rose-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-900 dark:text-sky-400', badge: 'bg-sky-500/10 text-black dark:text-sky-300' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-900 dark:text-cyan-400', badge: 'bg-cyan-500/10 text-black dark:text-cyan-300' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-900 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-black dark:text-emerald-300' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-900 dark:text-orange-400', badge: 'bg-orange-500/10 text-black dark:text-orange-300' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-900 dark:text-blue-400', badge: 'bg-blue-500/10 text-black dark:text-blue-300' },
    lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-900 dark:text-lime-400', badge: 'bg-lime-500/10 text-black dark:text-lime-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-900 dark:text-purple-400', badge: 'bg-purple-500/10 text-black dark:text-purple-300' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-700 dark:text-yellow-400', badge: 'bg-yellow-500/10 text-black dark:text-yellow-300' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-900 dark:text-red-400', badge: 'bg-red-500/10 text-black dark:text-red-300' },
}

// ─── 섹션 래퍼 ──────────────────────────────────────────────────────────────

function Section({
    id,
    icon,
    title,
    color,
    children,
}: {
    id?: string
    icon: React.ReactNode
    title: string
    color: string
    children: React.ReactNode
}) {
    const c = COLOR_MAP[color] ?? COLOR_MAP.amber
    return (
        <section id={id} className={`rounded-3xl border border-white/40 dark:border-white/10 bg-transparent p-6 backdrop-blur-xl shadow-sm overflow-hidden`}>
            <h2 className={`flex items-center gap-2 text-lg font-black ${c.text} mb-4 uppercase tracking-tight`}>
                {icon}
                {title}
            </h2>
            {children}
        </section>
    )
}

// ─── 준비 중 Placeholder ────────────────────────────────────────────────────

function ComingSoon({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-center py-10 rounded-xl border border-dashed border-border/40">
            <p className="text-muted-foreground/40 text-sm font-medium">
                {label} — 준비 중입니다
            </p>
        </div>
    )
}

// ─── 메인 레이아웃 ──────────────────────────────────────────────────────────

export default function SpiritGuideLayout({ category, lang, featuredSpirits = [] }: SpiritGuideLayoutProps) {
    const router = useRouter()
    const c = COLOR_MAP[category.color] ?? COLOR_MAP.amber
    const isEn = lang === 'en'
    const s = category.sections

    return (
        <article className="container mx-auto px-4 py-6 max-w-3xl pb-24 space-y-6">

            <BackButton fallbackUrl={`/${lang}/contents/wiki`} label={isEn ? 'Back to Wiki' : '위키 목록으로'} />

            {/* ── 1. Hero ── */}
            <div className={`relative rounded-2xl overflow-hidden border ${c.border} ${c.bg} p-8 text-center`}>
                {/* ambient glow */}
                <div className={`absolute inset-0 ${c.bg} blur-[60px] pointer-events-none`} />
                <div className="relative z-10">
                    <span className="text-6xl mb-4 block">{category.emoji}</span>
                    <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${c.text} mb-2`}>
                        {isEn ? category.nameEn : category.nameKo}
                    </h1>
                    {!isEn && (
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-500 mb-3">{category.nameEn}</p>
                    )}
                    <p className="text-foreground text-sm leading-relaxed max-w-md mx-auto font-medium">
                        {isEn ? category.taglineEn : category.taglineKo}
                    </p>

                    {/* ── 카테고리별 쇼핑 통합 검색 (회생 대책: 구매 연결 강화) ── */}
                    {category.slug !== 'oak-barrel' && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <a
                                href={`https://search.shopping.naver.com/search/all?query=${encodeURIComponent((isEn ? category.nameEn : category.nameKo))}`}
                                target="_blank" rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <span className="font-black">N</span> {isEn ? 'Naver Shopping' : '네이버 쇼핑'}
                            </a>
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent((isEn ? category.nameEn : category.nameKo))}&tbm=shop`}
                                target="_blank" rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <Search className="w-3 h-3 text-blue-500" /> {isEn ? 'Google Shopping' : '구글 쇼핑'}
                            </a>
                            <a
                                href={`https://dailyshot.co/m/search/result?q=${encodeURIComponent((isEn ? category.nameEn : category.nameKo))}`}
                                target="_blank" rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:border-purple-500 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <Activity className="w-3 h-3 text-purple-500" /> {isEn ? 'Dailyshot' : '데일리샷 검색'}
                            </a>
                        </div>
                    )}
                    {/* breadcrumb */}
                    <nav className="mt-4 text-xs text-zinc-500 dark:text-zinc-500 flex justify-center gap-1">
                        <Link href={`/${lang}/contents/wiki`} className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                            {isEn ? 'Spirits Wiki' : '주류 백과사전'}
                        </Link>
                        <span>/</span>
                        <span>{isEn ? category.nameEn : category.nameKo}</span>
                    </nav>
                </div>
            </div>

            {/* ── 2. 정의 ── */}
            <Section id="definition" icon={<BookOpen className="w-5 h-5" />} title={isEn ? `What is ${category.nameEn}?` : `${category.nameKo}(이)란?`} color={category.color}>
                {s?.definition ? (
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-medium">{s.definition}</p>
                ) : (
                    <ComingSoon label={isEn ? 'Definition' : '정의'} />
                )}
            </Section>

            {/* ── 3. 역사 ── */}
            <Section id="history" icon={<Clock className="w-5 h-5" />} title={isEn ? 'History & Origin' : '역사 & 원산지'} color={category.color}>
                {s?.history ? (
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-medium">{s.history}</p>
                ) : (
                    <ComingSoon label={isEn ? 'History' : '역사'} />
                )}
            </Section>

            {/* ── 4. 종류·분류 / Classifications ── */}
            <Section
                id="classifications"
                icon={<Layers className="w-5 h-5" />}
                title={isEn ? 'Types & Classification' : '등급 및 분류'}
                color={category.color}
            >
                {s?.classifications && s.classifications.length > 0 ? (
                    <dl className="space-y-4">
                        {s.classifications.map((cls) => (
                            <div key={cls.name} className="rounded-xl border border-border/30 bg-background/30 p-5">
                                <dt className="flex flex-col gap-1 mb-3">
                                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight">
                                        {isEn ? `What is ${cls.name}?` : `${cls.name}(이)란?`}
                                    </h3>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cls.criteria}</span>
                                </dt>
                                <dd className="border-t border-border/10 pt-3">
                                    <p className="text-foreground text-xs leading-relaxed mb-3 font-medium">{cls.description}</p>

                                    {cls.flavorTags && cls.flavorTags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {cls.flavorTags.map((tag) => {
                                                const bgPart = tag.color.split(' ').find(c => c.startsWith('bg-'))?.replace('/20', '') ?? 'bg-neutral-900'
                                                const shade = parseInt(bgPart.match(/(\d+)$/)?.[1] ?? '500')
                                                const textColor = shade < 500 ? 'text-gray-900' : 'text-white'
                                                return (
                                                    <span key={tag.label} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bgPart} ${textColor}`}>
                                                        {tag.label}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : s?.subtypes && s.subtypes.length > 0 ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {s.subtypes.map((sub) => (
                            <div key={sub.name} className="rounded-2xl border border-white/20 dark:border-white/5 bg-background/50 p-4 transition-all hover:bg-background/80">
                                <dt>
                                    <h3 className="font-bold text-foreground text-sm mb-1">
                                        {isEn ? `What is ${sub.name}?` : `${sub.name}(이)란?`}
                                    </h3>
                                </dt>
                                <dd>
                                    <p className="text-foreground/90 text-xs leading-relaxed font-medium">{sub.description}</p>
                                    {sub.examples && sub.examples.length > 0 && (
                                        <p className="mt-2 text-[10px] font-bold text-muted-foreground">예: {sub.examples.join(', ')}</p>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                ) : (
                    <ComingSoon label={isEn ? 'Types' : '종류'} />
                )}
            </Section>

            {/* ── 5. 맛·향 지표 (신규) ── */}
            {s?.sensoryMetrics && s.sensoryMetrics.length > 0 && (
                <Section id="sensory" icon={<Activity className="w-5 h-5" />} title={isEn ? 'Sensory Metrics' : '맛과 향 지표'} color={category.color}>
                    <dl className="grid grid-cols-1 gap-4">
                        {s?.sensoryMetrics?.map((metric) => (
                            <div key={metric.label} className="rounded-xl border border-border/30 bg-background/30 p-5 flex flex-col">
                                <dt className="flex flex-col mb-3">
                                    <span className="text-xs font-black text-muted-foreground mb-1 uppercase tracking-widest">{metric.label}</span>
                                    <span className={`text-2xl font-black ${c.text} leading-none tracking-tighter`}>{metric.value}</span>
                                </dt>
                                <dd className="border-t border-border/10 pt-3">
                                    <h3 className={`text-[10px] font-bold text-muted-foreground block mb-1 uppercase tracking-wider`}>
                                        {isEn ? `What is ${metric.metric}?` : `${metric.metric}(이)란?`}
                                    </h3>
                                    <p className="text-xs text-foreground font-medium leading-relaxed">{metric.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Section>
            )}

            {/* ── 6. 맛·향 특징 태그 ── */}
            <Section id="flavor" icon={<Droplets className="w-5 h-5" />} title={isEn ? 'Flavor Profile' : '맛 & 향 특징'} color={category.color}>
                {s?.flavorTags && s.flavorTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {s.flavorTags.map((tag) => {
                            const bgPart = tag.color.split(' ').find(c => c.startsWith('bg-'))?.replace('/20', '') ?? 'bg-neutral-900'
                            // shade 숫자 추출: 낮을수록 밝은 색. 500 미만이면 어두운 텍스트 사용
                            const shade = parseInt(bgPart.match(/(\d+)$/)?.[1] ?? '500')
                            const textColor = shade < 500 ? 'text-gray-900' : 'text-white'
                            return (
                                <span key={tag.label} className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${bgPart} ${textColor}`}>
                                    {tag.label}
                                </span>
                            )
                        })}
                    </div>
                ) : (
                    <ComingSoon label={isEn ? 'Flavor Profile' : '맛·향 특징'} />
                )}
            </Section>

            {/* ── 7. 핵심 원재료 (신규) ── */}
            {s?.coreIngredients && s.coreIngredients.length > 0 && (
                <Section id="ingredients" icon={<Leaf className="w-5 h-5" />} title={isEn ? 'Core Ingredients' : '핵심 원재료'} color={category.color}>
                    <div className="grid grid-cols-1 gap-4">
                        {s?.coreIngredients?.map((ing) => (
                            <div key={ing.name} className="flex flex-col gap-1 p-5 rounded-xl border border-border/20 bg-background/20">
                                <div className={`self-start px-2 py-0.5 rounded text-[10px] font-black ${c.badge} mb-1`}>
                                    {ing.type}
                                </div>
                                <p className="font-black text-foreground text-sm">{ing.name}</p>
                                <div className="border-t border-border/10 pt-3 mt-1">
                                    <p className="text-xs text-foreground/90 font-medium leading-relaxed">{ing.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* ── 8. 제조 방법 ── */}
            <Section id="production" icon={<FlaskConical className="w-5 h-5" />} title={isEn ? 'Production Method' : '제조 공정'} color={category.color}>
                {s?.manufacturingProcess && s.manufacturingProcess.length > 0 ? (
                    <div className="space-y-4">
                        {s.manufacturingProcess.map((proc, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${c.badge}`}>
                                        {i + 1}
                                    </div>
                                    {i < s.manufacturingProcess!.length - 1 && <div className="w-px h-full bg-border/50 my-1 min-h-[24px]" />}
                                </div>
                                <div className="pb-2 pt-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[10px] font-black ${c.text} uppercase tracking-widest`}>{proc.step}</span>
                                        <p className="font-black text-foreground text-sm">{proc.name}</p>
                                    </div>
                                    <p className="text-xs text-foreground/90 font-medium leading-relaxed">{proc.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : s?.production ? (
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-medium">{s.production}</p>
                ) : (
                    <ComingSoon label={isEn ? 'Production' : '제조 방법'} />
                )}
            </Section>

            {/* ── 9. 즐기는 법 / Serving Guide ── */}
            <Section id="serving" icon={<GlassWater className="w-5 h-5" />} title={isEn ? 'Serving Guidelines' : '최적의 음용 가이드'} color={category.color}>
                {s?.servingGuidelines ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {s.servingGuidelines.recommendedGlass && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isEn ? 'Recommended Glass:' : '추천 글라스:'}</span>
                                    <span className="text-foreground font-semibold text-sm">{s.servingGuidelines.recommendedGlass}</span>
                                </div>
                            )}
                            {s.servingGuidelines.decantingNeeded !== undefined && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isEn ? 'Decanting:' : '디캔팅 여부:'}</span>
                                    <span className="text-foreground font-semibold text-sm">
                                        {s.servingGuidelines.decantingNeeded
                                            ? (isEn ? 'Recommended' : '권장함')
                                            : (isEn ? 'Not necessary' : '필요 없음')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {s.servingGuidelines.optimalTemperatures && s.servingGuidelines.optimalTemperatures.length > 0 && (
                            <div className="border-t border-border/10 pt-5">
                                <p className="font-black text-xs text-muted-foreground uppercase mb-4 tracking-widest">{isEn ? 'Optimal Temperatures:' : '온도에 따른 향의 발현:'}</p>
                                <div className="space-y-3">
                                    {s.servingGuidelines.optimalTemperatures.map((t, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-transparent p-4">
                                            <div className={`self-start flex items-center px-2 py-1 rounded-full text-[10px] font-black ${c.badge}`}>
                                                <Thermometer className="w-3.5 h-3.5 mr-1" />
                                                {t.temp}
                                            </div>
                                            <p className="text-foreground text-xs leading-relaxed font-medium">{t.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {s.servingGuidelines.methods && s.servingGuidelines.methods.length > 0 && (
                            <div className="border-t border-border/10 pt-5">
                                <p className="font-black text-xs text-muted-foreground uppercase mb-4 tracking-widest">{isEn ? 'Recommended Methods:' : '추천 음용 방식:'}</p>
                                <div className="space-y-3">
                                    {s.servingGuidelines.methods.map((m, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-transparent p-4">
                                            <div className={`self-start flex items-center px-2 py-1 rounded-full text-[10px] font-black ${c.badge}`}>
                                                <Droplets className="w-3.5 h-3.5 mr-1" />
                                                {m.name}
                                            </div>
                                            <p className="text-foreground text-xs leading-relaxed font-medium">{m.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : s?.howToEnjoy && s.howToEnjoy.length > 0 ? (
                    <ul className="space-y-2">
                        {s.howToEnjoy.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                                <span className={`mt-0.5 text-xs font-black ${c.text}`}>·</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ComingSoon label={isEn ? 'How to Enjoy' : '즐기는 법'} />
                )}
            </Section>

            {/* ── 8. 푸드 페어링 ── */}
            <Section id="pairing" icon={<Utensils className="w-5 h-5" />} title={isEn ? 'Food Pairing' : '푸드 페어링'} color={category.color}>
                {s?.foodPairing && s.foodPairing.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {s.foodPairing.map((food) => (
                            <div key={food} className="px-4 py-2.5 rounded-xl bg-background/50 border border-white/10 text-xs font-black text-foreground flex items-center gap-2 hover:bg-background/80 transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')} animate-pulse`} />
                                {food}
                            </div>
                        ))}
                    </div>
                ) : (
                    <ComingSoon label={isEn ? 'Food Pairing' : '푸드 페어링'} />
                )}
            </Section>

            {/* ── 9. K-Spirits Club 추천 제품 ── */}
            {category.slug !== 'oak-barrel' && (
                <Section id="recommended" icon={<ShoppingBag className="w-5 h-5" />} title={isEn ? 'Featured on K-Spirits Club' : 'K-Spirits Club 추천 제품'} color={category.color}>
                    {featuredSpirits.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {featuredSpirits.map((spirit) => (
                                <div
                                    key={spirit.id}
                                    onClick={() => router.push(`/${lang}/spirits/${spirit.id}`)}
                                    className="group rounded-xl border border-border/30 bg-background/30 p-3 hover:border-border/70 hover:bg-background/60 transition-all duration-200 cursor-pointer"
                                >
                                    <img
                                        src={spirit.imageUrl || getCategoryFallbackImage(spirit.category)}
                                        alt={spirit.name}
                                        className={`w-full aspect-square object-contain mb-2 rounded-lg ${!spirit.imageUrl ? 'opacity-30 grayscale' : ''}`}
                                    />
                                    <p className="text-xs font-semibold text-foreground group-hover:text-amber-500 transition-colors line-clamp-1">
                                        {spirit.name}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-[10px] text-muted-foreground">{spirit.category}</p>
                                        <div className="flex gap-2">
                                            <a
                                                href={`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(spirit.name)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 hover:text-emerald-500 transition-colors"
                                                title="Naver Search"
                                            >
                                                <span className="text-[8px] font-black">N</span>
                                            </a>
                                            <a
                                                href={`https://www.google.com/search?q=${encodeURIComponent(spirit.name)}&tbm=shop`}
                                                target="_blank" rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 hover:text-blue-500 transition-colors"
                                                title="Google Search"
                                            >
                                                <Search className="w-2.5 h-2.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-border/40 gap-2">
                            <p className="text-zinc-900 dark:text-zinc-500 text-sm font-medium">
                                {isEn ? 'No products registered yet' : '조건에 맞는 주류를 검색해보세요!'}
                            </p>
                            <Link href={`/${lang}/explore`} className={`text-xs font-semibold ${c.text} hover:underline`}>
                                {isEn ? 'Browse all spirits →' : '전체 주류 탐색하기 →'}
                            </Link>
                        </div>
                    )}
                </Section>
            )}
        </article>
    )
}
