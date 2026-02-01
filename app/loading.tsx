'use client';

import { useEffect, useState } from 'react';

const SPIRIT_EMOJIS = ['🍶', '🥃', '🍺', '🍷', '🍾', '🥂', '🍹'];

export default function Loading() {
    const [currentEmoji, setCurrentEmoji] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmoji((prev) => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 400); // Change emoji every 400ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
            <div className="flex flex-col items-center gap-6">
                {/* Rotating Spirit Emoji */}
                <div className="text-7xl animate-bounce">
                    {SPIRIT_EMOJIS[currentEmoji]}
                </div>

                {/* Loading Dots */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
