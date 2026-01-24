'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { generateRandomNickname } from '@/lib/utils/nickname-generator';

export default function MyPage() {
    const { user, role, profile, logout, loading, updateProfile, loginWithGoogle } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: '', profileImage: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setEditForm({
                nickname: profile.nickname,
                profileImage: profile.profileImage || ''
            });
        }
    }, [profile]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Guest View
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-sm min-h-[80vh] flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">🥃</div>
                    <h1 className="text-2xl font-bold">K-Spirits Club</h1>
                    <p className="text-muted-foreground mb-8">
                        로그인하고 나만의 주류 캐비닛을 관리하세요.<br />
                        리뷰를 남기고 다른 애호가들과 소통해보세요!
                    </p>

                    <button
                        onClick={loginWithGoogle}
                        className="w-full py-4 bg-white text-black border border-gray-200 rounded-xl font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google 계정으로 계속하기
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                또는
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/login"
                        className="block w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-bold hover:opacity-80 transition-all"
                    >
                        이메일로 시작하기
                    </Link>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                nickname: editForm.nickname,
                profileImage: editForm.profileImage || null
            });
            setIsEditing(false);
            alert('프로필이 수정되었습니다.');
        } catch (error) {
            alert('수정 실패');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-4 overflow-hidden relative group">
                        {editForm.profileImage ? (
                            <img src={editForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="w-full space-y-4 mb-6">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1 text-left">닉네임</label>
                                <div className="flex gap-2">
                                    <input
                                        className="bg-secondary px-4 py-2 rounded-xl text-center font-black text-xl w-full border border-border"
                                        value={editForm.nickname}
                                        onChange={e => setEditForm({ ...editForm, nickname: e.target.value })}
                                    />
                                    <button onClick={() => setEditForm(prev => ({ ...prev, nickname: generateRandomNickname() }))} className="bg-secondary border border-border px-3 rounded-xl">🎲</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1 text-left">프로필 이미지 URL</label>
                                <input
                                    className="bg-secondary px-4 py-2 rounded-xl font-mono text-xs w-full border border-border"
                                    value={editForm.profileImage}
                                    onChange={e => setEditForm({ ...editForm, profileImage: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-secondary rounded-xl font-bold">취소</button>
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold">저장</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-black mb-1">{profile?.nickname || user.displayName}</h1>
                            <p className="text-muted-foreground mb-4 text-sm">{user.email}</p>

                            <div className="px-4 py-1 rounded-full bg-secondary text-xs font-bold mb-8">
                                {role === 'ADMIN' ? '👑 관리자' : '🥂 클럽 멤버'}
                            </div>

                            {/* User Stats Summary (Placeholder) */}
                            <div className="grid grid-cols-3 gap-4 w-full mb-8">
                                <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
                                    <span className="text-2xl mb-1">📝</span>
                                    <span className="text-lg font-black">0</span>
                                    <span className="text-xs text-muted-foreground">내가 쓴 글</span>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
                                    <span className="text-2xl mb-1">❤️</span>
                                    <span className="text-lg font-black">0</span>
                                    <span className="text-xs text-muted-foreground">받은 추천</span>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
                                    <span className="text-2xl mb-1">🥃</span>
                                    <span className="text-lg font-black">0</span>
                                    <span className="text-xs text-muted-foreground">내 술장</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all"
                                >
                                    프로필 수정
                                </button>

                                {role === 'ADMIN' && (
                                    <Link href="/admin" className="block w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all">
                                        관리자 대시보드
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="w-full py-3 border border-destructive/20 text-destructive font-bold rounded-xl hover:bg-destructive/10 transition-all"
                                >
                                    로그아웃
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
