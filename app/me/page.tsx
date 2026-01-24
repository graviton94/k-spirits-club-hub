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

    // Guest Data Fallback
    const nickname = user ? (profile?.nickname || user.displayName) : "손님 (비회원)";
    const email = user ? user.email : "로그인이 필요합니다";
    const roleBadge = user ? (role === 'ADMIN' ? '👑 관리자' : '🥂 클럽 멤버') : '👀 구경꾼';

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
                        {user && editForm.profileImage ? (
                            <img src={editForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    {isEditing && user ? (
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
                            <h1 className="text-2xl font-black mb-1">{nickname}</h1>
                            <p className="text-muted-foreground mb-4 text-sm">{email}</p>

                            <div className="px-4 py-1 rounded-full bg-secondary text-xs font-bold mb-8">
                                {roleBadge}
                            </div>

                            {/* User Stats Summary */}
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
                                {!user ? (
                                    <Link
                                        href="/login"
                                        className="block w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md"
                                    >
                                        로그인 / 회원가입 하러가기
                                    </Link>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
