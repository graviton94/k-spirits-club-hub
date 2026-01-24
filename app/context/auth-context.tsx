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
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: UserRole;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
    updateProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                    setRole(data.role as UserRole);
                    setProfile({
                        nickname: data.nickname || currentUser.displayName || 'Anonymous',
                        profileImage: data.profileImage || currentUser.photoURL,
                        isFirstLogin: data.isFirstLogin ?? false
                    });
                } else {
                    // Create new user doc with default role & profile
                    // nickname and isFirstLogin will be handled by Onboarding
                    const initialProfile = {
                        email: currentUser.email,
                        role: 'USER',
                        nickname: currentUser.displayName || 'New User',
                        profileImage: currentUser.photoURL,
                        isFirstLogin: true, // Trigger Onboarding
                        createdAt: new Date().toISOString()
                    };
                    await setDoc(userDocRef, initialProfile);
                    setRole('USER');
                    setProfile({
                        nickname: initialProfile.nickname,
                        profileImage: initialProfile.profileImage,
                        isFirstLogin: true
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
        <AuthContext.Provider value={{ user, profile, role, loading, loginWithGoogle, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
