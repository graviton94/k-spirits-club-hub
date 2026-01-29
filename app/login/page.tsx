'use client';

import { useAuth } from '@/app/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { user, loginWithGoogle, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    // Set page title for SEO
    useEffect(() => {
        document.title = `K-Spirits Club | 로그인 - Google 계정으로 시작하기`;
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
                <h1 className="text-3xl font-black mb-2 text-primary">🥃 K-Spirits Club</h1>
                <p className="text-muted-foreground mb-8">대한민국 No.1 글로벌 주류 데이터베이스</p>

                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md text-lg"
                    >
                        비회원으로 둘러보기
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Login</span>
                        </div>
                    </div>

                    <button
                        onClick={loginWithGoogle}
                        className="w-full py-4 bg-secondary text-secondary-foreground border border-input font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-accent transition-all"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Google 계정으로 로그인
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
