export const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';

/**
 * 리팩토링된 최적의 Firestore 경로 설정
 */
export const getAppPath = (appId: string = APP_ID) => ({
    // 마스터 데이터 (최상위 컬렉션 유지)
    spirits: `spirits`,

    // 공용 리뷰 (제품별/유저별 조회가 용이한 평탄화 구조)
    reviews: `artifacts/${appId}/public/data/reviews`,

    // 유저별 프라이빗 술장
    userCabinet: (userId: string) => `artifacts/${appId}/users/${userId}/cabinet`
});
