'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Trophy,
    Play,
    ChevronRight,
    Info
} from 'lucide-react';
import metadata from "@/lib/constants/spirits-metadata.json";

// 강수 옵션
const ROUND_OPTIONS = [16, 32, 64, 128];

export default function WorldCupSelectionPage() {
    const router = useRouter();

    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(['ALL']);
    const [selectedRound, setSelectedRound] = useState<number>(32);

    // 카테고리 데이터 - metadata.json에서 동적으로 가져옴
    const legalCategories = useMemo(() => {
        const cats = Object.keys(metadata.categories).map(cat => ({
            id: cat,
            name: cat // Display name as key itself or could use mapping if exists
        }));
        return [{ id: 'ALL', name: '전체 주류' }, ...cats];
    }, []);

    // 서브 카테고리 기기 - metadata.json 구조에 맞춰 동적 생성
    const subCategories = useMemo(() => {
        if (selectedCategory === 'ALL') {
            return [{ id: 'ALL', name: '모든 종류' }];
        }

        const catData = (metadata.categories as any)[selectedCategory];
        if (!catData) return [{ id: 'ALL', name: '모든 종류' }];

        let items: string[] = [];
        if (Array.isArray(catData)) {
            items = catData;
        } else if (typeof catData === 'object') {
            // Nested structure: collect all subcategories under main categories
            Object.values(catData).forEach((subs: any) => {
                if (Array.isArray(subs)) {
                    items.push(...subs);
                }
            });
        }

        // Deduplicate and sort
        const uniqueItems = Array.from(new Set(items)).sort();
        return [{ id: 'ALL', name: `${selectedCategory} 전체` }, ...uniqueItems.map(item => ({ id: item, name: item }))];
    }, [selectedCategory]);

    const toggleSubCategory = (id: string) => {
        setSelectedSubCategories(prev => {
            if (id === 'ALL') return ['ALL'];
            const filtered = prev.filter(item => item !== 'ALL');
            if (filtered.includes(id)) {
                const next = filtered.filter(item => item !== id);
                return next.length === 0 ? ['ALL'] : next;
            } else {
                return [...filtered, id];
            }
        });
    };

    const handleStart = () => {
        const params = new URLSearchParams({
            cat: selectedCategory,
            sub: selectedSubCategories.join(','),
            round: selectedRound.toString()
        });
        router.push(`/contents/worldcup/game?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen pb-12">
            {/* 1. 상단 헤더 */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => router.push('/contents')}
                    className="p-2.5 bg-card/50 backdrop-blur-md border border-border rounded-2xl hover:bg-muted transition-all"
                >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        주류 취향 월드컵
                    </h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Tournament Settings</p>
                </div>
            </div>

            <div className="space-y-10">
                {/* 2. 메인 카테고리 선택 */}
                <section>
                    <label className="text-sm font-black text-neutral-400 mb-4 block flex items-center gap-2">
                        <div className="w-1 h-4 bg-amber-500 rounded-full" />
                        STEP 1. 주종 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {legalCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setSelectedSubCategories(['ALL']);
                                }}
                                className={`py-3 px-2 rounded-xl text-[13px] font-bold border transition-all ${selectedCategory === cat.id
                                    ? 'bg-amber-500 border-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. 서브 카테고리 선택 (애니메이션) */}
                <AnimatePresence mode="wait">
                    {subCategories.length > 1 && (
                        <motion.section
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            key={selectedCategory}
                        >
                            <label className="text-sm font-black text-neutral-400 mb-4 block flex items-center gap-2">
                                <div className="w-1 h-4 bg-neutral-600 rounded-full" />
                                STEP 2. 세부 카테고리
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {subCategories.map((sub) => {
                                    const id = typeof sub === 'string' ? sub : sub.id;
                                    const isSelected = selectedSubCategories.includes(id);
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => toggleSubCategory(id)}
                                            className={`px-4 py-2 rounded-full text-xs font-extrabold border transition-all ${isSelected
                                                ? 'bg-amber-500 border-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                                : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-600'
                                                }`}
                                        >
                                            {typeof sub === 'string' ? sub : sub.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* 4. 강수(Round) 선택 */}
                <section>
                    <label className="text-sm font-black text-neutral-400 mb-4 block flex items-center gap-2">
                        <div className="w-1 h-4 bg-amber-500 rounded-full" />
                        STEP 3. 라운드 설정
                    </label>
                    <div className="flex gap-3">
                        {ROUND_OPTIONS.map((round) => (
                            <button
                                key={round}
                                onClick={() => setSelectedRound(round)}
                                className={`flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${selectedRound === round
                                    ? 'bg-neutral-800 border-amber-500 text-amber-500 shadow-lg'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-600'
                                    }`}
                            >
                                <span className="text-lg font-black">{round}</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Round</span>
                            </button>
                        ))}
                    </div>
                    <p className="mt-3 text-[10px] text-neutral-600 flex items-center gap-1">
                        <Info className="w-3 h-3" /> 선택한 조건의 술이 강수보다 적을 경우 자동으로 최대치로 조정됩니다.
                    </p>
                </section>

                {/* 5. 시작 버튼 (본문 이동) */}
                <section className="pt-4">
                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        <span className="text-lg">월드컵 시작하기</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-4 text-center text-[10px] text-neutral-500 font-medium">
                        ※ 선택한 조건에 맞는 술이 부족할 경우 게임이 시작되지 않을 수 있습니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
