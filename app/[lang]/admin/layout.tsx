'use client';

import { useAuth } from '@/app/[lang]/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

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
