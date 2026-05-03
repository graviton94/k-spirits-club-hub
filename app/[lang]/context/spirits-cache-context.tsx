"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SpiritSearchIndex } from '@/lib/db/schema';

interface SpiritsCacheContextType {
  searchIndex: SpiritSearchIndex[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshCache: () => Promise<void>;
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export const SpiritsCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Cabinet page only needs the lightweight index for client-side item enrichment.
   */
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    console.log('[SpiritsCache] 🔄 데이터 로딩 시작 (mode=index)...');

    try {
      const response = await fetch('/api/spirits?mode=index', {
        cache: 'force-cache',
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

    } catch (error) {
      console.error('[SpiritsCache] ❌ 데이터 로드 중 치명적 오류:', error);
      setSearchIndex([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 초기 마운트 시 실행 (로그인 여부와 관계없이 게스트 유저도 즉시 로드)
  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshCache = () => loadData();

  return (
    <SpiritsCacheContext.Provider value={{
      searchIndex,
      isLoading,
      isRefreshing,
      refreshCache
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
