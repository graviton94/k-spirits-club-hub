'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPIRIT_EMOJIS = ['🍶', '🥃', '🍺', '🍷', '🍾', '🥂', '🍹', '🍸', '🧉'];

export default function Loading() {
    const [currentEmoji, setCurrentEmoji] = useState(0);

    useEffect(() => {
        // Slow down emoji interval to reduce re-renders
        const emojiInterval = setInterval(() => {
            setCurrentEmoji((prev) => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 3000);

        return () => {
            clearInterval(emojiInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-[9999]">
            <div className="flex flex-col items-center gap-12">
                {/* Optimized Minimalist Loader */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Simplified decorative glow without blur filter if possible, or very subtle */}
                    <div className="absolute w-40 h-40 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl" />

                    {/* Static Spirit Emoji Container */}
                    <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentEmoji}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-7xl select-none"
                            >
                                {SPIRIT_EMOJIS[currentEmoji]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Loading Typography with CSS-only animations */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/80">
                        {/* Static text for zero layout shifts */}
                        Loading Spirit Data
                    </p>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-amber-500 rounded-full loading-dot"
                                style={{
                                    animation: 'loading-pulse 1.4s infinite ease-in-out both',
                                    animationDelay: `${i * 0.16}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading-pulse {
                    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1.1); }
                }
                .loading-dot {
                    will-change: opacity, transform;
                }
            `}</style>
        </div>
    );
}
