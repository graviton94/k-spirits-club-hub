'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Trophy,
    Play,
    ChevronRight,
    Info,
    Loader2
} from 'lucide-react';
import GoogleAd from '@/components/ui/GoogleAd';
import { getSubcategoriesAction } from '@/app/[lang]/actions/spirits';

// 강수 옵션
const ROUND_OPTIONS = [8, 16, 32, 64];

interface WorldCupSelectionPageProps {
    initialCategories: { ko: string, en: string | null | undefined }[];
}

export default function WorldCupSelectionPage({ initialCategories }: WorldCupSelectionPageProps) {
    const router = useRouter();

    const params = useParams();
    const lang = params?.lang as string || 'ko';
    const isEn = lang === 'en';

    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(['ALL']);
    const [selectedRound, setSelectedRound] = useState<number>(16);
    const [subCategories, setSubCategories] = useState<{ id: string, name: string }[]>([
        { id: 'ALL', name: isEn ? 'All Types' : '모든 종류' }
    ]);
    const [isLoadingSubs, setIsLoadingSubs] = useState(false);

    // 1. 카테고리 데이터 가공
    const legalCategories = useMemo(() => {
        const cats = initialCategories.map(cat => ({
            id: cat.en || cat.ko, // 논리 매칭용 ID (영문 선호)
            name: isEn ? (cat.en || cat.ko) : cat.ko
        }));
        return [{ id: 'ALL', name: isEn ? 'All Spirits' : '전체 주류' }, ...cats];
    }, [initialCategories, isEn]);

    // 2. 카테고리 선택 시 서브카테고리 동적 로드
    const handleCategorySelect = async (catId: string) => {
        setSelectedCategory(catId);
        setSelectedSubCategories(['ALL']);
        
        if (catId === 'ALL') {
            setSubCategories([{ id: 'ALL', name: isEn ? 'All Types' : '모든 종류' }]);
            return;
        }

        setIsLoadingSubs(true);
        try {
            const subs = await getSubcategoriesAction(catId);
            const formattedSubs = subs.map(sub => ({
                id: sub,
                name: sub // DB에는 현재 한글/영문 구분이 없으므로 그대로 사용
            }));
            
            const categoryName = legalCategories.find(c => c.id === catId)?.name || catId;
            const allLabel = isEn ? `${categoryName} All` : `${categoryName} 전체`;
            
            setSubCategories([
                { id: 'ALL', name: allLabel },
                ...formattedSubs
            ]);
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
        } finally {
            setIsLoadingSubs(false);
        }
    };

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
        const queryParams = new URLSearchParams({
            cat: selectedCategory,
            sub: selectedSubCategories.join(','),
            round: selectedRound.toString()
        });
        router.push(`/${lang}/contents/worldcup/game?${queryParams.toString()}`);
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 min-h-screen pb-24 selection:bg-primary/30">
            {/* 🛡️ Institutional Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 border-b border-border/50 pb-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="capsule-premium">TOURNAMENT</span>
                        <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">Configuration Mode</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9]">
                        {isEn ? "Spirit World Cup" : "주류 취향 월드컵"}
                    </h1>
                    <p className="text-foreground/40 text-sm font-medium">
                        {isEn 
                            ? "Configure the tournament parameters to identify your ultimate palate profile." 
                            : "최고의 취향을 가려내기 위한 기관 공식 토너먼트 파라미터를 설정하십시오."}
                    </p>
                </div>
                
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/30 transition-all font-black text-xs uppercase tracking-widest"
                >
                    <ChevronLeft className="w-4 h-4" /> {isEn ? "Abort" : "취소"}
                </button>
            </div>

            <div className="space-y-16">
                {/* 🏰 Step 1: Category Intelligence */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl font-black text-lg italic">01</div>
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">{isEn ? "Primary Classification" : "주종 선택"}</h3>
                            <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest italic">{isEn ? "Step One" : "첫 번째 단계"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {legalCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`group relative py-5 px-4 rounded-2xl text-sm font-black border transition-all overflow-hidden
                                    ${selectedCategory === cat.id
                                        ? 'bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-[1.02]'
                                        : 'bg-card/40 border-border/40 text-foreground/50 hover:border-primary/30 hover:bg-card/60'
                                    }`}
                            >
                                <span className="relative z-10 uppercase tracking-tighter italic">{cat.name}</span>
                                {selectedCategory === cat.id && (
                                     <motion.div 
                                        layoutId="activeCategory"
                                        className="absolute inset-x-0 bottom-0 h-1 bg-white/30" 
                                     />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 🧬 Step 2: Sub-Classification (Conditional) */}
                <AnimatePresence mode="wait">
                    {selectedCategory !== 'ALL' && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            key={selectedCategory}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl font-black text-lg italic">02</div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground tracking-tight">{isEn ? "Refine Sub-Class" : "세부 카테고리"}</h3>
                                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest italic">{isEn ? "Step Two" : "두 번째 단계"}</p>
                                </div>
                                {isLoadingSubs && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {subCategories.map((sub) => {
                                    const id = sub.id;
                                    const isSelected = selectedSubCategories.includes(id);
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => toggleSubCategory(id)}
                                            className={`px-6 py-3 rounded-2xl text-[11px] font-black border transition-all uppercase tracking-tighter
                                                ${isSelected
                                                    ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                                                    : 'bg-muted/30 border-border/30 text-foreground/40 hover:border-primary/20'
                                                }`}
                                        >
                                            {sub.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* 🎲 Step 3: Tournament Rounds */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl font-black text-lg italic">03</div>
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">{isEn ? "Round Configuration" : "라운드 설정"}</h3>
                            <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest italic">{isEn ? "Step Three" : "세 번째 단계"}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {ROUND_OPTIONS.map((round) => (
                            <button
                                key={round}
                                onClick={() => setSelectedRound(round)}
                                className={`flex-1 py-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-1 overflow-hidden relative
                                    ${selectedRound === round
                                        ? 'bg-card border-primary text-primary shadow-2xl shadow-primary/10 scale-[1.05]'
                                        : 'bg-muted/30 border-border/30 text-foreground/30 hover:border-primary/20 hover:text-foreground/50'
                                    }`}
                            >
                                <span className="text-3xl font-black italic -tracking-[0.1em]">{round}</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Round</span>
                                {selectedRound === round && (
                                     <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient" />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 🚀 Execution Command */}
                <section className="pt-12 text-center space-y-6">
                    <button
                        onClick={handleStart}
                        className="btn-premium w-full py-6 text-xl shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] group relative overflow-hidden"
                    >
                         <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-125" />
                        <span className="tracking-tighter italic">{isEn ? "INITIATE TOURNAMENT" : "월드컵 시작하기"}</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <div className="surface-elevated p-6 flex items-center justify-center gap-3 border-dashed border-2">
                        <Info className="w-5 h-5 text-primary" />
                        <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">
                            {isEn ? "Game parameters strictly enforced. System auto-adjusts for low inventory." : "기관 규정에 따라 조건 미달 시 시스템이 자동으로 강수를 조정합니다."}
                        </p>
                    </div>

                    {/* Integrated Exhibit Ad */}
                    <div className="w-full mt-12 bg-card/40 rounded-[3rem] overflow-hidden border border-border/30 p-10 shadow-2xl">
                        <GoogleAd
                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                            slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
                            format="horizontal"
                            className="bg-transparent"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
}
