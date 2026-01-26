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
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export const SpiritsCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedSpirits, setPublishedSpirits] = useState<Spirit[]>([]);
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * 데이터 로드 로직
   * force=true일 경우 로컬 스토리지를 무시하고 서버에서 새로 가져옵니다.
   */
  const loadData = useCallback(async (force = false) => {
    setIsRefreshing(true);
    console.log('[SpiritsCache] 🔄 데이터 로딩 시작...');

    try {
      // API Route를 통해 데이터 가져오기 (cache-busting timestamp 포함)
      const timestamp = Date.now();
      const response = await fetch(`/api/spirits?t=${timestamp}`, {
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
        console.log(`[SpiritsCache] ✅ 검색 인덱스 로드 완료: ${data.searchIndex.length}개`);
      }

      if (Array.isArray(data.publishedSpirits)) {
        setPublishedSpirits(data.publishedSpirits);
        console.log(`[SpiritsCache] ✅ 마스터 데이터 로드 완료: ${data.publishedSpirits.length}개`);
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

  const getSpiritById = useCallback((id: string) => {
    return publishedSpirits.find(s => s.id === id);
  }, [publishedSpirits]);

  const refreshCache = () => loadData(true);

  return (
    <SpiritsCacheContext.Provider value={{
      publishedSpirits,
      searchIndex,
      isLoading,
      isRefreshing,
      refreshCache,
      getSpiritById
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
