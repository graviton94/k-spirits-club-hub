'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { generateRandomNickname } from '@/lib/utils/nickname-generator';

export default function OnboardingModal() {
    const { user, profile, updateProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show modal if user is logged in, profile exists, and it's first login
        if (user && profile?.isFirstLogin) {
            setIsOpen(true);
            if (!nickname) {
                setNickname(profile.nickname || generateRandomNickname());
            }
        } else {
            setIsOpen(false);
        }
    }, [user, profile]);

    const handleRolling = () => {
        setNickname(generateRandomNickname());
    };

    const handleSubmit = async () => {
        if (!nickname.trim()) return alert('닉네임을 입력해주세요.');

        setLoading(true);
        try {
            await updateProfile({
                nickname: nickname,
                isFirstLogin: false // Mark as onboarding complete
            });
            setIsOpen(false);
            alert('환영합니다! 회원가입이 완료되었습니다.');
        } catch (error) {
            console.error(error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-md rounded-3xl p-8 shadow-2xl border border-border">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black mb-2">🎉 환영합니다!</h2>
                    <p className="text-muted-foreground">Club Hub에서 사용할 닉네임을 정해주세요.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4 overflow-hidden border-2 border-primary">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>👤</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">프로필 사진은 구글 계정을 따릅니다.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2 ml-1">닉네임</label>
                        <div className="flex gap-2">
                            <input
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="flex-1 bg-secondary/50 border border-input rounded-xl px-4 py-3 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="닉네임 입력"
                            />
                            <button
                                onClick={handleRolling}
                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-3 rounded-xl transition-colors"
                                title="랜덤 생성"
                            >
                                🎲
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg hover:shadow-primary/25"
                    >
                        {loading ? '저장 중...' : '시작하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
