'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, Beer, Trophy, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function PerfectPourPage() {
    const [gameState, setGameState] = useState<'IDLE' | 'POURING_SOJU' | 'POURING_BEER' | 'FINISHED'>('IDLE');
    const [sojuLevel, setSojuLevel] = useState(0);
    const [beerLevel, setBeerLevel] = useState(0);
    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const requestRef = useRef<number | null>(null);
    // Critical: Use a counter to invalidate old animation loops
    const animationIdCounter = useRef<number>(0);

    const resetGame = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        animationIdCounter.current++; // Invalidate any running loops
        setGameState('IDLE');
        setSojuLevel(0);
        setBeerLevel(0);
        setScore(null);
        setMessage('');
    };

    const startGame = () => {
        if (gameState !== 'IDLE') return;
        setGameState('POURING_SOJU');
        startAnimation('soju');
    };

    const switchAction = (e?: any) => {
        if (e && e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (gameState === 'POURING_SOJU') {
            setGameState('POURING_BEER');
            startAnimation('beer');
        } else if (gameState === 'POURING_BEER') {
            finishGame();
        }
    };

    const startAnimation = (type: 'soju' | 'beer') => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        // Generate new unique ID for this specific run
        const currentAnimId = ++animationIdCounter.current;
        // Use time-based increment instead of frame-based to ensure consistent speed across refresh rates
        // 0.8 per frame at 60fps means ~48 units per second. We set target to 50.
        const speedPerSecond = 50;
        let lastTime: number | null = null;

        const animate = (time: number) => {
            // Guard: Stop if this animation instance is obsolete (game reset or switched)
            if (currentAnimId !== animationIdCounter.current) return;

            if (lastTime === null) {
                lastTime = time;
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            // Calculate delta time in seconds
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            // Cap delta to avoid huge jumps if tab was inactive or severe lag
            const validDelta = Math.min(delta, 0.1);
            const increment = speedPerSecond * validDelta;

            let stopped = false;
            if (type === 'soju') {
                setSojuLevel(prev => {
                    const next = prev + increment;
                    if (next >= 100) {
                        finishGame(true);
                        stopped = true;
                        return 100;
                    }
                    return next;
                });
            } else {
                setBeerLevel(prev => {
                    const next = prev + increment;
                    if (sojuLevel + next >= 100) {
                        finishGame(true);
                        stopped = true;
                        return 100 - sojuLevel;
                    }
                    return next;
                });
            }

            if (!stopped) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);
    };

    const finishGame = (overflow = false) => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        animationIdCounter.current++; // Invalidate running loops
        setGameState('FINISHED');
        calculateScore(overflow);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            animationIdCounter.current++;
        };
    }, []);

    const calculateScore = (overflow: boolean) => {
        const total = sojuLevel + beerLevel;
        const sojuRatio = total > 0 ? sojuLevel / total : 0;

        if (overflow || total >= 100 || (sojuLevel >= 100)) {
            setScore(0);
            setMessage('Overflow! 넘쳤습니다 😱');
            return;
        }

        if (total < 1) {
            setScore(0);
            setMessage('잔이 비었습니다... 💧');
            return;
        }

        // Target: Total 90%, Ratio 0.3
        const totalDiff = Math.abs(total - 90);
        const ratioDiff = Math.abs(sojuRatio - 0.3);

        // Fail conditions for extreme misses
        if (sojuRatio > 0.5 || sojuRatio < 0.1 || total < 40) {
            setScore(10);
            setMessage('싫어하는 사람에게 주시나요..? 😱');
            return;
        }

        // Exponential Scoring: Higher points as distance decreases
        // We use a base ^ (1 - normalized_error) approach
        const totalFactor = Math.pow(Math.max(0, 1 - totalDiff / 30), 4);
        const ratioFactor = Math.pow(Math.max(0, 1 - ratioDiff / 0.2), 4);

        let finalScore = Math.floor(100 * totalFactor * ratioFactor);

        // Bonus for "Perfect" state
        if (totalDiff < 3 && ratioDiff < 0.03) {
            finalScore = 100;
            setMessage('전설의 황금 비율 소맥! 🍺👑');
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C0C0C0', '#ffffff']
            });
        } else if (finalScore >= 80) {
            setMessage('진짜 소맥 장인이시네요! 😎');
        } else if (finalScore >= 50) {
            setMessage('나쁘지 않은 소맥입니다. 👍');
        } else {
            setMessage('소맥은 역시 남이 말아줘야.. 😅');
        }

        setScore(finalScore);
    };

    // Calculate liquid visual percentage for gradient
    const totalHeight = sojuLevel + beerLevel;
    const sojuPercentInMix = totalHeight > 0 ? (sojuLevel / totalHeight) * 100 : 0;

    // Soft gradient logic: 
    // If pouring Soju, 100% Silver.
    // If pouring Beer/Finished, gradient from Silver (bottom) to Gold (top) starting at sojuPercent.
    const liquidBackground = gameState === 'POURING_SOJU' || gameState === 'IDLE'
        ? 'linear-gradient(to top, #e2e8f0 0%, #cbd5e1 100%)' // Pure Silver
        : `linear-gradient(to top, 
            #e2e8f0 0%, 
            #cbd5e1 ${Math.max(0, sojuPercentInMix - 5)}%, 
            #f59e0b ${Math.min(100, sojuPercentInMix + 5)}%, 
            #d97706 100%)`; // Soft Silver -> Gold transition

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/contents"
                    className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-2xl font-black text-white">Somaek Master</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-200 to-yellow-400 bg-clip-text text-transparent">
                        소맥 제조기
                    </h2>
                    <p className="text-neutral-400 text-xs">
                        1. 소주 🍶 -&gt; 2. 맥주 🍺 -&gt; 3. 완성! 🥂<br />
                        <span className="text-yellow-500 font-bold">목표: 총량 90% & 비밀의 황금비율!</span>
                    </p>
                </div>

                {/* Game Container */}
                <div className="relative w-40 h-80 bg-white/5 border-4 border-sky-300/50 rounded-b-3xl rounded-t-lg backdrop-blur-sm overflow-hidden mb-12 shadow-2xl">
                    {/* Guide Lines (Optional hint) */}
                    <div className="absolute bottom-[80%] w-full h-0.5 bg-white/10 z-0 border-t border-dashed border-white/30" />
                    <div className="absolute bottom-[24%] w-full h-0.5 bg-white/10 z-0 border-t border-dashed border-white/30" />

                    {/* Single Liquid Layer with Gradient */}
                    <div
                        className="absolute w-full transition-all duration-75 ease-linear shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        style={{
                            bottom: 0,
                            height: `${totalHeight}%`,
                            background: liquidBackground,
                            zIndex: 10
                        }}
                    >
                        {/* No texture, just blur highlight */}
                        <div className="absolute top-0 w-full h-1 bg-white/50 blur-[1px] animate-pulse" />
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-2 w-3 h-full bg-gradient-to-r from-white/20 to-transparent rounded-l-full blur-[1px] z-20 pointer-events-none" />
                    <div className="absolute top-0 right-2 w-1 h-full bg-gradient-to-l from-white/10 to-transparent rounded-r-full blur-[1px] z-20 pointer-events-none" />
                </div>

                {/* Controls / Result */}
                <div className="w-full max-w-xs relative h-40">
                    {gameState === 'IDLE' && (
                        <button
                            onClick={startGame}
                            className="w-full py-5 rounded-2xl font-black text-xl shadow-lg bg-slate-200 text-slate-900 hover:scale-105 transition-transform"
                        >
                            소주 따르기 🍶
                        </button>
                    )}

                    {gameState === 'POURING_SOJU' && (
                        <button
                            onMouseDown={switchAction}
                            onTouchStart={switchAction}
                            className="w-full py-5 rounded-2xl font-black text-2xl shadow-lg bg-amber-500 text-white animate-pulse"
                        >
                            맥주로 변경! 🍺
                        </button>
                    )}

                    {gameState === 'POURING_BEER' && (
                        <button
                            onMouseDown={switchAction}
                            onTouchStart={switchAction}
                            className="w-full py-5 rounded-2xl font-black text-2xl shadow-lg bg-red-600 text-white animate-pulse"
                        >
                            그만 따르기! 🛑
                        </button>
                    )}

                    {gameState === 'FINISHED' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-700 p-6 text-center shadow-2xl relative overflow-hidden"
                        >
                            {score === 100 && <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse" />}

                            <div className="relative z-10">
                                <div className="text-5xl mb-2 animate-bounce">
                                    {score === 100 ? '👑' : score && score >= 80 ? '😎' : score && score >= 50 ? '👍' : '😱'}
                                </div>

                                {/* Score Highlight */}
                                <div className="mb-4">
                                    <div className="text-sm text-neutral-400 uppercase tracking-widest mb-1">Final Score</div>
                                    <div className={`text-6xl font-black ${score === 100 ? 'text-amber-400' : 'text-white'}`}>
                                        {score}
                                    </div>
                                </div>

                                <h3 className={`text-xl font-bold mb-4 ${score === 100 ? 'text-amber-400' : 'text-white'}`}>
                                    {message}
                                </h3>

                                <div className="flex flex-col gap-1 text-xs text-neutral-400 mb-6 font-mono bg-black/30 py-3 rounded-lg border border-white/5">
                                    <div className="flex justify-between px-8 mb-1">
                                        <span>총량: <span className={Math.abs((sojuLevel + beerLevel) - 90) < 5 ? "text-green-400" : "text-red-400"}>{(sojuLevel + beerLevel).toFixed(1)}%</span> (목표 90%)</span>
                                    </div>
                                    <div className="flex justify-between px-8 mb-2">
                                        <span>소주 비율: <span className="text-white">{(sojuLevel / (sojuLevel + beerLevel) * 100).toFixed(1)}%</span> (목표 30%)</span>
                                    </div>
                                    <div className="px-8 w-full">
                                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden flex">
                                            <div className="bg-slate-300 h-full" style={{ width: `${(sojuLevel / (sojuLevel + beerLevel)) * 100}%` }} />
                                            <div className="bg-amber-500 h-full flex-1" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={resetGame}
                                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                                >
                                    <RefreshCw className="w-5 h-5" /> 다시 도전
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
