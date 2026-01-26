"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// 상대 경로를 사용하여 컴파일 오류 해결
import { getSpiritsAction, getSpiritsSearchIndex } from '../actions/spirits';
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
      // 1. 서버에서 데이터 가져오기 (병렬 처리)
      // 메인 화면 가시성 확보를 위해 isPublished: true 조건을 확실히 부여
      const [indexResult, masterResult] = await Promise.all([
        getSpiritsSearchIndex(),
        getSpiritsAction({ isPublished: true, limit: 100 })
      ]);

      // 데이터 정합성 체크 후 상태 업데이트
      if (Array.isArray(indexResult)) {
        setSearchIndex(indexResult);
        console.log(`[SpiritsCache] ✅ 검색 인덱스 로드 완료: ${indexResult.length}개`);
      }

      if (Array.isArray(masterResult)) {
        setPublishedSpirits(masterResult);
        console.log(`[SpiritsCache] ✅ 마스터 데이터 로드 완료: ${masterResult.length}개`);
      }

    } catch (error) {
      console.error('[SpiritsCache] ❌ 데이터 로드 중 치명적 오류:', error);
    } finally {
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
