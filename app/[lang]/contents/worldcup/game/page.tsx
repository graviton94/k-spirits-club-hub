'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    ChevronLeft,
    Loader2,
    AlertCircle,
    RotateCcw,
    Share2,
    Download,
    Gamepad2,
    Link2
} from 'lucide-react';
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import {
    dbListSpiritsForWorldCup,
    dbUpsertWorldCupResult
} from '@/lib/db/data-connect-client';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface Spirit {
    id: string;
    name: string;
    name_en?: string | null;
    distillery: string | null;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    category: string;
    category_en?: string | null;
    subcategory: string | null;
    tags: string[];
    abv: number | null;
    country: string | null;
    region: string | null;
    preloadedImageUrl?: string;
    metadata?: {
        nose_tags?: string[];
        palate_tags?: string[];
        finish_tags?: string[];
    };
}

import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";

function WorldCupGameFallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-foreground/40 font-black animate-pulse uppercase tracking-widest text-xs italic">Synchronizing Palate Data...</p>
        </div>
    );
}

function WorldCupGamePageContent({ params }: { params: Promise<{ lang: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [lang, setLang] = useState<Locale>('ko');
    const [dict, setDict] = useState<any>(null);

    // Get params
    useEffect(() => {
        params.then(p => {
            setLang(p.lang as Locale);
            getDictionary(p.lang as Locale).then(d => setDict(d));
        });
    }, [params]);

    const isEn = lang === 'en';

    // Params
    const cat = searchParams.get('cat') || 'ALL';
    const sub = searchParams.get('sub') || 'ALL';
    const requestedRound = parseInt(searchParams.get('round') || '32');

    // Game States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [spirits, setSpirits] = useState<Spirit[]>([]);

    const [currentRoundItems, setCurrentRoundItems] = useState<Spirit[]>([]);
    const [nextRoundItems, setNextRoundItems] = useState<Spirit[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalRound, setTotalRound] = useState(requestedRound);
    const [gameFinished, setGameFinished] = useState(false);
    const [winner, setWinner] = useState<Spirit | null>(null);
    const [showRoundTransition, setShowRoundTransition] = useState(false);
    const [resultId, setResultId] = useState<string | null>(null);

    // Refs
    const resultCardRef = useRef<HTMLDivElement>(null);

    // 1. Data Fetching & Smart Rounding
    useEffect(() => {
        const fetchSpirits = async () => {
            try {
                setLoading(true);
                let fetchedDataRaw: any[] = [];
                
                if (cat === 'ALL') {
                    // 전체 주류 모드: 모든 카테고리에서 모든 제품을 가져옴
                    const { dbListAllSpiritsForWorldCup } = await import('@/lib/db/data-connect-client');
                    fetchedDataRaw = await dbListAllSpiritsForWorldCup();
                } else if (sub === 'ALL') {
                    // 특정 카테고리의 전체 주류 모드: 하위 카테고리 필터링 없이 카테고리만 매칭
                    const { dbListSpiritsByCategoryForWorldCup } = await import('@/lib/db/data-connect-client');
                    fetchedDataRaw = await dbListSpiritsByCategoryForWorldCup(cat);
                } else {
                    // 특정 카테고리 및 하위 카테고리 선택 모드
                    fetchedDataRaw = await dbListSpiritsForWorldCup(
                        cat,
                        sub.split(',')
                    );
                }

                const fetchedData: Spirit[] = fetchedDataRaw.map(data => {
                    return {
                        id: data.id,
                        name: data.name,
                        name_en: data.nameEn || null,
                        distillery: data.distillery || null,
                        imageUrl: data.imageUrl || null,
                        thumbnailUrl: data.thumbnailUrl || null,
                        category: data.category,
                        category_en: data.categoryEn || null,
                        subcategory: data.subcategory || null,
                        abv: data.abv !== undefined ? Number(data.abv) : null,
                        country: data.country || null,
                        region: data.region || null,
                        tags: [
                            ...(data.noseTags || []),
                            ...(data.palateTags || []),
                            ...(data.finishTags || [])
                        ]
                            .filter((v, i, a) => v && a.indexOf(v) === i)
                            .map(tag => tag.startsWith('#') ? tag.slice(1) : tag)
                    };
                }).filter(s => s.name); // Just ensure name exists, images will fallback

                if (fetchedData.length < 2) {
                    setError(dict?.common?.notEnoughSpirits || (isEn ? 'Not enough spirits found (Min 2 required)' : '조건에 맞는 술이 충분하지 않습니다. (최소 2개 필요)'));
                    return;
                }

                // Shuffle
                const shuffled = fetchedData.sort(() => Math.random() - 0.5);

                // Smart Rounding
                let finalRound = requestedRound;
                while (finalRound > shuffled.length && finalRound > 2) {
                    finalRound /= 2;
                }

                const gameItems = shuffled.slice(0, finalRound);

                // ✅ 이미지 일괄 프리로딩 (폴백 포함)
                await preloadAllImages(gameItems);

                setSpirits(gameItems);
                setCurrentRoundItems(gameItems);
                setTotalRound(finalRound);
            } catch (err) {
                console.error(err);
                setError(dict?.common?.errorData || (isEn ? 'Error loading data.' : '데이터를 불러오는 중 오류가 발생했습니다.'));
            } finally {
                setLoading(false);
            }
        };

        fetchSpirits();
    }, [cat, sub, requestedRound, dict, isEn]);

    // 이미지 일괄 프리로딩 함수 (최적화 → 원본 → 폴백 순)
    const preloadAllImages = async (items: Spirit[]) => {
        const imagePromises = items.map(item => {
            return new Promise<void>((resolve) => {
                const originalUrl = item.imageUrl || item.thumbnailUrl || '';
                const optimizedUrl = originalUrl ? getOptimizedImageUrl(originalUrl, 400) : '';
                const fallbackUrl = '/mys-4.webp'; // Institutional global fallback

                if (!optimizedUrl) {
                    item.preloadedImageUrl = fallbackUrl;
                    resolve();
                    return;
                }

                // 1차 시도: 최적화된 이미지
                const img1 = document.createElement('img') as HTMLImageElement;
                img1.onload = () => {
                    item.preloadedImageUrl = optimizedUrl;
                    resolve();
                };
                img1.onerror = () => {
                    item.preloadedImageUrl = fallbackUrl;
                    resolve();
                };
                img1.src = optimizedUrl;

                // 타임아웃 설정 (5초)
                setTimeout(() => {
                    if (!item.preloadedImageUrl) {
                        item.preloadedImageUrl = fallbackUrl;
                        resolve();
                    }
                }, 5000);
            });
        });

        await Promise.all(imagePromises);
        console.log(`✅ ${items.length}개 이미지 프리로딩 완료`);
    };

    // Winner Selection Logic
    const selectWinner = useCallback((selected: Spirit) => {
        const nextRound = [...nextRoundItems, selected];

        // Check if current round is finished
        if (currentIndex + 2 >= currentRoundItems.length) {
            if (nextRound.length === 1) {
                // Final Winner!
                const finalWinner = selected;
                setWinner(finalWinner);
                setGameFinished(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Auto Save Result for Sharing
                const saveResult = async () => {
                    try {
                        const newId = crypto.randomUUID();
                        await dbUpsertWorldCupResult({
                            id: newId,
                            winnerId: finalWinner.id,
                            category: cat,
                            subcategory: sub === 'ALL' ? null : sub,
                            initialRound: requestedRound,
                            timestamp: new Date().toISOString()
                        });
                        setResultId(newId);
                    } catch (err) {
                        console.error('Failed to save worldcup result:', err);
                    }
                };
                saveResult();
            } else {
                // Next Round progression
                const nextRoundSize = nextRound.length;

                // Show transition before updating
                setShowRoundTransition(true);
                setTimeout(() => {
                    setCurrentRoundItems(nextRound);
                    setNextRoundItems([]);
                    setCurrentIndex(0);
                    setTotalRound(nextRoundSize);
                    setShowRoundTransition(false);
                }, 500);
            }
        } else {
            // Move to next pair
            setNextRoundItems(nextRound);
            setCurrentIndex(prev => prev + 2);
        }
    }, [currentIndex, currentRoundItems, nextRoundItems, cat, requestedRound, sub]);

    // Handle Image Save
    const handleSaveImage = useCallback(async () => {
        if (!resultCardRef.current || !winner) return;

        try {
            const wrapper = resultCardRef.current;

            // 모든 이미지가 로드될 때까지 대기
            const images = wrapper.getElementsByTagName('img');
            await Promise.all(
                Array.from(images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((res) => {
                        img.onload = res;
                        img.onerror = res;
                        // 5초 타임아웃
                        setTimeout(res, 5000);
                    });
                })
            );

            // 레이아웃 안정화 대기
            await new Promise(res => setTimeout(res, 100));

            const dataUrl = await toPng(wrapper, {
                cacheBust: false,  // 프리로드된 이미지 사용
                backgroundColor: '#ffffff',
                pixelRatio: 2,
                skipFonts: false,
                filter: (node) => {
                    // 불필요한 요소 제외
                    if (node.classList && node.classList.contains('no-export')) {
                        return false;
                    }
                    return true;
                },
                style: {
                    borderRadius: '0',
                    margin: '0',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                }
            });

            const link = document.createElement('a');
            link.download = `k-spirits-worldcup-${(isEn ? winner?.name_en : winner?.name) || 'result'}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to save image', err);
            alert(dict?.worldcup?.saveError || (isEn ? 'Error saving image.' : '이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
        }
    }, [winner, dict, isEn]);

    // Handle Share
    const handleShare = useCallback(async () => {
        if (!winner) return;

        // If resultId is not yet saved, use fallback link or wait
        const shareUrl = resultId
            ? `${window.location.origin}/${lang}/contents/worldcup/result/${resultId}`
            : window.location.href;

        const shareData = {
            title: dict?.worldcup?.title || '주류 취향 월드컵 🏆',
            text: (dict?.worldcup?.shareText || (isEn ? "My best pick is [{winner}]!" : "나의 최고의 선택은 [{winner}]!")).replace('{winner}', (isEn ? winner.name_en : winner.name) || winner.name),
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert(dict?.worldcup?.copyLink || '🔗링크가 복사되었습니다!');
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    }, [winner, resultId, dict, isEn, lang]);

    // Loading Screen
    if (loading || !dict) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-foreground/40 font-black animate-pulse uppercase tracking-widest text-xs italic">
                    {dict?.common?.loadingData || "ANALYZING SPIRITS..."}
                </p>
            </div>
        );
    }

    // Error Screen
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-xl font-bold text-foreground mb-2">{error}</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-6 px-8 py-3 bg-card border border-border text-foreground rounded-2xl font-bold hover:bg-muted transition-all"
                >
                    {dict?.common?.back || "돌아가기"}
                </button>
            </div>
        );
    }

    // 🏆 Result Screen
    if (gameFinished && winner) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center max-w-lg w-full"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
                        <Trophy className="w-5 h-5 text-primary" />
                        <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">Grand Champion</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-10 tracking-tighter italic">
                        {dict?.worldcup?.champion || "당신의 최종 선택은!"}
                    </h2>

                    {/* Winner Card Container for Capture */}
                    <div
                        ref={resultCardRef}
                        className="bg-card p-10 rounded-[48px] mb-12 mx-auto w-fit shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-border relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex flex-col items-center gap-6 relative z-10">
                            {/* Capture Header */}
                            <div className="flex flex-col items-center gap-1.5 mb-2">
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                                    K-Spirits World Cup
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-primary/30" />
                                    <h4 className="text-2xl font-black text-foreground tracking-widest italic">CHAMPION</h4>
                                    <div className="h-px w-8 bg-primary/30" />
                                </div>
                            </div>

                            {/* Main Card */}
                            <div className="w-[280px] md:w-[320px] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/10 relative">
                                {/* 1. Image Block */}
                                <div className="aspect-square relative p-10 bg-muted/50 border-b border-border/50">
                                    <Image
                                        src={winner.preloadedImageUrl || '/mys-4.webp'}
                                        alt={winner.name}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                </div>

                                {/* 2. Info Blocks */}
                                <div className="p-8 flex flex-col gap-4 text-center bg-card items-center">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20">
                                            {(isEn && winner.category_en) ? winner.category_en : winner.category}
                                        </span>
                                        {winner.subcategory && (
                                            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-lg uppercase tracking-tighter border border-border">
                                                {winner.subcategory}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight tracking-tighter px-2">
                                        {winner.name}
                                    </h3>

                                    <div className="flex flex-wrap justify-center gap-2 opacity-60">
                                        {winner.country && (
                                            <span className="text-[11px] font-black uppercase tracking-widest">{winner.country}</span>
                                        )}
                                        {winner.abv !== null && (
                                            <span className="text-[11px] font-black text-primary">— {winner.abv}% VOL</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Capture Footer */}
                            <div className="mt-4 flex items-center gap-2 opacity-30">
                                <Image src="/logo.png" width={16} height={16} alt="" className="grayscale invert" />
                                <span className="text-[10px] text-foreground font-black tracking-[0.3em] uppercase">
                                    k-spirits.club
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-80 mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleSaveImage}
                                className="py-4 bg-card border border-border text-foreground text-xs font-black rounded-2xl hover:bg-muted transition-all flex flex-col items-center justify-center gap-2 active:scale-95 shadow-lg uppercase tracking-widest"
                            >
                                <Download className="w-5 h-5 text-primary" />
                                <span>{isEn ? "Save Card" : "카드 저장"}</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="py-4 bg-card border border-border text-foreground text-xs font-black rounded-2xl hover:bg-muted transition-all flex flex-col items-center justify-center gap-2 active:scale-95 shadow-lg uppercase tracking-widest"
                            >
                                <Share2 className="w-5 h-5 text-primary" />
                                <span>{isEn ? "Share" : "공유하기"}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => router.push(`/${lang}/contents/worldcup`)}
                            className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest"
                        >
                            <Gamepad2 className="w-5 h-5" /> {isEn ? "Try Another World Cup" : "다른 월드컵 도전"}
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 py-2 text-foreground/40 text-[10px] font-black hover:text-foreground transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> {isEn ? "Rematch with same settings" : "이 설정으로 다시 대결"}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 🎮 Game Screen
    const leftItem = currentRoundItems[currentIndex];
    const rightItem = currentRoundItems[currentIndex + 1];

    if (!leftItem || !rightItem) return <WorldCupGameFallback />;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Round Transition Overlay */}
            <AnimatePresence>
                {showRoundTransition && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-4 opacity-100">{isEn ? 'Tournament' : '토너먼트'}</div>
                            <h2 className="text-7xl md:text-9xl font-black text-foreground tracking-tighter italic uppercase drop-shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                                {totalRound / 2 === 1 ? (dict?.worldcup?.final || 'FINAL') : (dict?.worldcup?.round?.replace('{round}', (totalRound / 2).toString()) || `${totalRound / 2} ROUND`)}
                            </h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Arena Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full" />
            </div>

            {/* 1. Header & Progress */}
            <div className="fixed top-16 md:top-20 left-0 right-0 p-4 z-40 glass-premium border-b border-border/10 flex flex-col items-center gap-4">
                <div className="w-full max-w-7xl flex items-center justify-between px-2">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-muted/30 border border-border/50 rounded-2xl hover:bg-muted transition-all active:scale-95 shadow-xl"
                    >
                        <ChevronLeft className="w-6 h-6 text-foreground" />
                    </button>
                    
                    <div className="flex flex-col items-center">
                        <div className="px-8 py-2 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 mb-1.5 transition-all hover:scale-105 cursor-default">
                            <h2 className="text-sm md:text-lg font-black tracking-[0.2em] italic uppercase">
                                {totalRound === 2 ? (dict?.worldcup?.final || 'FINAL') : (dict?.worldcup?.round?.replace('{round}', totalRound.toString()) || `${totalRound} ROUND`)}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                            <p className="text-[10px] md:text-xs text-foreground/40 font-black uppercase tracking-[0.3em]">
                                MATCH {Math.floor(currentIndex / 2) + 1} OF {currentRoundItems.length / 2}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block w-12 h-12" />
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xl h-1.5 bg-muted/30 rounded-full overflow-hidden border border-border/10 relative">
                    <motion.div
                        className="h-full bg-brand-gradient shadow-[0_0_20px_rgba(var(--primary),0.5)] relative z-10"
                        initial={false}
                        animate={{ width: `${(currentIndex / currentRoundItems.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    />
                </div>
            </div>

            {/* VS Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none md:top-[55%] lg:top-[50%]">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 md:w-32 md:h-32 glass-premium border-2 border-primary/50 rounded-full flex items-center justify-center shadow-2xl shadow-primary/20 relative"
                >
                    <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-30" />
                    <span className="text-3xl md:text-5xl font-black italic text-primary drop-shadow-2xl italic tracking-tighter">VS</span>
                </motion.div>
            </div>

            {/* Choice Section */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-48 pb-12 px-4 md:px-8 gap-8 max-w-[1800px] mx-auto w-full relative z-20 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={leftItem.id}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex-1 w-full h-full max-h-[700px] flex"
                    >
                        <ChoiceCard item={leftItem} onClick={() => selectWinner(leftItem)} pos="left" isEn={isEn} />
                    </motion.div>

                    <motion.div 
                        key={rightItem.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex-1 w-full h-full max-h-[700px] flex"
                    >
                        <ChoiceCard item={rightItem} onClick={() => selectWinner(rightItem)} pos="right" isEn={isEn} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function ChoiceCard({ item, onClick, pos, isEn }: { item: Spirit, onClick: () => void, pos: 'left' | 'right', isEn: boolean }) {
    return (
        <motion.button
            onClick={onClick}
            className="flex-1 w-full h-full group relative outline-none flex flex-col bg-card border border-border/40 rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:border-primary/50 hover:shadow-primary/20 hover:bg-card/80 hover:scale-[1.02]"
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <div className="aspect-[4/3] md:aspect-square relative w-full bg-muted/10 border-b border-border/30 overflow-hidden">
                <Image
                    src={item.preloadedImageUrl || '/mys-4.webp'}
                    alt={item.name}
                    fill
                    className="object-contain p-12 md:p-20 transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>

            <div className="p-8 md:p-12 flex flex-col items-center text-center gap-6 flex-1 justify-center relative">
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="capsule-premium">
                        {(isEn && item.category_en) ? item.category_en : item.category}
                    </span>
                    {item.subcategory && (
                        <span className="px-4 py-1.5 bg-secondary text-secondary-foreground border border-border text-[9px] font-black rounded-xl uppercase tracking-tighter">
                            {item.subcategory}
                        </span>
                    )}
                </div>

                <h3 className="text-2xl md:text-5xl font-black text-foreground leading-[1] tracking-tight px-2 line-clamp-3 group-hover:text-primary transition-colors duration-500 italic uppercase">
                    {(isEn && item.name_en) ? item.name_en : item.name}
                </h3>

                <div className="flex flex-wrap justify-center gap-4 opacity-40 group-hover:opacity-100 transition-all duration-500">
                    <div className="px-4 py-1.5 bg-muted rounded-xl border border-border/50">
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.country}</span>
                    </div>
                    {item.abv !== null && (
                        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-xl">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.abv}% ABV</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Highlight */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
        </motion.button>
    );
}
export default function WorldCupGamePage({ params }: { params: Promise<{ lang: string }> }) {
    return (
        <Suspense fallback={<WorldCupGameFallback />}>
            <WorldCupGamePageContent params={params} />
        </Suspense>
    );
}
