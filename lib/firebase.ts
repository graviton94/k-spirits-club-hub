import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// .env 파일의 설정을 가져옵니다.
let firebaseConfig;
try {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');
} catch (error) {
    console.warn('Firebase Config Parse Error:', error);
    firebaseConfig = {};
}

// 앱 초기화 (중복 방지)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 서비스 인스턴스 내보내기
export const db = getFirestore(app);
export const auth = getAuth(app);
export const appId = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
