'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already verified their age
        const ageVerified = localStorage.getItem('age_verified');
        if (!ageVerified) {
            setIsOpen(true);
        }
    }, []);

    const handleAgeVerification = () => {
        // Set age verification in localStorage
        localStorage.setItem('age_verified', 'true');
        setIsOpen(false);
    };

    const handleExit = () => {
        // Redirect to Google
        window.location.href = 'https://www.google.com';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-gradient-to-br from-slate-900 to-slate-950 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-amber-900/30 relative overflow-hidden"
                    >
                        {/* Decorative background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="text-center mb-6">
                                <div className="inline-block p-4 bg-amber-900/20 rounded-full mb-4">
                                    <span className="text-5xl">🚨</span>
                                </div>
                                <h2 className="text-2xl font-black text-amber-100 mb-2">연령 확인</h2>
                                <p className="text-sm text-slate-400">Age Verification Required</p>
                            </div>

                            {/* Legal warnings */}
                            <div className="space-y-4 mb-8">
                                <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
                                    <p className="text-red-400 font-bold text-center text-base leading-relaxed">
                                        ⚠️ 청소년에게 술을 판매하는 것은<br />법으로 금지되어 있습니다
                                    </p>
                                    <p className="text-red-300/80 text-xs text-center mt-2">
                                        (청소년보호법 제2조, 제28조)
                                    </p>
                                </div>

                                <div className="bg-orange-950/20 border border-orange-900/30 rounded-xl p-4">
                                    <p className="text-orange-200 text-sm text-center leading-relaxed">
                                        ⚕️ 과도한 음주는 간경화나 간암을<br />유발할 수 있습니다
                                    </p>
                                    <p className="text-orange-300/60 text-xs text-center mt-2">
                                        (국민건강증진법 시행규칙 제7조)
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-300 text-xs text-center leading-relaxed">
                                        본 사이트는 주류에 관한 정보를 제공하는 플랫폼입니다.<br />
                                        만 19세 이상만 이용하실 수 있습니다.
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAgeVerification}
                                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-900/50 active:scale-[0.98]"
                                >
                                    ✓ 만 19세 이상입니다
                                </button>
                                
                                <button
                                    onClick={handleExit}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700 active:scale-[0.98]"
                                >
                                    ← 나가기
                                </button>
                            </div>

                            {/* Footer notice */}
                            <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
                                이 확인은 법적 요구사항을 준수하기 위한 것이며,<br />
                                귀하의 정보는 저장되지 않습니다.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
