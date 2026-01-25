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
    if (!mounted) {
        return <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800" />;
    }

    return (
        <div className="absolute inset-0 z-0">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Gradient overlay for bottom fade-out */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-background"
                style={{
                    background: `linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0) 60%, 
            rgba(255, 255, 255, 0.3) 80%, 
            rgba(255, 255, 255, 1) 100%
          )`
                }}
            />

            {/* Dark mode gradient overlay */}
            <div className="absolute inset-0 dark:block hidden"
                style={{
                    background: `linear-gradient(to bottom, 
            rgba(0, 0, 0, 0) 0%, 
            rgba(0, 0, 0, 0) 60%, 
            rgba(0, 0, 0, 0.5) 80%, 
            rgba(0, 0, 0, 1) 100%
          )`
                }}
            />
        </div>
    );
}
