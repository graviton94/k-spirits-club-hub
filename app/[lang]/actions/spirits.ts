"use server";

import { 
  dbListSpirits, 
  dbGetSpirit, 
  dbUpsertSpirit,
  dbAdminListRawSpirits
} from '@/lib/db/data-connect-client';
import { enrichSpiritWithAI } from '@/lib/services/gemini-translation';
import { revalidatePath } from 'next/cache';

/**
 * 일반 유저용 제품 목록 조회 액션
 * GQL에서 이미 isPublished: true 필터가 적용되어 있습니다.
 */
export async function getSpiritsAction(filters: any = {}) {
  try {
    // Data Connect Query (isPublished 필터는 GQL 내재화됨)
    const spirits = await dbListSpirits(filters.category);
    return spirits;
  } catch (error) {
    console.error('[Action] getSpiritsAction Error:', error);
    return [];
  }
}

/**
 * 개별 제품 상세 조회 액션 (서버 사이드)
 */
export async function getSpiritById(id: string) {
  try {
    const spirit = await dbGetSpirit(id);
    
    if (!spirit) return null;

    // GQL에서 필터링되지 않는 경우를 대비한 가드 (spirit 단일 조회는 GQL level filter가 어려울 수 있음)
    if (!spirit.isPublished) {
      console.warn(`[Action] Attempted to access unpublished spirit: ${id}`);
      return null;
    }

    return spirit;
  } catch (error) {
    console.error('[Action] getSpiritById Error:', error);
    return null;
  }
}

/**
 * 검색용 경량 인덱스 생성 액션
 */
export async function getSpiritsSearchIndex() {
  try {
    // 공개된 데이터만 조회 (GQL 필터링됨)
    const spirits = await dbListSpirits();

    if (!spirits || spirits.length === 0) return [];

    return spirits.map(s => ({
      i: s.id,
      n: s.name || '이름 없음',
      en: s.nameEn || null,
      c: s.category || '기타',
      t: s.imageUrl || null,
      a: s.abv || 0,
      d: s.distillery || null
    }));
  } catch (error) {
    console.error('[Action] getSpiritsSearchIndex Error:', error);
    return [];
  }
}

/**
 * [Admin] 제품 발행 및 AI 데이터 자동 생성 (Enrich on Publish)
 */
export async function publishSpiritAction(id: string, manualUpdates?: any) {
  try {
    console.log(`[Admin] Publishing and Enriching Spirit: ${id}`);
    
    // 1. 현재 데이터 조회
    const current = await dbGetSpirit(id);
    if (!current) throw new Error('Spirit not found');

    // 수동 업데이트 데이터 병합 (UI에서 수정한 값들)
    const baseData = { ...current, ...manualUpdates };

    // 2. AI Enrichment 실행 (발행 시점에만 1회 호출)
    console.log('[AI] Triggering Gemini enrichment...');
    const aiData = await enrichSpiritWithAI({
      name: baseData.name,
      category: baseData.category,
      subcategory: baseData.subcategory || undefined,
      distillery: baseData.distillery || undefined,
      abv: baseData.abv || undefined,
      region: baseData.region || undefined,
      country: baseData.country || undefined,
      name_en: baseData.nameEn || baseData.name_en || undefined,
    });

    // 3. DB 업데이트 (수동 데이터 + AI 데이터 + isPublished: true)
    await dbUpsertSpirit({
      ...baseData,
      ...aiData,
      isPublished: true,
      updatedAt: new Date().toISOString()
    });

    console.log(`[Admin] Successfully published and enriched: ${baseData.name}`);
    
    revalidatePath('/[lang]/contents/wiki', 'layout');
    revalidatePath('/[lang]/admin/spirits', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('[Action] publishSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * [Admin] 제품 정보 수동 업데이트 액션
 * UI의 Snake_case와 SQL의 CamelCase 간의 불일치를 해소하는 매퍼를 포함합니다.
 */
export async function updateSpiritAction(id: string, data: any) {
  try {
    console.log(`[Admin] Updating Spirit Data: ${id}`);
    
    // 1. 현재 데이터 조회 (기준점 확보)
    const current = await dbGetSpirit(id);
    if (!current) throw new Error('Spirit not found');

    // 2. UI 데이터(Snake) -> SQL 데이터(Camel) 매핑 및 병합
    const updatedFields = {
      ...current,
      // 명시적 매핑 (UI에서 보낼 수 있는 다양한 키 대응)
      nameEn: data.nameEn || data.name_en || current.nameEn,
      categoryEn: data.categoryEn || data.category_en || current.categoryEn,
      subcategory: data.subcategory || current.subcategory,
      distillery: data.distillery || current.distillery,
      region: data.region || current.region,
      country: data.country || current.country,
      abv: data.abv !== undefined ? Number(data.abv) : current.abv,
      
      // 설명 및 가이드 (CamelCase 우선)
      descriptionKo: data.descriptionKo || data.description_ko || current.descriptionKo,
      descriptionEn: data.descriptionEn || data.description_en || current.descriptionEn,
      pairingGuideKo: data.pairingGuideKo || data.pairing_guide_ko || current.pairingGuideKo,
      pairingGuideEn: data.pairingGuideEn || data.pairing_guide_en || current.pairingGuideEn,
      
      // 태그 및 테이스팅 노트
      noseTags: data.noseTags || data.nose_tags || current.noseTags || [],
      palateTags: data.palateTags || data.palate_tags || current.palateTags || [],
      finishTags: data.finishTags || data.finish_tags || current.finishTags || [],
      tastingNote: data.tastingNote || data.tasting_note || current.tastingNote,
      
      // 상태 및 메타데이터
      status: data.status || current.status,
      isPublished: data.isPublished !== undefined ? data.isPublished : current.isPublished,
      isReviewed: data.isReviewed !== undefined ? data.isReviewed : current.isReviewed,
      metadata: {
        ...(current.metadata || {}),
        ...(data.metadata || {})
      },
      updatedAt: new Date().toISOString()
    };

    // 3. DB 업데이트 (Data Connect)
    await dbUpsertSpirit(updatedFields);

    console.log(`[Admin] Successfully updated spirit: ${id}`);
    
    // 캐시 갱신
    revalidatePath('/[lang]/admin/spirits', 'page');
    revalidatePath('/[lang]/contents/wiki', 'layout');
    revalidatePath(`/[lang]/spirits/${id}`, 'page');

    return { success: true };
  } catch (error: any) {
    console.error('[Action] updateSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}
