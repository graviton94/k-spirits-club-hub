"use server";

import { 
  dbListSpirits, 
  dbGetSpirit, 
  dbUpsertSpirit,
  dbDeleteSpirit,
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
  // STRICT MAPPING: only allow fields that exist in GQL mutation variables
  return {
    id: current.id,
    name: incoming.name ?? current.name,
    nameEn: incoming.nameEn ?? current.nameEn,
    category: incoming.category ?? current.category,
    categoryEn: incoming.categoryEn ?? current.categoryEn,
    mainCategory: incoming.mainCategory ?? current.mainCategory,
    subcategory: incoming.subcategory ?? current.subcategory,
    distillery: incoming.distillery ?? current.distillery,
    bottler: incoming.bottler ?? current.bottler,
    abv: incoming.abv !== undefined 
      ? (typeof incoming.abv === 'string' ? parseFloat(incoming.abv) : incoming.abv) 
      : current.abv,
    volume: incoming.volume !== undefined ? Number(incoming.volume) : current.volume,
    country: incoming.country ?? current.country,
    region: incoming.region ?? current.region,
    imageUrl: incoming.imageUrl ?? current.imageUrl,
    thumbnailUrl: incoming.thumbnailUrl ?? current.thumbnailUrl ?? incoming.imageUrl ?? current.imageUrl,
    descriptionKo: incoming.descriptionKo ?? current.descriptionKo,
    descriptionEn: incoming.descriptionEn ?? current.descriptionEn,
    pairingGuideKo: incoming.pairingGuideKo ?? current.pairingGuideKo,
    pairingGuideEn: incoming.pairingGuideEn ?? current.pairingGuideEn,
    noseTags: incoming.noseTags ?? current.noseTags ?? [],
    palateTags: incoming.palateTags ?? current.palateTags ?? [],
    finishTags: incoming.finishTags ?? current.finishTags ?? [],
    tastingNote: incoming.tastingNote ?? current.tastingNote,
    status: incoming.status ?? current.status,
    isPublished: incoming.isPublished ?? current.isPublished,
    isReviewed: incoming.isReviewed ?? current.isReviewed,
    reviewedBy: incoming.reviewedBy ?? current.reviewedBy,
    reviewedAt: incoming.reviewedAt ?? current.reviewedAt,
    rating: (incoming.isReviewed ?? current.isReviewed) 
      ? calculateDynamicEditorRating({
          descriptionKo: incoming.descriptionKo ?? current.descriptionKo,
          descriptionEn: incoming.descriptionEn ?? current.descriptionEn,
          noseTags: incoming.noseTags ?? current.noseTags ?? [],
          palateTags: incoming.palateTags ?? current.palateTags ?? [],
          finishTags: incoming.finishTags ?? current.finishTags ?? [],
          pairingGuideKo: incoming.pairingGuideKo ?? current.pairingGuideKo,
        })
      : (incoming.rating ?? current.rating ?? null),
    reviewCount: incoming.reviewCount ?? current.reviewCount,
    importer: incoming.importer ?? current.importer,
    rawCategory: incoming.rawCategory ?? current.rawCategory,
    metadata: {
      ...(current.metadata || {}),
      ...(incoming.metadata || {}),
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

export async function createSpiritAction(data: any, publish = false) {
  try {
    const spiritId = data.id;
    if (!spiritId) throw new Error('Spirit id is required');

    const payload = {
      ...data,
      imageUrl: data.imageUrl || data.thumbnailUrl || '/mys-4.webp',
      thumbnailUrl: data.thumbnailUrl || data.imageUrl || '/mys-4.webp',
      updatedAt: data.updatedAt || new Date().toISOString(),
      isPublished: publish ? true : (data.isPublished ?? false),
      isReviewed: publish ? true : (data.isReviewed ?? false),
      status: publish ? 'PUBLISHED' : (data.status ?? 'DRAFT'),
      reviewedBy: publish ? 'ADMIN' : data.reviewedBy,
      reviewedAt: publish ? (data.reviewedAt || new Date().toISOString()) : data.reviewedAt,
    };

    await dbUpsertSpirit(payload);

    revalidatePath('/[lang]/admin/spirits', 'page');
    revalidateTag('spirits');
    return { success: true, id: spiritId };
  } catch (error: any) {
    console.error('[Action] createSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSpiritAction(id: string) {
  try {
    await dbDeleteSpirit(id);
    revalidatePath('/[lang]/admin/spirits', 'page');
    revalidateTag('spirits');
    return { success: true };
  } catch (error: any) {
    console.error('[Action] deleteSpiritAction Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 월드컵 필터용 데이터 조회 액션 (카테고리 목록)
 */
export async function getWorldCupCategoriesAction() {
  try {
    const { dbListAllCategories } = await import('@/lib/db/data-connect-client');
    return await dbListAllCategories();
  } catch (error) {
    console.error('[Action] getWorldCupCategoriesAction Error:', error);
    return [];
  }
}

/**
 * 카테고리별 서브카테고리 조회 액션
 */
export async function getSubcategoriesAction(category?: string) {
  try {
    const { dbListAllSubcategories } = await import('@/lib/db/data-connect-client');
    return await dbListAllSubcategories(category === 'ALL' ? undefined : category);
  } catch (error) {
    console.error('[Action] getSubcategoriesAction Error:', error);
    return [];
  }
}
