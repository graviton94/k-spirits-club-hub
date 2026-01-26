"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Spirit, SpiritSearchIndex } from '@/lib/db/schema';

interface SpiritsCacheContextType {
  publishedSpirits: Spirit[];
  searchIndex: SpiritSearchIndex[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshCache: () => Promise<void>;
  getSpiritById: (id: string) => Spirit | undefined;
  getSpiritDetail: (id: string) => Promise<Spirit | null>;
  searchSpirits: (query: string) => SpiritSearchIndex[];
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export const SpiritsCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedSpirits, setPublishedSpirits] = useState<Spirit[]>([]);
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // In-memory cache for full spirit details loaded on-demand
  const [detailCache, setDetailCache] = useState<Map<string, Spirit>>(new Map());

  /**
   * 데이터 로드 로직
   * force=true일 경우 로컬 스토리지를 무시하고 서버에서 새로 가져옵니다.
   * 기본적으로 mode=index를 사용하여 경량 인덱스만 로드합니다.
   */
  const loadData = useCallback(async (force = false) => {
    setIsRefreshing(true);
    console.log('[SpiritsCache] 🔄 데이터 로딩 시작 (mode=index)...');

    try {
      // API Route를 통해 경량 인덱스만 가져오기 (cache-busting timestamp 포함)
      const timestamp = Date.now();
      const response = await fetch(`/api/spirits?mode=index&t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // 데이터 정합성 체크 후 상태 업데이트
      if (Array.isArray(data.searchIndex)) {
        setSearchIndex(data.searchIndex);
        const indexSize = JSON.stringify(data.searchIndex).length;
        const indexSizeKB = (indexSize / 1024).toFixed(2);
        console.log(`[OPTIMIZATION] Index Size: ${indexSizeKB} KB for ${data.searchIndex.length} items`);
        console.log(`[SpiritsCache] ✅ 검색 인덱스 로드 완료: ${data.searchIndex.length}개`);
      }

      // Note: In index mode, publishedSpirits will be empty or undefined
      // Full spirits are loaded on-demand via getSpiritDetail
      if (data.publishedSpirits && Array.isArray(data.publishedSpirits)) {
        setPublishedSpirits(data.publishedSpirits);
        console.log(`[SpiritsCache] ✅ 마스터 데이터 로드 완료: ${data.publishedSpirits.length}개`);
      } else {
        // Clear published spirits when in index-only mode
        setPublishedSpirits([]);
        console.log('[SpiritsCache] ℹ️ Index-only mode: Full data will be loaded on-demand');
      }

    } catch (error) {
      console.error('[SpiritsCache] ❌ 데이터 로드 중 치명적 오류:', error);
      // 오류 발생 시 빈 배열로 설정하여 UI가 정상 작동하도록 함
      setSearchIndex([]);
      setPublishedSpirits([]);
    } finally {
      // 항상 isLoading을 false로 설정하여 무한 로딩 방지
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 초기 마운트 시 실행 (로그인 여부와 관계없이 게스트 유저도 즉시 로드)
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 인덱스에서 Spirit 찾기 (메모리 내 publishedSpirits 또는 detailCache에서)
   */
  const getSpiritById = useCallback((id: string) => {
    // First check in detail cache
    const cached = detailCache.get(id);
    if (cached) return cached;
    
    // Fallback to publishedSpirits if available
    return publishedSpirits.find(s => s.id === id);
  }, [publishedSpirits, detailCache]);

  /**
   * 개별 제품 상세 정보 온디맨드 로딩
   * 이미 캐시된 경우 캐시에서 반환, 없으면 API 호출
   */
  const getSpiritDetail = useCallback(async (id: string): Promise<Spirit | null> => {
    // Check if already in cache
    const cached = detailCache.get(id);
    if (cached) {
      console.log(`[SpiritsCache] ✅ Detail cache hit for: ${id}`);
      return cached;
    }

    // Check if in publishedSpirits
    const existing = publishedSpirits.find(s => s.id === id);
    if (existing) {
      console.log(`[SpiritsCache] ✅ Found in publishedSpirits: ${id}`);
      setDetailCache(prev => new Map(prev).set(id, existing));
      return existing;
    }

    // Fetch from API
    try {
      console.log(`[SpiritsCache] 🔄 Fetching detail for: ${id}`);
      const response = await fetch(`/api/spirits/${id}`);
      
      if (!response.ok) {
        console.warn(`[SpiritsCache] ❌ Failed to fetch spirit: ${id}`);
        return null;
      }

      const data = await response.json();
      const spirit = data.spirit;

      if (spirit) {
        // Update detail cache
        setDetailCache(prev => {
          const newCache = new Map(prev);
          newCache.set(id, spirit);
          return newCache;
        });
        console.log(`[SpiritsCache] ✅ Detail loaded and cached: ${spirit.name}`);
        return spirit;
      }

      return null;
    } catch (error) {
      console.error(`[SpiritsCache] ❌ Error fetching spirit detail: ${id}`, error);
      return null;
    }
  }, [publishedSpirits, detailCache]);

  const refreshCache = () => loadData(true);

  // fuse.js or simple filter based search
  const searchSpirits = useCallback((query: string) => {
    if (!query || !searchIndex.length) return [];

    const lowerQuery = query.toLowerCase();

    // Simple filter for now, can be upgraded to Fuse.js if needed
    // Matches by name (n) or English name (en)
    return searchIndex.filter(item => {
      const nameMatch = item.n && item.n.toLowerCase().includes(lowerQuery);
      const enMatch = item.en && item.en.toLowerCase().includes(lowerQuery);
      return nameMatch || enMatch;
    });
  }, [searchIndex]);

  return (
    <SpiritsCacheContext.Provider value={{
      publishedSpirits,
      searchIndex,
      isLoading,
      isRefreshing,
      refreshCache,
      getSpiritById,
      getSpiritDetail,
      searchSpirits
    }}>
      {children}
    </SpiritsCacheContext.Provider>
  );
};

export const useSpiritsCache = () => {
  const context = useContext(SpiritsCacheContext);
  if (!context) throw new Error('useSpiritsCache must be used within SpiritsCacheProvider');
  return context;
};
