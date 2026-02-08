'use client';

import { useAuth } from '@/app/[lang]/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/login');
            } else if (role !== 'ADMIN') {
                alert('관리자 권한이 없습니다.');
                router.replace('/');
            }
        }
    }, [user, role, loading, router]);

    // Hide BottomNav on admin pages - more aggressive approach
    useEffect(() => {
        // Only run on admin pages
        if (!pathname?.includes('/admin')) return;

        // Add global CSS to hide bottom nav
        const style = document.createElement('style');
        style.id = 'admin-hide-bottom-nav';
        style.textContent = `
            body > div > div > div:has(nav) {
                display: none !important;
            }
            /* Target the specific BottomNav component structure */
            .fixed.bottom-0.left-0.right-0:has(nav) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            // Cleanup on unmount
            const existingStyle = document.getElementById('admin-hide-bottom-nav');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, [pathname]);

    if (loading || !user || role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-muted-foreground font-bold">인증 정보 확인 중...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
