'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { generateRandomNickname } from '@/lib/utils/nickname-generator';

export default function MyPage() {
    const { user, role, profile, logout, loading, updateProfile, loginWithGoogle, theme, setTheme } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: '', profileImage: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        if (profile) {
            setEditForm({
                nickname: profile.nickname,
                profileImage: profile.profileImage || ''
            });
        }
    }, [profile]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError('');

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('파일 크기는 2MB 이하여야 합니다');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('이미지 파일만 업로드 가능합니다');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
            setEditForm({ ...editForm, profileImage: reader.result as string });
        };
        reader.onerror = () => {
            setUploadError('파일 읽기에 실패했습니다');
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // Guest Data Fallback
    const nickname = user ? (profile?.nickname || user.displayName) : "손님 (비회원)";
    const email = user ? user.email : "로그인이 필요합니다";
    const roleBadge = user ? (role === 'ADMIN' ? '👑 관리자' : '🥂 클럽 멤버') : '👀 구경꾼';

    // Mock user persona badge (would fetch from user data in production)
    const personaBadge = user ? { emoji: "🥃", title: "위스키 애호가" } : null;

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

                            {/* Profile Image Upload */}
                            <div>
                                <label className="text-xs text-muted-foreground block mb-2 text-left">프로필 이미지</label>

                                {/* Tab Switcher */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setUploadMethod('url')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${uploadMethod === 'url'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        URL 입력
                                    </button>
                                    <button
                                        onClick={() => setUploadMethod('file')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${uploadMethod === 'file'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        파일 업로드
                                    </button>
                                </div>

                                {/* URL Input */}
                                {uploadMethod === 'url' && (
                                    <input
                                        className="bg-secondary px-4 py-2 rounded-xl font-mono text-xs w-full border border-border"
                                        value={editForm.profileImage}
                                        onChange={e => setEditForm({ ...editForm, profileImage: e.target.value })}
                                        placeholder="https://..."
                                    />
                                )}

                                {/* File Upload */}
                                {uploadMethod === 'file' && (
                                    <div className="space-y-2">
                                        <label className="block">
                                            <div className="bg-secondary border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/80 transition-colors">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                                <div className="text-3xl mb-2">📸</div>
                                                <p className="text-sm font-semibold">사진 선택 또는 촬영</p>
                                                <p className="text-xs text-muted-foreground mt-1">최대 2MB</p>
                                            </div>
                                        </label>
                                        {uploadError && (
                                            <p className="text-xs text-red-500">{uploadError}</p>
                                        )}
                                    </div>
                                )}
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

                            {/* Persona Badge - Small and refined */}
                            {personaBadge && (
                                <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                                    <span className="text-lg">{personaBadge.emoji}</span>
                                    <span className="text-xs font-semibold text-amber-200">{personaBadge.title}</span>
                                </div>
                            )}

                            {/* User Stats Summary with Guest Overlay */}
                            <div className="relative mb-8">
                                <div className="grid grid-cols-3 gap-4 w-full">
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

                                {/* Glassmorphism Overlay for Guests */}
                                {!user && (
                                    <div className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                        <Link
                                            href="/login"
                                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
                                        >
                                            회원가입 하기 🚀
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3">
                                {user && (
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
