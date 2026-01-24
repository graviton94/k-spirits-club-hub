import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase 설정 (Public Config - 클라이언트에 노출되어도 안전)
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
export const appId = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
