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
    collection,
    query,
    where,
    getDocs,
    limit,
    orderBy,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/db/firebase';
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
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
            <p className="text-muted-foreground font-bold animate-pulse">Loading world cup match...</p>
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
                const spiritsRef = collection(db, 'spirits');
                let q = query(
                    spiritsRef,
                    where('isPublished', '==', true),
                    limit(300) // Max fetch for pool
                );

                if (cat !== 'ALL') {
                    q = query(q, where('category', '==', cat));
                }

                if (sub !== 'ALL') {
                    const subArray = sub.split(',');
                    if (subArray.length > 0) {
                        // Note: firestore 'in' limited to 10 items
                        q = query(q, where('subcategory', 'in', subArray.slice(0, 10)));
                    }
                }

                const querySnapshot = await getDocs(q);
                const fetchedData: Spirit[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        name_en: data.name_en || null,
                        distillery: data.distillery || null,
                        imageUrl: data.imageUrl || null,
                        thumbnailUrl: data.thumbnailUrl || null,
                        category: data.category,
                        category_en: data.category_en || null,
                        subcategory: data.subcategory || null,
                        abv: data.abv !== undefined ? Number(data.abv) : null,
                        country: data.country || null,
                        region: data.region || null,
                        tags: [
                            ...(data.nose_tags || data.metadata?.nose_tags || []),
                            ...(data.palate_tags || data.metadata?.palate_tags || []),
                            ...(data.finish_tags || data.metadata?.finish_tags || []),
                            ...(data.tags || [])
                        ]
                            .filter((v, i, a) => v && a.indexOf(v) === i)
                            .map(tag => tag.startsWith('#') ? tag.slice(1) : tag)
                    };
                }).filter(s => s.imageUrl || s.thumbnailUrl);

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
    }, [cat, sub, requestedRound]);

    // 이미지 일괄 프리로딩 함수 (최적화 → 원본 → 폴백 순)
    const preloadAllImages = async (items: Spirit[]) => {
        const imagePromises = items.map(item => {
            return new Promise<void>((resolve) => {
                const originalUrl = item.imageUrl || item.thumbnailUrl || '';
                const optimizedUrl = getOptimizedImageUrl(originalUrl, 400);
                const fallbackUrl = getCategoryFallbackImage(item.category);

                // 1차 시도: 최적화된 이미지
                const img1 = document.createElement('img') as HTMLImageElement;
                img1.onload = () => {
                    item.preloadedImageUrl = optimizedUrl;
                    resolve();
                };
                img1.onerror = () => {
                    // 2차 시도: 원본 이미지
                    const img2 = document.createElement('img') as HTMLImageElement;
                    img2.onload = () => {
                        item.preloadedImageUrl = originalUrl;
                        resolve();
                    };
                    img2.onerror = () => {
                        // 3차 시도: 카테고리 폴백
                        const img3 = document.createElement('img') as HTMLImageElement;
                        img3.onload = () => {
                            item.preloadedImageUrl = fallbackUrl;
                            resolve();
                        };
                        img3.onerror = () => {
                            // 최종 폴백
                            item.preloadedImageUrl = fallbackUrl;
                            resolve();
                        };
                        img3.src = fallbackUrl;
                    };
                    img2.src = originalUrl;
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
                        const docRef = await addDoc(collection(db, 'worldcup_results'), {
                            winner: finalWinner,
                            category: cat,
                            subcategory: sub,
                            initialRound: requestedRound,
                            timestamp: serverTimestamp()
                        });
                        setResultId(docRef.id);
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
    }, [currentIndex, currentRoundItems, nextRoundItems]);

    // Handle Image Save
    const handleSaveImage = useCallback(async () => {
        if (!resultCardRef.current) return;

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
    }, [winner]);

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
    }, [winner, resultId]);

    // Loading Screen
    if (loading || !dict) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-muted-foreground font-bold animate-pulse">{dict?.common?.loadingData || "주류 데이터를 수집 중입니다..."}</p>
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-500 text-xs font-black uppercase tracking-widest">Grand Champion</span>
                    </div>

                    <h2 className="text-3xl font-black text-foreground mb-8 tracking-tighter">{dict?.worldcup?.champion || "당신의 최종 선택은!"}</h2>

                    {/* Winner Card Container for Capture - Forced Light Theme for Image Export */}
                    <div
                        ref={resultCardRef}
                        className="bg-white p-8 rounded-[32px] mb-10 mx-auto w-fit shadow-xl"
                    >
                        <div className="flex flex-col items-center gap-4">
                            {/* Capture Header */}
                            <div className="flex flex-col items-center gap-1 mb-2">
                                <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">
                                    K-Spirits World Cup
                                </span>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                    <h4 className="text-xl font-black text-[#1a1a1a] tracking-tighter italic">CHAMPION</h4>
                                </div>
                            </div>

                            {/* Main Card - Explicit Light Styles */}
                            <div className="w-64 bg-white border border-[#e5e5e5] rounded-[24px] overflow-hidden shadow-lg relative">
                                {/* 1. Image Block */}
                                <div className="aspect-square relative p-6 bg-[#f8f8f8] border-b border-[#e5e5e5]">
                                    <Image
                                        src={winner.preloadedImageUrl || getCategoryFallbackImage(winner.category)}
                                        alt={winner.name}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = getCategoryFallbackImage(winner.category);
                                        }}
                                    />
                                </div>

                                {/* 2~5. Info Blocks */}
                                <div className="p-5 flex flex-col gap-3 text-center bg-white items-center">
                                    {/* 1단. Category / Subcategory Capsules */}
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                                            {(isEn && winner.category_en) ? winner.category_en : winner.category}
                                        </span>
                                        {winner.subcategory && (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                                {winner.subcategory}
                                            </span>
                                        )}
                                    </div>

                                    {/* 2단. Product Name */}
                                    <h3 className="text-lg font-black text-[#1a1a1a] leading-tight line-clamp-2 px-1">
                                        {winner.name}
                                    </h3>

                                    {/* 3단. Country / Region Capsules */}
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {winner.country && (
                                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">
                                                {winner.country}
                                            </span>
                                        )}
                                        {winner.region && (
                                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-medium rounded-full uppercase">
                                                {winner.region}
                                            </span>
                                        )}
                                    </div>

                                    {/* 4단. ABV / Distillery Capsules */}
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {winner.abv !== null && (
                                            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full">
                                                {winner.abv}%
                                            </span>
                                        )}
                                        {winner.distillery && (
                                            <span className="px-2 py-0.5 bg-gray-500 text-white text-[10px] font-medium rounded-full">
                                                {winner.distillery}
                                            </span>
                                        )}
                                    </div>

                                    {/* 5단. Flavor Tags (Capsule Style) */}
                                    {winner.tags && winner.tags.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                                            {winner.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-[9px] text-amber-600 font-bold whitespace-nowrap"
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Capture Footer */}
                            <div className="mt-2 opacity-30">
                                <span className="text-[8px] text-[#1a1a1a] font-bold tracking-widest uppercase">
                                    k-spirits.club
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-72 mx-auto">
                        {/* 1. Results Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleSaveImage}
                                className="py-3.5 bg-card border border-border text-foreground text-sm font-bold rounded-2xl hover:bg-muted transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95"
                            >
                                <Download className="w-5 h-5 text-pink-500" />
                                <span>{dict?.worldcup?.saveResult || "결과 저장"}</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="py-3.5 bg-card border border-border text-foreground text-sm font-bold rounded-2xl hover:bg-muted transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95"
                            >
                                <Share2 className="w-5 h-5 text-purple-500" />
                                <span>{dict?.worldcup?.shareResult || "친구에게 공유"}</span>
                            </button>
                        </div>

                        {/* 2. Explore More */}
                        <button
                            onClick={() => router.push(`/${lang}/contents/worldcup`)}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                        >
                            <Gamepad2 className="w-5 h-5" /> {dict?.worldcup?.playAgain || "다른 월드컵 하러 가기"}
                        </button>

                        {/* 3. Restart */}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 py-2 text-muted-foreground text-xs font-bold hover:text-foreground transition-colors flex items-center justify-center gap-1.5 underline underline-offset-4"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> {dict?.worldcup?.restart || "대결 다시하기 (이 설정으로)"}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 🎮 Game Screen
    const leftItem = currentRoundItems[currentIndex];
    const rightItem = currentRoundItems[currentIndex + 1];

    if (!leftItem || !rightItem) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Round Transition Overlay */}
            <AnimatePresence>
                {showRoundTransition && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-80">{dict?.worldcup?.nextRound || "Next Round"}</div>
                            <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter italic">
                                {totalRound / 2 === 1 ? (dict?.worldcup?.final || '결승전') : (dict?.worldcup?.round?.replace('{round}', (totalRound / 2).toString()) || `${totalRound / 2}강`)}
                            </h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* 1. Header & Progress (Fixed top-16 to avoid overlapping with main site header) */}
            <div className="fixed top-16 left-0 right-0 p-4 z-40 bg-gradient-to-b from-background via-background/40 to-transparent flex flex-col items-center">
                <div className="w-full max-w-2xl flex items-center justify-between mb-2">
                    <button
                        onClick={() => router.push(`/${lang}/contents/worldcup`)}
                        className="p-2.5 bg-card/50 backdrop-blur-md rounded-2xl border border-border hover:bg-muted transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="flex flex-col items-center px-4 py-2 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-sm">
                        <h2 className="text-xl font-black text-amber-500 tracking-tighter drop-shadow-md">
                            {totalRound === 2 ? (dict?.worldcup?.final || '결승전') : (dict?.worldcup?.round?.replace('{round}', totalRound.toString()) || `${totalRound}강`)}
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-2 py-0.5 mt-0.5">
                            Game {Math.floor(currentIndex / 2) + 1} / {currentRoundItems.length / 2}
                        </p>
                    </div>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>
                {/* Progress Bar */}
                <div className="w-full max-w-sm h-1.5 bg-muted rounded-full overflow-hidden border border-border/50">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        initial={false}
                        animate={{ width: `${(currentIndex / currentRoundItems.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* VS Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none md:top-[55%]">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-background/60 backdrop-blur-xl border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                    <span className="text-xl md:text-3xl font-black italic text-amber-500">{dict?.worldcup?.vs || "VS"}</span>
                </div>
            </div>

            {/* Choice Section - Relative z-20 for clear click area, pt-44 to avoid header overlap */}
            <div className="flex-1 flex flex-row items-center justify-center pt-44 pb-8 px-3 gap-3 max-w-4xl mx-auto w-full mb-12 relative z-20">
                {/* Left Side */}
                <ChoiceCard item={leftItem} onClick={() => selectWinner(leftItem)} pos="left" isEn={isEn} />

                {/* Right Side */}
                <ChoiceCard item={rightItem} onClick={() => selectWinner(rightItem)} pos="right" isEn={isEn} />
            </div>
        </div>
    );
}

export default function WorldCupGamePage({ params }: { params: Promise<{ lang: string }> }) {
    return (
        <Suspense fallback={<WorldCupGameFallback />}>
            <WorldCupGamePageContent params={params} />
        </Suspense>
    );
}

function ChoiceCard({ item, onClick, pos, isEn }: { item: Spirit, onClick: () => void, pos: 'left' | 'right', isEn: boolean }) {
    return (
        <motion.button
            onClick={onClick}
            className="flex-1 group relative outline-none flex flex-col bg-card border border-border rounded-[28px] overflow-hidden shadow-xl max-h-[700px]"
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* 1. Image Block (Reduced height on PC) */}
            <div className="aspect-[4/5] md:aspect-[16/10] relative w-full bg-muted/10 border-b border-border overflow-hidden">
                <Image
                    src={item.preloadedImageUrl || getCategoryFallbackImage(item.category)}
                    alt={item.name}
                    fill
                    className="object-contain p-4 md:p-6 transition-transform duration-500 group-hover:scale-110"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>

            {/* 2~6. Info Blocks (Structured) */}
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-3 flex-1 justify-center">
                {/* 1단. Category / Subcategory Capsules */}
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                    <span className="px-2 md:px-3 py-1 bg-amber-500 text-white text-[10px] md:text-[11px] font-black rounded-full uppercase tracking-wider">
                        {(isEn && item.category_en) ? item.category_en : item.category}
                    </span>
                    {item.subcategory && (
                        <span className="px-2 md:px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-bold rounded-full uppercase tracking-tighter">
                            {item.subcategory}
                        </span>
                    )}
                </div>

                {/* 2단. Product Name */}
                <h3 className="text-sm md:text-2xl font-black text-foreground leading-tight line-clamp-2 md:line-clamp-3">
                    {typeof window !== 'undefined' && window.location.pathname.startsWith('/en') && item.name_en ? item.name_en : item.name}
                </h3>

                {/* 3단. Country / Region Capsules */}
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                    {item.country && (
                        <span className="px-2 md:px-3 py-1 bg-blue-600 text-white text-[10px] md:text-[11px] font-bold rounded-full uppercase">
                            {item.country}
                        </span>
                    )}
                    {item.region && (
                        <span className="px-2 md:px-3 py-1 bg-indigo-600 text-white text-[10px] md:text-[11px] font-medium rounded-full uppercase">
                            {item.region}
                        </span>
                    )}
                </div>

                {/* 4단. ABV / Distillery Capsules */}
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                    {item.abv !== null && (
                        <span className="px-2 md:px-3 py-1 bg-rose-600 text-white text-[10px] md:text-[11px] font-black rounded-full">
                            {item.abv}%
                        </span>
                    )}
                    {item.distillery && (
                        <span className="px-2 md:px-3 py-1 bg-gray-500 text-white text-[10px] md:text-[11px] font-medium rounded-full">
                            {item.distillery}
                        </span>
                    )}
                </div>

                {/* 5단. Flavor Tags (Capsule Style) */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2 border-t border-border/30 pt-3 w-full">
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-muted border border-border/50 rounded-full text-[9px] md:text-[10px] text-muted-foreground font-bold">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Glow & Overlay - pointer-events-none for safe clicking */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/20 rounded-[28px] transition-all pointer-events-none" />
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>
    );
}
