import Link from 'next/link'
import { BookOpen, Clock, Layers, Droplets, FlaskConical, GlassWater, Utensils, ShoppingBag, Activity, Leaf, Thermometer } from 'lucide-react'
import type { SpiritCategory } from '@/lib/constants/spirits-guide-data'

interface SpiritGuideLayoutProps {
    category: SpiritCategory
    lang: string
    /** 추천 제품 (DB에서 주입) */
    featuredSpirits?: { id: string; name: string; category: string; imageUrl?: string }[]
}

// ─── 색상 맵 ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
    lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', text: 'text-lime-400', badge: 'bg-lime-500/20 text-lime-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
}

// ─── 섹션 래퍼 ──────────────────────────────────────────────────────────────

function Section({
    icon,
    title,
    color,
    children,
}: {
    icon: React.ReactNode
    title: string
    color: string
    children: React.ReactNode
}) {
    const c = COLOR_MAP[color] ?? COLOR_MAP.amber
    return (
        <section className={`rounded-2xl border ${c.border} bg-{color}/3 p-6 backdrop-blur-sm`}>
            <h2 className={`flex items-center gap-2 text-lg font-bold ${c.text} mb-4`}>
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
    const c = COLOR_MAP[category.color] ?? COLOR_MAP.amber
    const isEn = lang === 'en'
    const s = category.sections

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl pb-24 space-y-6">

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
                        <p className="text-sm font-semibold text-muted-foreground/60 mb-3">{category.nameEn}</p>
                    )}
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                        {isEn ? category.taglineEn : category.taglineKo}
                    </p>
                    {/* breadcrumb */}
                    <nav className="mt-4 text-xs text-muted-foreground/40 flex justify-center gap-1">
                        <Link href={`/${lang}/contents/wiki`} className="hover:text-muted-foreground transition-colors">
                            {isEn ? 'Spirits Wiki' : '주류 백과사전'}
                        </Link>
                        <span>/</span>
                        <span>{isEn ? category.nameEn : category.nameKo}</span>
                    </nav>
                </div>
            </div>

            {/* ── 2. 정의 ── */}
            <Section icon={<BookOpen className="w-5 h-5" />} title={isEn ? `What is ${category.nameEn}?` : `${category.nameKo}란?`} color={category.color}>
                {s?.definition ? (
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.definition}</p>
                ) : (
                    <ComingSoon label={isEn ? 'Definition' : '정의'} />
                )}
            </Section>

            {/* ── 3. 역사 ── */}
            <Section icon={<Clock className="w-5 h-5" />} title={isEn ? 'History & Origin' : '역사 & 원산지'} color={category.color}>
                {s?.history ? (
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.history}</p>
                ) : (
                    <ComingSoon label={isEn ? 'History' : '역사'} />
                )}
            </Section>

            {/* ── 4. 종류·분류 / Classifications ── */}
            <Section icon={<Layers className="w-5 h-5" />} title={isEn ? 'Types & Classification' : '등급 및 분류'} color={category.color}>
                {s?.classifications && s.classifications.length > 0 ? (
                    <div className="space-y-3">
                        {s.classifications.map((cls) => (
                            <div key={cls.name} className="rounded-xl border border-border/30 bg-background/30 p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-foreground text-sm">{cls.name}</p>
                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{cls.criteria}</span>
                                </div>
                                <p className="text-muted-foreground text-xs leading-relaxed">{cls.description}</p>
                            </div>
                        ))}
                    </div>
                ) : s?.subtypes && s.subtypes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {s.subtypes.map((sub) => (
                            <div key={sub.name} className="rounded-xl border border-border/30 bg-background/30 p-4">
                                <p className="font-semibold text-foreground text-sm mb-1">{sub.name}</p>
                                <p className="text-muted-foreground text-xs leading-relaxed">{sub.description}</p>
                                {sub.examples && sub.examples.length > 0 && (
                                    <p className="mt-2 text-xs text-muted-foreground/50">예: {sub.examples.join(', ')}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <ComingSoon label={isEn ? 'Types' : '종류'} />
                )}
            </Section>

            {/* ── 5. 맛·향 지표 (신규) ── */}
            {s?.sensoryMetrics && s.sensoryMetrics.length > 0 && (
                <Section icon={<Activity className="w-5 h-5" />} title={isEn ? 'Sensory Metrics' : '맛과 향 지표'} color={category.color}>
                    <div className="grid grid-cols-2 gap-3">
                        {s.sensoryMetrics.map((metric) => (
                            <div key={metric.label} className="rounded-xl border border-border/30 bg-background/30 p-4 flex flex-col items-center text-center">
                                <span className={`text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider`}>{metric.metric}</span>
                                <span className={`text-xl font-black ${c.text} mb-1 leading-none`}>{metric.value}</span>
                                <span className="text-xs font-semibold text-foreground mb-1">{metric.label}</span>
                                <p className="text-[10px] text-muted-foreground/60 leading-tight">{metric.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* ── 6. 맛·향 특징 태그 ── */}
            <Section icon={<Droplets className="w-5 h-5" />} title={isEn ? 'Flavor Profile' : '맛 & 향 특징'} color={category.color}>
                {s?.flavorTags && s.flavorTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {s.flavorTags.map((tag) => {
                            // tag.color 에서 배경 클래스만 추출 (e.g. bg-amber-500)
                            const bgClass = tag.color.split(' ').find(c => c.startsWith('bg-'))?.replace('/20', '') ?? 'bg-neutral-600'
                            return (
                                <span key={tag.label} className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${bgClass}`}>
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
                <Section icon={<Leaf className="w-5 h-5" />} title={isEn ? 'Core Ingredients' : '핵심 원재료'} color={category.color}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {s.coreIngredients.map((ing) => (
                            <div key={ing.name} className="flex gap-3 items-start p-3 rounded-lg border border-border/20 bg-background/20">
                                <div className={`px-2 py-1 rounded text-[10px] font-bold ${c.badge} whitespace-nowrap`}>
                                    {ing.type}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{ing.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{ing.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* ── 8. 제조 방법 ── */}
            <Section icon={<FlaskConical className="w-5 h-5" />} title={isEn ? 'Production Method' : '제조 공정'} color={category.color}>
                {s?.manufacturingProcess && s.manufacturingProcess.length > 0 ? (
                    <div className="space-y-4">
                        {s.manufacturingProcess.map((proc, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${c.badge}`}>
                                        {i + 1}
                                    </div>
                                    {i < s.manufacturingProcess!.length - 1 && <div className="w-px h-full bg-border/50 my-1 min-h-[24px]" />}
                                </div>
                                <div className="pb-2 pt-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[10px] font-bold ${c.text} uppercase`}>{proc.step}</span>
                                        <p className="font-semibold text-sm text-foreground">{proc.name}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{proc.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : s?.production ? (
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.production}</p>
                ) : (
                    <ComingSoon label={isEn ? 'Production' : '제조 방법'} />
                )}
            </Section>

            {/* ── 9. 즐기는 법 / Serving Guide ── */}
            <Section icon={<GlassWater className="w-5 h-5" />} title={isEn ? 'Serving Guidelines' : '최적의 음용 가이드'} color={category.color}>
                {s?.servingGuidelines ? (
                    <div className="space-y-4">
                        {s.servingGuidelines.recommendedGlass && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-foreground">{isEn ? 'Recommended Glass:' : '추천 글라스:'}</span>
                                <span className="text-muted-foreground">{s.servingGuidelines.recommendedGlass}</span>
                            </div>
                        )}
                        {s.servingGuidelines.decantingNeeded !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-foreground">{isEn ? 'Decanting:' : '디캔팅 여부:'}</span>
                                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded">
                                    {s.servingGuidelines.decantingNeeded
                                        ? (isEn ? 'Recommended' : '권장함')
                                        : (isEn ? 'Not necessary' : '필요 없음')}
                                </span>
                            </div>
                        )}
                        {s.servingGuidelines.optimalTemperatures && s.servingGuidelines.optimalTemperatures.length > 0 && (
                            <div className="mt-4">
                                <p className="font-semibold text-sm text-foreground mb-3">{isEn ? 'Optimal Temperatures:' : '온도에 따른 향의 발현:'}</p>
                                <ul className="space-y-2">
                                    {s.servingGuidelines.optimalTemperatures.map((t, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm rounded-lg border border-border/20 p-3 bg-background/20 items-center">
                                            <div className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-bold ${c.badge} whitespace-nowrap shadow-sm`}>
                                                <Thermometer className="w-3.5 h-3.5 mr-1.5" />
                                                {t.temp}
                                            </div>
                                            <span className="text-muted-foreground text-xs leading-relaxed flex-1 pt-0.5">{t.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : s?.howToEnjoy && s.howToEnjoy.length > 0 ? (
                    <ul className="space-y-2">
                        {s.howToEnjoy.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className={`mt-0.5 text-xs font-bold ${c.text}`}>·</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ComingSoon label={isEn ? 'How to Enjoy' : '즐기는 법'} />
                )}
            </Section>

            {/* ── 8. 푸드 페어링 ── */}
            <Section icon={<Utensils className="w-5 h-5" />} title={isEn ? 'Food Pairing' : '푸드 페어링'} color={category.color}>
                {s?.foodPairing && s.foodPairing.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {s.foodPairing.map((food) => (
                            <span key={food} className="px-3 py-1 rounded-full bg-background/50 border border-border/30 text-xs font-medium text-muted-foreground">
                                {food}
                            </span>
                        ))}
                    </div>
                ) : (
                    <ComingSoon label={isEn ? 'Food Pairing' : '푸드 페어링'} />
                )}
            </Section>

            {/* ── 9. K-Spirits Club 추천 제품 ── */}
            <Section icon={<ShoppingBag className="w-5 h-5" />} title={isEn ? 'Featured on K-Spirits Club' : 'K-Spirits Club 추천 제품'} color={category.color}>
                {featuredSpirits.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {featuredSpirits.map((spirit) => (
                            <Link
                                key={spirit.id}
                                href={`/${lang}/spirits/${spirit.id}`}
                                className="group rounded-xl border border-border/30 bg-background/30 p-3 hover:border-border/70 hover:bg-background/60 transition-all duration-200"
                            >
                                {spirit.imageUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={spirit.imageUrl}
                                        alt={spirit.name}
                                        className="w-full aspect-square object-contain mb-2 rounded-lg"
                                    />
                                )}
                                <p className="text-xs font-semibold text-foreground group-hover:text-white transition-colors line-clamp-2">
                                    {spirit.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground/50 mt-0.5">{spirit.category}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-border/40 gap-2">
                        <p className="text-muted-foreground/40 text-sm font-medium">
                            {isEn ? 'No products registered yet' : '등록된 제품이 없습니다'}
                        </p>
                        <Link href={`/${lang}/explore`} className={`text-xs font-semibold ${c.text} hover:underline`}>
                            {isEn ? 'Browse all spirits →' : '전체 주류 탐색하기 →'}
                        </Link>
                    </div>
                )}
            </Section>

        </div>
    )
}
