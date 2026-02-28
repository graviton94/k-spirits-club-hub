'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // pathname이 변경될 때마다 브라우저 최상단으로 스크롤 이동
        // setTimeout을 주어 Next.js 라우팅에 의한 DOM 업데이트 직후에 스크롤되도록 보장
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 10);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
