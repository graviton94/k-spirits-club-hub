"use server";

import { 
  dbListSpirits, 
  dbGetSpirit, 
  dbUpsertSpirit,
  dbAdminListRawSpirits
} from '@/lib/db/data-connect-client';
import { enrichSpiritWithAI, calculateDynamicEditorRating } from '@/lib/services/gemini-translation';
import { revalidatePath, revalidateTag } from 'next/cache';

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
 * [INTERNAL] SQL Mapper Utility
 * Bridges the gap between AI results (snake_case), legacy fields, and the official SQL schema (CamelCase).
 * Uses nullish coalescing (??) to allow persistence of empty strings (clearing fields).
 */
function mapToSQLFields(current: any, incoming: any) {
  return {
    ...current,
    // Basic Info
    nameEn: incoming.nameEn ?? current.nameEn,
    categoryEn: incoming.categoryEn ?? current.categoryEn,
    subcategory: incoming.subcategory ?? current.subcategory,
    distillery: incoming.distillery ?? current.distillery,
    region: incoming.region ?? current.region,
    country: incoming.country ?? current.country,
    abv: incoming.abv !== undefined 
      ? (typeof incoming.abv === 'string' ? parseFloat(incoming.abv) : incoming.abv) 
      : current.abv,
    
    // Detailed Content
    descriptionKo: incoming.descriptionKo ?? current.descriptionKo,
    descriptionEn: incoming.descriptionEn ?? current.descriptionEn,
    pairingGuideKo: incoming.pairingGuideKo ?? current.pairingGuideKo,
    pairingGuideEn: incoming.pairingGuideEn ?? current.pairingGuideEn,
    
    // Sensory DNA
    noseTags: incoming.noseTags ?? current.noseTags ?? [],
    palateTags: incoming.palateTags ?? current.palateTags ?? [],
    finishTags: incoming.finishTags ?? current.finishTags ?? [],
    tastingNote: incoming.tastingNote ?? current.tastingNote,
    
    // Administrative Status
    status: incoming.status ?? current.status,
    isPublished: incoming.isPublished ?? current.isPublished,
    isReviewed: incoming.isReviewed ?? current.isReviewed,
    rating: incoming.rating ?? current.rating,
    
    // [DYNAMIC RATING] Intelligence Engine
    // If not reviewed yet, rating should be null to avoid "False 4.0"
    rating: (incoming.isReviewed ?? current.isReviewed) 
      ? calculateDynamicEditorRating({
          descriptionKo: incoming.descriptionKo ?? current.descriptionKo,
          descriptionEn: incoming.descriptionEn ?? current.descriptionEn,
          noseTags: incoming.noseTags ?? current.noseTags ?? [],
          palateTags: incoming.palateTags ?? current.palateTags ?? [],
          finishTags: incoming.finishTags ?? current.finishTags ?? [],
          pairingGuideKo: incoming.pairingGuideKo ?? current.pairingGuideKo,
        })
      : null,

    // Metadata block merging
    metadata: {
      ...(current.metadata || {}),
      ...(incoming.metadata || {}),
      // Flattening AI confidence/sources if they came in root
      confidence: incoming.confidence ?? incoming.metadata?.confidence ?? current.metadata?.confidence,
      sources: incoming.sources ?? incoming.metadata?.sources ?? current.metadata?.sources,
    },
    updatedAt: new Date().toISOString()
  };
}

/**
 * [Admin] 제품 발행 및 AI 데이터 자동 생성 (Enrich on Publish)
 */
export async function publishSpiritAction(id: string, manualUpdates?: any) {
  try {
    console.log(`[Admin] Surgery: Publishing & Grounding: ${id}`);
    
    const current = await dbGetSpirit(id);
    if (!current) throw new Error('Spirit not found');

    // 1. Merge manual updates first
    const baseData = mapToSQLFields(current, manualUpdates || {});

    // 2. Trigger Grounded Research
    const aiData = await enrichSpiritWithAI({
      name: baseData.name,
      category: baseData.category,
      subcategory: baseData.subcategory || undefined,
      distillery: baseData.distillery || undefined,
      abv: baseData.abv || undefined,
      region: baseData.region || undefined,
      country: baseData.country || undefined,
      nameEn: baseData.nameEn || undefined,
    });

    // 3. Final transformation and persistence
    const finalData = mapToSQLFields(baseData, { ...aiData, isPublished: true });
    await dbUpsertSpirit(finalData);

    revalidatePath('/[lang]/contents/wiki', 'layout');
    revalidatePath('/[lang]/admin/spirits', 'page');
    revalidatePath(`/[lang]/spirits/${id}`, 'page');
    revalidateTag('spirits');

    return { success: true };
  } catch (error: any) {
    console.error('[Action] publishSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * [Admin] 제품 정보 수동 업데이트 액션
 */
export async function updateSpiritAction(id: string, data: any) {
  try {
    const current = await dbGetSpirit(id);
    if (!current) throw new Error('Spirit not found');

    const updatedFields = mapToSQLFields(current, data);
    await dbUpsertSpirit(updatedFields);

    revalidatePath('/[lang]/admin/spirits', 'page');
    revalidatePath('/[lang]/contents/wiki', 'layout');
    revalidatePath(`/[lang]/spirits/${id}`, 'page');
    revalidateTag('spirits');

    return { success: true };
  } catch (error: any) {
    console.error('[Action] updateSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}
