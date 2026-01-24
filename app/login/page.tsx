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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
                <h1 className="text-3xl font-black mb-2">🥂 Welcome Back</h1>
                <p className="text-muted-foreground mb-8">K-Spirits Club Hub에 오신 것을 환영합니다.</p>

                <button
                    onClick={loginWithGoogle}
                    className="w-full py-4 bg-white text-black border border-gray-300 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                    Google 계정으로 계속하기
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">또는</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all"
                    >
                        비회원으로 둘러보기
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        로그인함으로써 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
