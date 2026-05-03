'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RefreshCw, Trophy, AlertTriangle, Share2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import SuccessToast from '@/components/ui/SuccessToast';
import GoogleAd from '@/components/ui/GoogleAd';

export default function PerfectPourPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang as string || 'ko';
    const isEn = lang === 'en';

    const [gameState, setGameState] = useState<'IDLE' | 'POURING_SOJU' | 'POURING_BEER' | 'FINISHED'>('IDLE');

    const [sojuLevel, setSojuLevel] = useState(0);
    const [beerLevel, setBeerLevel] = useState(0);

    const levelsRef = useRef({ soju: 0, beer: 0 });

    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const requestRef = useRef<number | null>(null);
    const animationIdCounter = useRef<number>(0);

    const updateLevel = (type: 'soju' | 'beer', value: number) => {
        if (type === 'soju') {
            setSojuLevel(value);
            levelsRef.current.soju = value;
        } else {
            setBeerLevel(value);
            levelsRef.current.beer = value;
        }
    };

    const resetGame = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        animationIdCounter.current++;
        setGameState('IDLE');
        updateLevel('soju', 0);
        updateLevel('beer', 0);
        setScore(null);
        setMessage('');
    };

    const startGame = () => {
        if (gameState !== 'IDLE') return;
        setGameState('POURING_SOJU');
        startAnimation('soju');
    };

    const getMessage = (key: string) => {
        if (isEn) {
            switch (key) {
                case 'overflow': return 'Overflowed! 😱';
                case 'underflow': return 'Too little? 💧';
                case 'perfect': return 'Golden Ratio Legend! 🍺👑';
                case 'great': return 'Somaek Master Class 1! 😎';
                case 'good': return 'Pretty tasty! 👍';
                case 'soso': return 'Not bad, drinkable! 👌';
                case 'bad': return 'Need more practice 😅';
                default: return '';
            }
        } else {
            switch (key) {
                case 'overflow': return '아이고 다 흘렸네요! 😱';
                case 'underflow': return '따르다 말았어요? 💧';
                case 'perfect': return '전설의 황금 비율! 🍺👑';
                case 'great': return '오.. 소맥 자격증 1급! 😎';
                case 'good': return '꽤 맛있게 말았는데요? 👍';
                case 'soso': return '나쁘지 않아요. 마실만함! 👌';
                case 'bad': return '음... 비율 연습이 필요해요 😅';
                default: return '';
            }
        }
    };

    const calculateScore = (overflow: boolean, sLevel: number, bLevel: number) => {
        const total = sLevel + bLevel;
        const sojuRatio = total > 0 ? sLevel / total : 0;

        if (overflow || total >= 99.9 || sLevel >= 99.9) {
            setScore(0);
            setMessage(getMessage('overflow'));
            return;
        }
        if (total < 10) {
            setScore(0);
            setMessage(getMessage('underflow'));
            return;
        }

        const ratioDiff = Math.abs(sojuRatio - 0.3);
        let ratioScore = 0;
        if (ratioDiff <= 0.02) {
            ratioScore = 100;
        } else {
            const tolerance = 0.2;
            const normalizedDiff = Math.min(ratioDiff / tolerance, 1);
            ratioScore = 100 * Math.max(0, 1 - Math.pow(normalizedDiff, 1.2));
        }

        const totalDiff = Math.abs(total - 90);
        let totalScore = 0;
        if (totalDiff <= 3) {
            totalScore = 100;
        } else {
            const tolerance = 40;
            const normalizedDiff = Math.min(totalDiff / tolerance, 1);
            totalScore = 100 * Math.max(0, 1 - Math.pow(normalizedDiff, 1.5));
        }

        let finalScore = Math.round((ratioScore * 0.8) + (totalScore * 0.2));

        if (finalScore >= 98) {
            finalScore = 100;
            setMessage(getMessage('perfect'));
            confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C0C0C0', '#ffffff']
            });
        } else if (finalScore >= 90) {
            setMessage(getMessage('great'));
        } else if (finalScore >= 80) {
            setMessage(getMessage('good'));
        } else if (finalScore >= 60) {
            setMessage(getMessage('soso'));
        } else {
            setMessage(getMessage('bad'));
        }

        setScore(finalScore);
    };

    const finishGame = useCallback((overflow = false) => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        animationIdCounter.current++;
        setGameState('FINISHED');
        const currentSoju = levelsRef.current.soju;
        const currentBeer = levelsRef.current.beer;
        calculateScore(overflow, currentSoju, currentBeer);
    }, []);

    const handleShare = () => {
        const shareTitle = isEn ? 'Somaek Master 🍺' : '소맥 제조기 🍺';
        const shareText = isEn ? `My Somaek score is ${score}! Try it yourself!` : `내 소맥 점수는 ${score}점! 당신도 도전해보세요!`;
        const toastMsg = isEn ? '🔗 Link copied! Share with friends 🍻' : '🔗링크가 복사되었습니다! 친구에게 공유해보세요 🍻';

        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            setToastMessage(toastMsg);
            setShowToast(true);
        }
    };

    const switchAction = (e?: any) => {
        if (e && e.cancelable) e.preventDefault();
        if (gameState === 'POURING_SOJU') {
            setGameState('POURING_BEER');
            startAnimation('beer');
        } else if (gameState === 'POURING_BEER') {
            finishGame(false);
        }
    };

    const startAnimation = (type: 'soju' | 'beer') => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        const currentAnimId = ++animationIdCounter.current;
        const speedPerSecond = 40;
        let lastTime: number | null = null;

        const animate = (time: number) => {
            if (currentAnimId !== animationIdCounter.current) return;
            if (lastTime === null) {
                lastTime = time;
                requestRef.current = requestAnimationFrame(animate);
                return;
            }
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            const validDelta = Math.min(delta, 0.05);
            const increment = speedPerSecond * validDelta;
            let stopped = false;
            const currentSoju = levelsRef.current.soju;
            const currentBeer = levelsRef.current.beer;

            if (type === 'soju') {
                const next = currentSoju + increment;
                if (next >= 100) {
                    updateLevel('soju', 100);
                    finishGame(true);
                    stopped = true;
                } else {
                    updateLevel('soju', next);
                }
            } else {
                const next = currentBeer + increment;
                if (currentSoju + next >= 100) {
                    updateLevel('beer', 100 - currentSoju);
                    finishGame(true);
                    stopped = true;
                } else {
                    updateLevel('beer', next);
                }
            }
            if (!stopped) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            animationIdCounter.current++;
        };
    }, []);

    const displayTotal = sojuLevel + beerLevel;
    const displaySojuPercent = displayTotal > 0 ? (sojuLevel / displayTotal) * 100 : 0;

    const liquidBackground = gameState === 'POURING_SOJU' || gameState === 'IDLE'
        ? 'linear-gradient(to top, #f8fafc 0%, #cbd5e1 100%)' 
        : `linear-gradient(to top, 
            #f8fafc 0%, 
            #cbd5e1 ${Math.max(0, displaySojuPercent - 5)}%, 
            #fbbf24 ${Math.min(100, displaySojuPercent + 5)}%, 
            #d97706 100%)`; 

    return (
        <div className="container mx-auto px-4 pt-12 pb-32 max-w-lg min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="flex items-center gap-5 mb-10 relative z-10">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-muted transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-brand-gradient bg-clip-text text-transparent">
                        {isEn ? "Perfect Pour" : "퍼펙트 푸어"}
                    </h1>
                    <p className="text-xs font-black text-muted-foreground/50 uppercase tracking-widest">{isEn ? "Somaek Mastery" : "소맥 마스터리"}</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-2xl font-black mb-3 text-foreground tracking-tight italic">
                        {isEn ? "Master of Proportion" : "황금 비율의 연금술사"}
                    </h2>
                    <div className="inline-flex gap-2 p-1.5 bg-muted/20 backdrop-blur-xl border border-white/5 rounded-2xl">
                        <span className="text-xs font-black uppercase text-muted-foreground/60 px-3 py-1">
                            {isEn ? "Goal: 90% Volume" : "목표: 총량 90%"}
                        </span>
                        <div className="w-px h-full bg-background/5" />
                        <span className="text-xs font-black uppercase text-primary px-3 py-1">
                            {isEn ? "30% Soju Ratio" : "소주 비율 30%"}
                        </span>
                    </div>
                </motion.div>

                <div className="relative w-44 h-80 bg-background/5 border-[5px] border-white/10 rounded-b-[3rem] rounded-t-xl backdrop-blur-md overflow-hidden mb-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                    <div
                        className="absolute w-full transition-all duration-100 ease-linear"
                        style={{
                            bottom: 0,
                            height: `${Math.min(100, displayTotal)}%`,
                            background: liquidBackground,
                            zIndex: 10
                        }}
                    >
                        <div className="absolute top-0 w-full h-2 bg-background/40 blur-[2px] animate-pulse" />
                        {gameState === 'POURING_BEER' && (
                            <div className="absolute inset-0 overflow-hidden">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={{ y: '-10%', opacity: [0, 0.5, 0] }}
                                        transition={{ 
                                            duration: 1 + Math.random() * 2, 
                                            repeat: Infinity, 
                                            delay: Math.random() * 2 
                                        }}
                                        className="absolute w-1 h-1 bg-background/30 rounded-full"
                                        style={{ left: `${Math.random() * 100}%` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="absolute top-0 left-3 w-4 h-full bg-gradient-to-r from-white/10 to-transparent blur-[1px] z-20 pointer-events-none" />
                    <div className="absolute top-0 right-3 w-2 h-full bg-gradient-to-l from-white/5 to-transparent blur-[1px] z-20 pointer-events-none" />
                </div>

                <div className="w-full max-w-xs relative h-44 select-none flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {gameState === 'IDLE' && (
                            <motion.button
                                key="start"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={startGame}
                                className="w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl bg-foreground text-background hover:scale-105 transition-all active:scale-95 italic uppercase tracking-tighter"
                            >
                                {isEn ? "Initiate Pour 🍶" : "제조 시작 🍶"}
                            </motion.button>
                        )}

                        {gameState === 'POURING_SOJU' && (
                            <motion.button
                                key="soju"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onPointerDown={switchAction}
                                className="w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl bg-primary text-primary-foreground animate-pulse active:scale-95 shadow-primary/20 italic uppercase tracking-tighter"
                            >
                                {isEn ? "Brew Mode! 🍺" : "맥주 투입! 🍺"}
                            </motion.button>
                        )}

                        {gameState === 'POURING_BEER' && (
                            <motion.button
                                key="beer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onPointerDown={switchAction}
                                className="w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl bg-rose-600 text-white animate-pulse active:scale-95 shadow-rose-600/20 uppercase tracking-tighter"
                            >
                                HALT! 🛑
                            </motion.button>
                        )}

                        {gameState === 'FINISHED' && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="w-full bg-card/20 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-10 md:p-14 text-center shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                
                                {score === 100 && (
                                    <div className="absolute inset-0 bg-primary/5 blur-[100px] animate-pulse pointer-events-none" />
                                )}

                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-4">
                                        <div className="text-7xl group-hover:scale-110 transition-transform duration-700 block">
                                            {score === 100 ? '👑' : score && score >= 90 ? '🥃' : score && score >= 60 ? '👌' : '💀'}
                                        </div>
                                        <div className="text-xs font-black text-primary uppercase tracking-[0.4em]">{isEn ? "Appraisal Verdict" : "정밀 감정 결과"}</div>
                                    </div>

                                    <div className="relative inline-block">
                                        <div className={`text-9xl font-black italic tracking-tighter leading-none ${score === 100 ? 'bg-brand-gradient bg-clip-text text-transparent' : 'text-foreground'}`}>
                                            {score}
                                        </div>
                                        <div className="absolute -right-6 -top-2 text-2xl font-black text-muted-foreground/30 italic">PTS</div>
                                    </div>

                                    <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8">
                                        <h3 className="text-xl md:text-2xl font-black text-foreground italic leading-tight tracking-tight uppercase">
                                            &ldquo;{message}&rdquo;
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-card/40 rounded-3xl border border-white/5 hover:border-primary/30 transition-all">
                                            <p className="text-xs font-black text-muted-foreground uppercase mb-2 tracking-widest">{isEn ? "Volume" : "총량"}</p>
                                            <p className={`text-xl font-black italic ${Math.abs(displayTotal - 90) < 5 ? "text-primary" : "text-foreground"}`}>
                                                {displayTotal.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="p-6 bg-card/40 rounded-3xl border border-white/5 hover:border-primary/30 transition-all">
                                            <p className="text-xs font-black text-muted-foreground uppercase mb-2 tracking-widest">{isEn ? "Ratio" : "비율"}</p>
                                            <p className={`text-xl font-black italic ${Math.abs(displaySojuPercent - 30) < 3 ? "text-primary" : "text-foreground"}`}>
                                                {displaySojuPercent.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetGame}
                                            className="grow py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-primary/30 uppercase tracking-widest italic"
                                        >
                                            <RefreshCw className="w-5 h-5" /> {isEn ? "RETRY" : "다시 도전"}
                                        </button>

                                        <button
                                            onClick={handleShare}
                                            className="aspect-square w-20 bg-card/40 hover:bg-card/60 text-foreground rounded-[2rem] font-bold flex items-center justify-center transition-all active:scale-95 border border-white/10 shadow-2xl group/share"
                                        >
                                            <Share2 className="w-6 h-6 text-primary group-hover/share:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full mt-12 flex justify-center pb-8 border-b-0">
                    <GoogleAd
                        key="ad-games"
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
                        format="horizontal"
                        className="rounded-3xl overflow-hidden shadow-2xl border border-white/5"
                    />
                </div>
            </div>
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}