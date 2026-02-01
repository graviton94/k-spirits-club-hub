'use client';

import { useAuth } from '@/app/context/auth-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuccessToast from '@/components/ui/SuccessToast';

export default function LoginPage() {
    const { user, loginWithGoogle, loading } = useAuth();
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

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
                <p className="text-muted-foreground mb-8">대한민국 No.1 주류 커뮤니티</p>

                <div className="space-y-4">
                    <button
                        onClick={loginWithGoogle}
                        className="w-full py-5 bg-white text-black border border-neutral-200 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all shadow-sm text-lg"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        Google 계정으로 시작하기
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground font-medium">OR</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all text-base"
                    >
                        비회원으로 둘러보기
                    </button>
                </div>

                {/* Kakao In-app Browser Warning */}
                <div className="mt-10 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-2 flex items-center gap-1">
                        ⚠️ 카카오톡으로 접속하셨나요?
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                        카카오톡 인앱 브라우저에서는 구글 로그인이 원활하지 않을 수 있습니다.
                        정상적인 이용을 위해 아래 링크를 복사하여 <strong>크롬(Chrome)</strong>이나 <strong>사파리(Safari)</strong> 브라우저로 접속해주세요!
                    </p>
                    <button
                        onClick={() => {
                            const url = window.location.origin;
                            navigator.clipboard.writeText(url);
                            setToastMessage('🔗주소가 복사되었습니다! 크롬/사파리로 접속해주세요!');
                            setShowToast(true);
                        }}
                        className="w-full py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        접속 주소 복사하기
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-[10px] text-muted-foreground">
                        로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
