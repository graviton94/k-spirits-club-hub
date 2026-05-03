'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { CATEGORY_NAME_MAP } from '@/lib/constants/categories';
import metadata from '@/lib/constants/spirits-metadata.json';
import { chips, surfaces, typography } from '@/lib/design/patterns';
import type { SpiritSearchIndex } from '@/lib/db/schema';

interface RandomSpirit {
    id: string;
    name: string;
    nameEn?: string;
    category: string;
}

function mapIndexToRandomSpirit(item: SpiritSearchIndex | null | undefined): RandomSpirit | null {
    if (!item) return null;

    return {
        id: item.i,
        name: item.n,
        nameEn: item.en || undefined,
        category: item.c,
    };
}


const UI_TEXT = {
    ko: {
        label: "오늘의 발견",
        finding: "당신의 술을 찾는 중...",
        noInfo: "추천 정보가 없습니다.",
    },
    en: {
        label: "Today's Discovery",
        finding: "Finding your destiny...",
        noInfo: "No recommendation available.",
    }
};

export default function DailyPick({ lang: propLang, initialSpirit }: { lang?: string; initialSpirit?: SpiritSearchIndex | null }) {
    const pathname = usePathname() || "";
    const lang = propLang || (pathname.split('/')[1] === 'en' ? 'en' : 'ko');

    const [spirit, setSpirit] = useState<RandomSpirit | null>(() => mapIndexToRandomSpirit(initialSpirit));
    const [loading, setLoading] = useState(!initialSpirit);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchRandomSpirit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/spirits/random', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setSpirit(data);
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to fetch daily pick', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialSpirit) {
            fetchRandomSpirit();
        }
    }, [initialSpirit]);

    const t = UI_TEXT[lang === 'en' ? 'en' : 'ko'];

    return (
        <div className="mt-10 w-full flex flex-col items-center animate-fade-in">
            <div className="relative group w-full max-w-md pt-6">
                <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 shadow-xl backdrop-blur-xl ${surfaces.hero}`}>
                        <span className={`${chips.primarySm} !rounded-full !px-2.5 !py-1 flex items-center gap-1.5 whitespace-nowrap`}>
                            <Sparkles className="w-3 h-3" />
                            {t.label}
                        </span>
                        <span className={`${typography.eyebrow} !text-foreground/80 whitespace-nowrap`}>
                            {lang === 'en' ? 'Find your palate.' : '당신의 취향을 찾아보세요.'}
                        </span>
                    </div>
                </div>

                {/* 2. Glow Effect: 핑크 대신 차가운 화이트/실버의 미묘한 빛 번짐 */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 via-accent/15 to-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-700 ease-out"></div>

                {/* 3. Container: 깊이감 있는 유리 질감 (Glassmorphism Dark) */}
                <div className={`relative flex w-full items-center rounded-full p-1.5 pr-3 shadow-2xl transition-all duration-300 group-hover:border-primary/30 min-[380px]:pr-6 ${surfaces.panel}`}>

                    {/* Refresh Button: 미니멀한 원형 버튼 */}
                    <button
                        onClick={fetchRandomSpirit}
                        disabled={loading}
                        className="p-3 rounded-full bg-muted/40 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all active:scale-95 disabled:opacity-30 group/btn"
                        aria-label="Get another recommendation"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180'}`} />
                    </button>

                    {/* Spirit Info & Link */}
                    <div className="ml-3 min-w-0 flex-1 min-[380px]:ml-4">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.span
                                    key="loading"
                                    initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
                                    className="text-sm text-muted-foreground font-medium block text-center tracking-wide"
                                >
                                    {t.finding}
                                </motion.span>
                            ) : spirit ? (
                                <motion.div
                                    key={spirit.id}
                                    initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <Link
                                        href={`/${lang}/spirits/${spirit.id}`}
                                        className="group/link flex w-full items-center justify-between gap-3 min-[380px]:gap-4"
                                    >
                                        <div className="min-w-0 flex flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
                                            {/* 이름: 순수한 화이트로 강조 */}
                                            <span className="truncate text-sm font-bold tracking-tight text-foreground/90 transition-colors duration-300 group-hover/link:text-foreground">
                                                {lang === 'en' ? (spirit.nameEn || spirit.name) : spirit.name}
                                            </span>


                                            {/* 카테고리: 매우 절제된 태그 스타일 */}
                                            <span className={`self-start sm:self-auto ${chips.subtleSm} !px-1.5 !py-0.5 !rounded group-hover/link:border-primary/30 group-hover/link:text-primary transition-colors`}>
                                                {lang === 'en' ? ((metadata as any).display_names_en?.[spirit.category] || spirit.category) : (CATEGORY_NAME_MAP[spirit.category] || spirit.category)}
                                            </span>
                                        </div>

                                        {/* 화살표: 기본적으로 숨겨져 있다가 호버 시 등장하거나 밝아짐 */}
                                        <ArrowRight className="w-4 h-4 text-foreground opacity-30 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 ease-out" />
                                    </Link>
                                </motion.div>
                            ) : (
                                <span className="text-sm text-muted-foreground">{t.noInfo}</span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
