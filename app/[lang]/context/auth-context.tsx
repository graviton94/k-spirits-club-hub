'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { dbGetUserProfile, dbUpsertUser } from '@/lib/db/data-connect-client';
import { useRouter } from 'next/navigation';

type UserRole = 'ADMIN' | 'USER' | null;

interface UserProfile {
    nickname: string;
    profileImage: string | null;
    isFirstLogin: boolean;
    themePreference?: 'light' | 'dark';
    reviewsWritten?: number;
    heartsReceived?: number;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: UserRole;
    loading: boolean;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    loginWithGoogle: (redirectPath?: string) => Promise<void>;
    logout: (redirectPath?: string) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    theme: 'light',
    setTheme: () => { },
    loginWithGoogle: async (redirectPath?: string) => { },
    logout: async (redirectPath?: string) => { },
    updateProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setThemeState] = useState<'light' | 'dark'>('light');
    const router = useRouter();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setThemeState(savedTheme);
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            }
        } else {
            setThemeState('light');
            if (typeof document !== 'undefined') {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userData = await dbGetUserProfile(currentUser.uid) as any;

                    if (userData) {
                        const ADMIN_EMAILS = ['ruahn49@gmail.com'];
                        let userRole = userData.role as UserRole;
                        if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
                            userRole = 'ADMIN';
                        }
                        setRole(userRole);

                        const userTheme = (userData.themePreference as 'light' | 'dark') || 'light';
                        setProfile({
                            nickname: userData.nickname || currentUser.displayName || 'Anonymous',
                            profileImage: userData.profileImage || '/icons/user/user-3.webp',
                            isFirstLogin: userData.isFirstLogin ?? false,
                            themePreference: userTheme,
                            reviewsWritten: userData.reviewsWritten || 0,
                            heartsReceived: userData.heartsReceived || 0
                        });
                        
                        setThemeState(userTheme);
                        if (typeof document !== 'undefined') {
                            document.documentElement.classList.toggle('dark', userTheme === 'dark');
                        }
                        localStorage.setItem('theme', userTheme);
                    } else {
                        const initialProfile = {
                            id: currentUser.uid,
                            email: currentUser.email,
                            role: 'USER',
                            nickname: currentUser.displayName || 'New User',
                            profileImage: '/icons/user/user-3.webp',
                            isFirstLogin: true,
                        };
                        await dbUpsertUser(initialProfile);
                        setRole('USER');
                        setProfile({
                            nickname: initialProfile.nickname,
                            profileImage: initialProfile.profileImage,
                            isFirstLogin: true,
                            themePreference: 'light'
                        });
                    }
                } catch (err) {
                    console.error('Data Connect Auth Error:', err);
                }
            } else {
                setUser(null);
                setRole(null);
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        await dbUpsertUser({
            id: user.uid,
            ...data
        });
        setProfile(prev => prev ? { ...prev, ...data } : null);
    };

    const setTheme = (newTheme: 'light' | 'dark') => {
        setThemeState(newTheme);
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        localStorage.setItem('theme', newTheme);

        if (user) {
            updateProfile({ themePreference: newTheme });
        }
    };

    const loginWithGoogle = async (redirectPath?: string) => {
        try {
            if (typeof window !== 'undefined' && window.location.hostname.endsWith('.workers.dev')) {
                alert('Preview domain login is disabled. Use the production domain or add this workers.dev domain to Firebase Auth authorized domains.');
                return;
            }
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push(redirectPath || '/');
        } catch (error) {
            console.error('Login Failed', error);
            alert('로그인에 실패했습니다.');
        }
    };

    const logout = async (redirectPath?: string) => {
        await signOut(auth);
        router.push(redirectPath || '/');
    };

    return (
        <AuthContext.Provider value={{ user, profile, role, loading, theme, setTheme, loginWithGoogle, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
