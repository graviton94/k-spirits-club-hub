'use client';

import { useEffect, useState } from 'react';

const BACKGROUNDS = ['/background(1).png', '/background(2).png'];

export function RandomBackground() {
    const [bgImage, setBgImage] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Select random background on mount
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        setBgImage(randomBg);
        setMounted(true);
    }, []);

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted || !bgImage) {
        return <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800" />;
    }

    return (
        <div className="absolute inset-0 z-0">
            {/* Background Image */}
            <img
                src={bgImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay: transparent -> black -> transparent/white */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to bottom,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.8) 70%,
            transparent 100%
          )`
                }}
            />
        </div>
    );
}
