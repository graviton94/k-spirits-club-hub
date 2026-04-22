'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const BACKGROUNDS = ['/background-v1.webp', '/background-v2.webp'];

export function RandomBackground() {
    // SSR/hydration 불일치 방지를 위해 초기값은 항상 v1으로 고정하고,
    // 클라이언트 마운트 후에만 랜덤 변경 (priority 이미지와 src 일치)
    const [bgImage, setBgImage] = useState<string>(BACKGROUNDS[0]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 마운트 후 랜덤 선택 — 브라우저 캐시가 있으면 즉시 렌더링됨
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        setBgImage(randomBg);
        setMounted(true);
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            {/* 
                LCP 최적화: priority prop으로 preload 발생.
                초기값(v1)과 실제 렌더링 이미지(랜덤)가 달랐던 preload 불일치 수정됨.
                - SSR: v1 (고정) → preload href="/background-v1.webp"
                - CSR 마운트: 랜덤 선택 후 교체 (캐시 활용)
            */}
            <Image
                key={bgImage}
                src={bgImage}
                alt="Background"
                fill
                priority={!mounted} // SSR/초기 렌더링 시에만 priority, 교체 시에는 lazy
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                className="transition-opacity duration-1000"
                unoptimized={true}
            />

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background z-10" />
            
            {/* Subtle Texture / Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20 mix-blend-overlay bg-[url('/noise.png')] bg-repeat" />

            <Image
                key={bgImage}
                src={bgImage}
                alt="Background"
                fill
                priority={!mounted}
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                className="transition-opacity duration-1000 brightness-75 contrast-110"
                unoptimized={true}
            />

            {/* Glowing Accent Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
        </div>
    );
}
