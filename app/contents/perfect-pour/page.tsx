'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, Trophy, AlertTriangle, Share2 } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import SuccessToast from '@/components/ui/SuccessToast';

export default function PerfectPourPage() {
    const [gameState, setGameState] = useState<'IDLE' | 'POURING_SOJU' | 'POURING_BEER' | 'FINISHED'>('IDLE');

    // UI 렌더링용 State
    const [sojuLevel, setSojuLevel] = useState(0);
    const [beerLevel, setBeerLevel] = useState(0);

    // 로직 계산용 Ref (실시간 동기화) - 이전 턴 수정사항 유지
    const levelsRef = useRef({ soju: 0, beer: 0 });

    const [score, setScore] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const requestRef = useRef<number | null>(null);
    const animationIdCounter = useRef<number>(0);

    // 값을 업데이트할 때 State와 Ref를 동시에 업데이트
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

    const finishGame = useCallback((overflow = false) => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        animationIdCounter.current++;

        setGameState('FINISHED');

        // Ref에서 최신 값을 가져와 계산
        const currentSoju = levelsRef.current.soju;
        const currentBeer = levelsRef.current.beer;
        calculateScore(overflow, currentSoju, currentBeer);
        calculateScore(overflow, currentSoju, currentBeer);
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Somaek Master 🍺',
                text: `내 소맥 점수는 ${score}점! 당신도 도전해보세요!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            setToastMessage('🔗링크가 복사되었습니다! 친구에게 공유해보세요 🍻');
            setShowToast(true);
        }
    };

    const switchAction = (e?: any) => {
        // 모바일/PC 중복 이벤트 방지
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
        const speedPerSecond = 50; // 초당 50% 채움
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

            const validDelta = Math.min(delta, 0.1);
            const increment = speedPerSecond * validDelta;

            let stopped = false;

            const currentSoju = levelsRef.current.soju;
            const currentBeer = levelsRef.current.beer;

            if (type === 'soju') {
                const next = currentSoju + increment;
                if (next >= 100) {
                    updateLevel('soju', 100);
                    finishGame(true); // Overflow
                    stopped = true;
                } else {
                    updateLevel('soju', next);
                }
            } else {
                const next = currentBeer + increment;
                if (currentSoju + next >= 100) {
                    updateLevel('beer', 100 - currentSoju);
                    finishGame(true); // Overflow
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

    /**
     * 🎯 점수 계산 로직 (완화된 버전)
     * - 비율 가중치: 80%
     * - 총량 가중치: 20%
     * - 채점 방식: 감점 폭을 줄이고(로그형/완만한 곡선), 허용 오차를 넓힘
     */
    const calculateScore = (overflow: boolean, sLevel: number, bLevel: number) => {
        const total = sLevel + bLevel;
        // 0으로 나누기 방지
        const sojuRatio = total > 0 ? sLevel / total : 0;

        // 1. 즉시 실패 조건 (너무 극단적인 경우)
        if (overflow || total >= 99.9 || sLevel >= 99.9) {
            setScore(0);
            setMessage('아이고 다 흘렸네요! 😱');
            return;
        }
        if (total < 10) {
            setScore(0);
            setMessage('따르다 말았어요? 💧');
            return;
        }

        // 2. 점수 계산 (각 항목 100점 만점 기준)

        // [A] 비율 점수 (목표: 0.3)
        // 오차가 0.02(2%) 이내면 100점, 그 외에는 완만하게 감점
        const ratioDiff = Math.abs(sojuRatio - 0.3);
        let ratioScore = 0;
        if (ratioDiff <= 0.02) {
            ratioScore = 100; // Perfect Zone
        } else {
            // 허용 오차 0.2 (0.1 ~ 0.5 범위까지 점수 부여)
            // 제곱근(Math.pow(..., 0.5)) 등을 쓰면 감점이 더 천천히 일어남
            const tolerance = 0.2;
            const normalizedDiff = Math.min(ratioDiff / tolerance, 1);
            // 1 - x^1.5 : 선형보다 조금 더 관대함 (초반 감점이 적음)
            ratioScore = 100 * Math.max(0, 1 - Math.pow(normalizedDiff, 1.2));
        }

        // [B] 총량 점수 (목표: 90)
        // 오차가 3 이내면 100점
        const totalDiff = Math.abs(total - 90);
        let totalScore = 0;
        if (totalDiff <= 3) {
            totalScore = 100; // Perfect Zone
        } else {
            // 허용 오차 40 (50 ~ 130 범위까지 점수 부여)
            const tolerance = 40;
            const normalizedDiff = Math.min(totalDiff / tolerance, 1);
            totalScore = 100 * Math.max(0, 1 - Math.pow(normalizedDiff, 1.5));
        }

        // 3. 최종 가중치 합산 (비율 80% + 총량 20%)
        let finalScore = Math.round((ratioScore * 0.8) + (totalScore * 0.2));

        // 4. 메시지 및 효과
        if (finalScore >= 98) {
            finalScore = 100; // 98점 이상은 그냥 100점 처리 (기분 좋게)
            setMessage('전설의 황금 비율! 🍺👑');
            confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#C0C0C0', '#ffffff']
            });
        } else if (finalScore >= 90) {
            setMessage('오.. 소맥 자격증 1급! 😎');
        } else if (finalScore >= 80) {
            setMessage('꽤 맛있게 말았는데요? 👍');
        } else if (finalScore >= 60) {
            setMessage('나쁘지 않아요. 마실만함! 👌');
        } else {
            setMessage('음... 비율 연습이 필요해요 😅');
        }

        setScore(finalScore);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            animationIdCounter.current++;
        };
    }, []);

    // 시각적 렌더링용 변수
    const displayTotal = sojuLevel + beerLevel;
    const displaySojuPercent = displayTotal > 0 ? (sojuLevel / displayTotal) * 100 : 0;

    const liquidBackground = gameState === 'POURING_SOJU' || gameState === 'IDLE'
        ? 'linear-gradient(to top, #e2e8f0 0%, #cbd5e1 100%)'
        : `linear-gradient(to top, 
            #e2e8f0 0%, 
            #cbd5e1 ${Math.max(0, displaySojuPercent - 5)}%, 
            #f59e0b ${Math.min(100, displaySojuPercent + 5)}%, 
            #d97706 100%)`;

    return (
        <div className="container mx-auto px-4 pt-8 pb-32 max-w-lg min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/"
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
                        <span className="text-yellow-500 font-bold">목표: 총량 90% & 비밀의 황금 비율!</span>
                    </p>
                </div>

                {/* Game Container */}
                <div className="relative w-40 h-80 bg-white/5 border-4 border-sky-300/50 rounded-b-3xl rounded-t-lg backdrop-blur-sm overflow-hidden mb-12 shadow-2xl">

                    {/* Liquid Layer */}
                    <div
                        className="absolute w-full transition-all duration-75 ease-linear shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        style={{
                            bottom: 0,
                            height: `${Math.min(100, displayTotal)}%`,
                            background: liquidBackground,
                            zIndex: 10
                        }}
                    >
                        <div className="absolute top-0 w-full h-1 bg-white/50 blur-[1px] animate-pulse" />
                    </div>

                    {/* Reflection */}
                    <div className="absolute top-0 left-2 w-3 h-full bg-gradient-to-r from-white/20 to-transparent rounded-l-full blur-[1px] z-20 pointer-events-none" />
                </div>

                {/* Controls */}
                <div className="w-full max-w-xs relative h-40 select-none">
                    {gameState === 'IDLE' && (
                        <button
                            onClick={startGame}
                            className="w-full py-5 rounded-2xl font-black text-xl shadow-lg bg-slate-200 text-slate-900 hover:scale-105 transition-transform active:scale-95"
                        >
                            소주 따르기 🍶
                        </button>
                    )}

                    {gameState === 'POURING_SOJU' && (
                        <button
                            onPointerDown={switchAction}
                            className="w-full py-5 rounded-2xl font-black text-2xl shadow-lg bg-amber-500 text-white animate-pulse active:scale-95"
                        >
                            맥주로 변경! 🍺
                        </button>
                    )}

                    {gameState === 'POURING_BEER' && (
                        <button
                            onPointerDown={switchAction}
                            className="w-full py-5 rounded-2xl font-black text-2xl shadow-lg bg-red-600 text-white animate-pulse active:scale-95"
                        >
                            STOP! 🛑
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
                                    {score === 100 ? '👑' : score && score >= 90 ? '😎' : score && score >= 60 ? '👍' : '😱'}
                                </div>

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
                                        <span>총량: <span className={Math.abs(displayTotal - 90) < 5 ? "text-green-400" : "text-white"}>{displayTotal.toFixed(1)}%</span> (목표 90%)</span>
                                    </div>
                                    <div className="flex justify-between px-8 mb-2">
                                        <span>소주 비율: <span className={Math.abs(displaySojuPercent - 30) < 3 ? "text-green-400" : "text-white"}>{displaySojuPercent.toFixed(1)}%</span> (목표 30%)</span>
                                    </div>
                                </div>

                                <button
                                    onClick={resetGame}
                                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                                >
                                    <RefreshCw className="w-5 h-5" /> 다시 도전
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="w-full mt-3 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <Share2 className="w-5 h-5 text-purple-500" />
                                    친구에게 공유
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div >
    );
}