'use client';

import { useEffect, useState } from 'react';

const SPIRIT_EMOJIS = ['🍶', '🥃', '🍺', '🍷', '🍾', '🥂', '🍹'];

export default function ExploreLoading() {
    const [currentEmoji, setCurrentEmoji] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmoji((prev) => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-center min-h-[60vh]">
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
        </div>
    );
}
