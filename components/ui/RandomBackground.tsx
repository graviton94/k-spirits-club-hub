'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const BACKGROUNDS = ['/background-v1.webp', '/background-v2.webp'];

export function RandomBackground() {
    // SSR과 클라이언트 초기 렌더링을 일치시키기 위해 고정된 초기값을 가집니다.
    // LCP를 위해 v2를 우선적으로 렌더링되도록 하거나, 고정된 이미지를 사용할 수 있습니다.
    const [bgImage, setBgImage] = useState<string>(BACKGROUNDS[1]); // v2를 기본값으로 설정 (LCP 리포트 기준)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 마운트 후 랜덤하게 변경 (이미 v2가 로드되었다면 캐시 효과가 있거나 교체됨)
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        setBgImage(randomBg);
        setMounted(true);
    }, []);

    return (
        <div className="absolute inset-0 z-[-1]">
            {/* 
                LCP 최적화를 위한 Next.js Image 컴포넌트 사용 
                - priority: 브라우저가 이 이미지를 높은 우선순위로 간주하고 미리 로드합니다.
                - fill: 부모 컨테이너를 가득 채웁니다.
                - objectFit="cover": CSS object-cover와 동일한 동작.
                - quality: 화질 조절 (필요 시)
            */}
            <Image
                src={bgImage}
                alt="Background"
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                className="transition-opacity duration-1000"
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
