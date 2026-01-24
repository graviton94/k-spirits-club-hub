import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // 1. GoogleAuthProvider 추가

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ",
    authDomain: "k-spirits-club.firebaseapp.com",
    projectId: "k-spirits-club",
    storageBucket: "k-spirits-club.firebasestorage.app",
    messagingSenderId: "65395658426",
    appId: "1:65395658426:web:4f7010f68d3475dffbbc83",
    measurementId: "G-0QF9WTQFF2"
};

// 앱 초기화 (중복 방지)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 서비스 인스턴스 내보내기
export const db = getFirestore(app);
export const auth = getAuth(app);

// 2. 구글 로그인 제공자 인스턴스 생성 및 내보내기
export const googleProvider = new GoogleAuthProvider();

// 구글 로그인 시 매번 계정 선택창이 뜨게 하고 싶다면 아래 한 줄 추가 (선택사항)
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appId = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';