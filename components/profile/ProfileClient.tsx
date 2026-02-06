'use client';

import { useAuth } from '@/app/[lang]/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { generateRandomNickname } from '@/lib/utils/nickname-generator';
import { getUserCabinet } from '@/app/[lang]/actions/cabinet';
import { CabinetItem } from '@/lib/utils/spirit-adapters';
import AvatarSelector, { DEFAULT_AVATAR } from '@/components/profile/AvatarSelector';
import SuccessToast from '@/components/ui/SuccessToast';
import { Locale } from '@/i18n-config';

interface ProfileClientProps {
    lang: Locale;
    dict: any;
}

export default function ProfileClient({ lang, dict }: ProfileClientProps) {
    const { user, role, profile, logout, loading, updateProfile, loginWithGoogle, theme, setTheme } = useAuth();
    const router = useRouter();
    const isEn = lang === 'en';

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: '', profileImage: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);
    const [likesReceived, setLikesReceived] = useState(0);
    const [cabinetCount, setCabinetCount] = useState(0);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (profile) {
            setEditForm({
                nickname: profile.nickname,
                profileImage: profile.profileImage || DEFAULT_AVATAR
            });
        }
    }, [profile]);

    // Set page title for SEO
    useEffect(() => {
        document.title = isEn
            ? `My Profile | K-Spirits Club`
            : `K-Spirits Club | 내 프로필 - 설정 & 리뷰 관리`;
    }, [isEn]);

    // Load user stats
    useEffect(() => {
        if (user && !loading) {
            loadUserStats();
        }
    }, [user, loading]);

    const loadUserStats = async () => {
        if (!user) return;

        setIsLoadingStats(true);
        try {
            const cabinetData = await getUserCabinet(user.uid) as CabinetItem[];
            const ownedSpirits = cabinetData.filter((item) => !item.isWishlist);
            setCabinetCount(ownedSpirits.length);

            const response = await fetch('/api/users/stats', {
                headers: {
                    'x-user-id': user.uid
                }
            });

            if (response.ok) {
                const stats = await response.json();
                setReviewCount(stats.reviewCount || 0);
                setLikesReceived(stats.totalLikes || 0);
            } else {
                setReviewCount(0);
                setLikesReceived(0);
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
            setReviewCount(0);
            setLikesReceived(0);
        } finally {
            setIsLoadingStats(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
            <span className="text-4xl mb-4">🥃</span>
            <p className="font-bold">{isEn ? "Checking account information..." : "계정 정보를 확인하는 중입니다..."}</p>
        </div>
    );

    const nickname = user ? (profile?.nickname || user.displayName) : (isEn ? "Guest" : "손님 (비회원)");
    const email = user ? user.email : (isEn ? "Login required" : "로그인이 필요합니다");
    const roleBadge = user ? (role === 'ADMIN' ? (isEn ? "👑 Admin" : "👑 관리자") : (isEn ? "🥂 Club Member" : "🥂 클럽 멤버")) : (isEn ? "👀 Viewer" : "👀 구경꾼");

    const personaBadge = user ? { emoji: "🥃", title: isEn ? "Whisky Lover" : "위스키 애호가" } : null;

    // Date formatting
    const joinedAt = user?.metadata?.creationTime;
    const formattedDate = useMemo(() => {
        if (!joinedAt) return null;
        const date = new Date(joinedAt);
        if (isEn) {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        } else {
            return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.').replace(/ /g, '');
        }
    }, [joinedAt, isEn]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                nickname: editForm.nickname,
                profileImage: editForm.profileImage || null
            });
            setIsEditing(false);
            setShowToast(true);
        } catch (error) {
            alert(isEn ? 'Correction failed' : '수정 실패');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setEditForm({
                nickname: profile.nickname,
                profileImage: profile.profileImage || DEFAULT_AVATAR
            });
        }
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl min-h-[70vh]">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 overflow-hidden border-2 border-border shadow-lg">
                        {user && (editForm.profileImage || DEFAULT_AVATAR) ? (
                            <img src={editForm.profileImage || DEFAULT_AVATAR} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    {isEditing && user ? (
                        <div className="w-full space-y-4 mb-6">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1 text-left">{isEn ? "Nickname" : "닉네임"}</label>
                                <div className="flex gap-2">
                                    <input
                                        className="bg-secondary px-4 py-2 rounded-xl text-center font-black text-xl w-full border border-border"
                                        value={editForm.nickname}
                                        onChange={e => setEditForm({ ...editForm, nickname: e.target.value })}
                                    />
                                    <button onClick={() => setEditForm(prev => ({ ...prev, nickname: generateRandomNickname() }))} className="bg-secondary border border-border px-3 rounded-xl">🎲</button>
                                </div>
                            </div>

                            <AvatarSelector
                                selectedAvatar={editForm.profileImage || DEFAULT_AVATAR}
                                onSelect={(avatarPath) => setEditForm({ ...editForm, profileImage: avatarPath })}
                            />

                            <div className="flex gap-2">
                                <button onClick={handleCancel} className="flex-1 py-3 bg-secondary rounded-xl font-bold">{isEn ? "Cancel" : "취소"}</button>
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold">{isEn ? "Save" : "저장"}</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-black mb-1">{nickname}</h1>
                            <p className="text-muted-foreground mb-4 text-sm">{email}</p>

                            <div className="flex flex-col items-center gap-2 mb-8">
                                <div className="px-4 py-1 rounded-full bg-secondary text-xs font-bold">
                                    {roleBadge}
                                </div>
                                {formattedDate && (
                                    <p className="text-[10px] text-muted-foreground">
                                        {dict.joined || "Joined"}: {formattedDate}
                                    </p>
                                )}
                            </div>

                            {personaBadge && (
                                <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                                    <span className="text-lg">{personaBadge.emoji}</span>
                                    <span className="text-xs font-semibold text-amber-200">{personaBadge.title}</span>
                                </div>
                            )}

                            <div className="relative mb-8 w-full">
                                <div className="grid grid-cols-3 gap-4 w-full">
                                    <Link href={`/${lang}/me/reviews`} className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center hover:bg-secondary/50 transition-colors">
                                        <span className="text-2xl mb-1">📝</span>
                                        <span className="text-lg font-black">{isLoadingStats ? '...' : reviewCount}</span>
                                        <span className="text-xs text-muted-foreground">{dict.reviews || "Reviews"}</span>
                                    </Link>
                                    <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center">
                                        <span className="text-2xl mb-1">❤️</span>
                                        <span className="text-lg font-black">{isLoadingStats ? '...' : likesReceived}</span>
                                        <span className="text-xs text-muted-foreground">{dict.likes || "Likes"}</span>
                                    </div>
                                    <Link href={`/${lang}/cabinet`} className="bg-secondary/30 p-4 rounded-2xl flex flex-col items-center hover:bg-secondary/50 transition-colors">
                                        <span className="text-2xl mb-1">🥃</span>
                                        <span className="text-lg font-black">{isLoadingStats ? '...' : cabinetCount}</span>
                                        <span className="text-xs text-muted-foreground">{isEn ? "Cabinet" : "술장"}</span>
                                    </Link>
                                </div>

                                {!user && (
                                    <div className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                        <Link
                                            href={`/${lang}/login`}
                                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
                                        >
                                            {isEn ? "Join Now 🚀" : "회원가입 하기 🚀"}
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
                                            {isEn ? "Edit Profile" : "프로필 수정"}
                                        </button>

                                        {role === 'ADMIN' && (
                                            <Link href={`/${lang}/admin`} className="block w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all text-center">
                                                {isEn ? "Admin Dashboard" : "관리자 대시보드"}
                                            </Link>
                                        )}

                                        <button
                                            onClick={logout}
                                            className="w-full py-3 border border-destructive/20 text-destructive font-bold rounded-xl hover:bg-destructive/10 transition-all"
                                        >
                                            {dict.logout || (isEn ? "Log Out" : "로그아웃")}
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <SuccessToast
                isVisible={showToast}
                message={isEn ? "Profile updated! 🎉" : "프로필이 수정되었습니다! 🎉"}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
