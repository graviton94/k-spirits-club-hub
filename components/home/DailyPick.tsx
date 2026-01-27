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
        <div className="mt-8 w-full flex flex-col items-center">
            <div className="flex items-center gap-2 text-[10px] font-black text-pink-500 mb-3 uppercase tracking-[0.2em] opacity-80">
                <Sparkles className="w-3 h-3" /> Today's Discovery
            </div>

            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/5 rounded-full p-1.5 pr-5">

                    {/* Refresh Button */}
                    <button
                        onClick={fetchRandomSpirit}
                        disabled={loading}
                        className="p-2.5 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all active:scale-95 disabled:opacity-50"
                        aria-label="Get another recommendation"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Spirit Info & Link */}
                    <div className="min-w-[180px] sm:min-w-[220px] ml-3">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.span
                                    key="loading"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-sm text-neutral-500 font-medium block text-center"
                                >
                                    운명의 조각을 찾는 중...
                                </motion.span>
                            ) : spirit ? (
                                <motion.div
                                    key={spirit.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Link
                                        href={`/spirits/${spirit.id}`}
                                        className="flex items-center justify-between gap-3 group/link"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-white tracking-tight group-hover/link:text-pink-400 transition-colors">
                                                {spirit.name}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-neutral-400 font-bold uppercase tracking-wider">
                                                {CATEGORY_NAME_MAP[spirit.category] || spirit.category}
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-pink-500 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                                    </Link>
                                </motion.div>
                            ) : (
                                <span className="text-sm text-neutral-500">정보를 불러올 수 없습니다.</span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
