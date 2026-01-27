'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_NAME_MAP } from '@/lib/constants/categories';

interface RandomSpirit {
    id: string;
    name: string;
    category: string;
}

export default function DailyPick() {
    const [spirit, setSpirit] = useState<RandomSpirit | null>(null);
    const [loading, setLoading] = useState(true);
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
        fetchRandomSpirit();
    }, []);

    return (
        <div className="mt-10 w-full flex flex-col items-center animate-fade-in">
            {/* 1. Label: 은은한 메탈 실버 톤 */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-4 uppercase tracking-[0.25em] opacity-70">
                <Sparkles className="w-3 h-3 text-neutral-300" /> Today's Discovery
            </div>

            <div className="relative group">
                {/* 2. Glow Effect: 핑크 대신 차가운 화이트/실버의 미묘한 빛 번짐 */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-700/50 via-neutral-500/30 to-neutral-700/50 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-700 ease-out"></div>

                {/* 3. Container: 깊이감 있는 유리 질감 (Glassmorphism Dark) */}
                <div className="relative flex items-center bg-neutral-950/80 backdrop-blur-xl border border-white/10 group-hover:border-white/20 rounded-full p-1.5 pr-6 shadow-2xl transition-all duration-300">

                    {/* Refresh Button: 미니멀한 원형 버튼 */}
                    <button
                        onClick={fetchRandomSpirit}
                        disabled={loading}
                        className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-30 group/btn"
                        aria-label="Get another recommendation"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180'}`} />
                    </button>

                    {/* Spirit Info & Link */}
                    <div className="min-w-[200px] sm:min-w-[240px] ml-4">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.span
                                    key="loading"
                                    initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
                                    className="text-sm text-neutral-600 font-medium block text-center tracking-wide"
                                >
                                    Finding your destiny...
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
                                        href={`/spirits/${spirit.id}`}
                                        className="flex items-center justify-between gap-4 group/link w-full"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-left">
                                            {/* 이름: 순수한 화이트로 강조 */}
                                            <span className="text-sm font-bold text-neutral-200 tracking-tight group-hover/link:text-white transition-colors duration-300">
                                                {spirit.name}
                                            </span>

                                            {/* 카테고리: 매우 절제된 태그 스타일 */}
                                            <span className="self-start sm:self-auto text-[9px] px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-500 font-semibold uppercase tracking-wider group-hover/link:border-neutral-700 group-hover/link:text-neutral-400 transition-colors">
                                                {CATEGORY_NAME_MAP[spirit.category] || spirit.category}
                                            </span>
                                        </div>

                                        {/* 화살표: 기본적으로 숨겨져 있다가 호버 시 등장하거나 밝아짐 */}
                                        <ArrowRight className="w-4 h-4 text-white opacity-30 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 ease-out" />
                                    </Link>
                                </motion.div>
                            ) : (
                                <span className="text-sm text-neutral-600">No recommendation available.</span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}