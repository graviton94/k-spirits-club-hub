'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    theme: 'light',
    setTheme: () => { },
    loginWithGoogle: async () => { },
    logout: async () => { },
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
        // Load theme from localStorage after component mounts (client-side only)
        // This prevents hydration mismatches in Next.js SSR
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setThemeState(savedTheme);
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            }
        } else {
            // Default to light theme
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
                // Fetch Role & Profile from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();

                    // [Start] Hardcoded Admin Check
                    const ADMIN_EMAILS = ['ruahn49@gmail.com'];
                    let userRole = data.role as UserRole;
                    if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
                        userRole = 'ADMIN';
                    }
                    setRole(userRole);
                    // [End] Hardcoded Admin Check

                    const userTheme = data.themePreference || 'light';
                    setProfile({
                        nickname: data.nickname || currentUser.displayName || 'Anonymous',
                        profileImage: data.profileImage || '/icons/user/user-3.webp',
                        isFirstLogin: data.isFirstLogin ?? false,
                        themePreference: userTheme,
                        reviewsWritten: data.reviewsWritten || 0,
                        heartsReceived: data.heartsReceived || 0
                    });
                    // Apply theme from user profile (client-side only to prevent hydration issues)
                    setThemeState(userTheme);
                    if (typeof document !== 'undefined') {
                        document.documentElement.classList.toggle('dark', userTheme === 'dark');
                    }
                    localStorage.setItem('theme', userTheme);
                } else {
                    // Create new user doc with default role & profile
                    // nickname and isFirstLogin will be handled by Onboarding
                    const initialProfile = {
                        email: currentUser.email,
                        role: 'USER',
                        nickname: currentUser.displayName || 'New User',
                        profileImage: '/icons/user/user-3.webp', // Default avatar
                        isFirstLogin: true, // Trigger Onboarding
                        themePreference: 'light',
                        createdAt: new Date().toISOString()
                    };
                    await setDoc(userDocRef, initialProfile);
                    setRole('USER');
                    setProfile({
                        nickname: initialProfile.nickname,
                        profileImage: initialProfile.profileImage,
                        isFirstLogin: true,
                        themePreference: 'light'
                    });
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
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, data, { merge: true });
        setProfile(prev => prev ? { ...prev, ...data } : null);
    };

    const setTheme = (newTheme: 'light' | 'dark') => {
        setThemeState(newTheme);
        // Apply theme class only on client-side to prevent SSR hydration mismatches
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
        localStorage.setItem('theme', newTheme);

        // Save to user profile if logged in
        if (user) {
            updateProfile({ themePreference: newTheme });
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error) {
            console.error('Login Failed', error);
            alert('로그인에 실패했습니다.');
        }
    };

    const logout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, profile, role, loading, theme, setTheme, loginWithGoogle, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
