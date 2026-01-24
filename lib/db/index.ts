import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy
} from 'firebase/firestore';
import { db as firestoreDb, appId } from '../firebase';
import { Spirit, SpiritStatus, SpiritFilter, PaginationParams, PaginatedResponse } from './schema';

/**
 * [빌드 에러 수정] firebase-admin 대신 클라이언트용 Firestore를 사용합니다.
 * 모든 경로는 RULE 1에 따라 /artifacts/{appId}/public/data/spirits 를 따릅니다.
 */

const spiritsCollection = collection(firestoreDb, 'artifacts', appId, 'public', 'data', 'spirits');

export const spiritsDb = {
  // 모든 주류 가져오기 (필터링은 메모리에서 처리 - RULE 2 준수)
  async getAll(status?: SpiritStatus | 'ALL'): Promise<Spirit[]> {
    const q = query(spiritsCollection);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Spirit));

    if (!status || status === 'ALL') return data;
    return data.filter(s => s.status === status);
  },

  // 특정 주류 가져오기
  async getById(id: string): Promise<Spirit | null> {
    const docRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'spirits', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() } as Spirit;
    return null;
  },

  // 주류 정보 생성/업데이트 (Upsert)
  async upsert(id: string, data: Partial<Spirit>) {
    const docRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'spirits', id);
    // Ensure ID is part of data
    const payload = { ...data, id, updatedAt: new Date().toISOString() };
    return setDoc(docRef, payload, { merge: true });
  },

  // 일괄 업데이트
  async bulkUpdate(ids: string[], updates: Partial<Spirit>) {
    const promises = ids.map(id => this.upsert(id, updates));
    return Promise.all(promises);
  },

  // 삭제
  async delete(ids: string[]) {
    const promises = ids.map(id => {
      const docRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'spirits', id);
      return deleteDoc(docRef);
    });
    return Promise.all(promises);
  }
};

// -----------------------------------------------------------------------------
// LEGACY ADAPTER (Maintains API Compatibility for existing routes)
// Uses spiritsDb internally
// -----------------------------------------------------------------------------
export const db = {
  async getSpirits(filter: SpiritFilter = {}, pagination: PaginationParams = { page: 1, pageSize: 20 }): Promise<PaginatedResponse<Spirit>> {
    // Fetch ALL (Client SDK Limitation workaround: Fetch All -> Filter Memory)
    // For 5000 items, this is acceptable for now. 
    // In future, we should use 'where' clauses in getAll if possible.
    let allItems = await spiritsDb.getAll('ALL');

    // Filter
    if (filter.status) allItems = allItems.filter(s => s.status === filter.status);
    if (filter.category) allItems = allItems.filter(s => s.category === filter.category);
    if (filter.subcategory) allItems = allItems.filter(s => s.subcategory === filter.subcategory);
    if (filter.country) allItems = allItems.filter(s => s.country === filter.country);
    if (filter.isPublished !== undefined) allItems = allItems.filter(s => s.isPublished === filter.isPublished);

    // Sort (Default: UpdatedAt Desc)
    allItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = allItems.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const data = allItems.slice(start, start + pagination.pageSize);

    return {
      data,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize)
    };
  },

  async getSpirit(id: string): Promise<Spirit | null> {
    return spiritsDb.getById(id);
  },

  async updateSpirit(id: string, updates: Partial<Spirit>): Promise<Spirit | null> {
    await spiritsDb.upsert(id, updates);
    return spiritsDb.getById(id);
  },

  async deleteSpirit(id: string): Promise<boolean> {
    await spiritsDb.delete([id]);
    return true;
  }
};
