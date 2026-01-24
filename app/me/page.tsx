'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyPage() {
    const { user, role, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        router.replace('/login');
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4 overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>
                    <h1 className="text-2xl font-black">{user.displayName || '이름 없음'}</h1>
                    <p className="text-muted-foreground mb-4">{user.email}</p>

                    <div className="px-4 py-1 rounded-full bg-secondary text-xs font-bold mb-8">
                        {role === 'ADMIN' ? '👑 관리자 (Administrator)' : '멤버 (Member)'}
                    </div>

                    <div className="w-full space-y-4">
                        {role === 'ADMIN' && (
                            <Link href="/admin" className="block w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all">
                                관리자 대시보드 바로가기
                            </Link>
                        )}

                        <button
                            onClick={logout}
                            className="w-full py-4 border border-destructive/20 text-destructive font-bold rounded-xl hover:bg-destructive/10 transition-all"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
