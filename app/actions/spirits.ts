"use server";

import { spiritsDb } from '@/lib/db/firestore-rest';
import { Spirit, SpiritSearchIndex } from '@/lib/db/schema';

/**
 * 일반 유저용 제품 목록 조회 액션
 * status 필터 대신 isPublished 필터를 사용하여 데이터 누락을 방지합니다.
 */
export async function getSpiritsAction(filters: any = {}) {
  try {
    // 유저용 요청은 무조건 공개(isPublished: true)된 데이터만 필터링
    const queryFilters = { 
      ...filters, 
      isPublished: true 
    };
    
    // Firestore에서 데이터 조회
    const results = await spiritsDb.getAll(queryFilters);
    return (results || []) as Spirit[];
  } catch (error) {
    console.error('[Action] getSpiritsAction Error:', error);
    return [];
  }
}

/**
 * 검색용 경량 인덱스 생성 액션
 * 비로그인 유저도 즉시 검색할 수 있도록 필드 매핑을 최적화합니다.
 */
export async function getSpiritsSearchIndex(): Promise<SpiritSearchIndex[]> {
  try {
    // 공개된 데이터만 전수 조사하여 인덱스 구축
    const spirits = await spiritsDb.getAll({ isPublished: true });
    
    if (!spirits || spirits.length === 0) {
      console.warn('[Action] 검색할 수 있는 공개된 데이터가 없습니다.');
      return [];
    }

    return spirits.map(s => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.name_en || s.metadata?.name_en || null,
      c: s.category || '기타',
      mc: s.mainCategory || null,
      sc: s.subcategory || null,
      t: s.thumbnailUrl || s.imageUrl || null // 썸네일 누락 시 원본 이미지로 폴백
    }));
  } catch (error) {
    console.error('[Action] getSpiritsSearchIndex Error:', error);
    return [];
  }
}
