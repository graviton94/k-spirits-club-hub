"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSpiritsCache } from '@/app/context/spirits-cache-context';
import SpiritCard from './SpiritCard';
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ExploreContent() {
  const { searchIndex, isLoading, isRefreshing, refreshCache } = useSpiritsCache();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayLimit, setDisplayLimit] = useState(24);

  // [SYSTEM_CHECK] 데이터 가시성 최종 리포트 로그
  useEffect(() => {
    if (!isLoading) {
      console.log(`[SYSTEM_REPORT] 현재 렌더링 가능한 검색 인덱스: ${searchIndex?.length || 0}개`);
    }
  }, [isLoading, searchIndex]);

  const filteredSpirits = useMemo(() => {
    if (!searchIndex || !Array.isArray(searchIndex)) return [];
    
    let results = [...searchIndex];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(s => 
        (s.n && s.n.toLowerCase().includes(lowerSearch)) || 
        (s.en && s.en.toLowerCase().includes(lowerSearch)) ||
        (s.c && s.c.toLowerCase().includes(lowerSearch))
      );
    }
    
    return results.slice(0, displayLimit);
  }, [searchIndex, searchTerm, displayLimit]);

  // 로딩 상태 처리
  if (isLoading && (!searchIndex || searchIndex.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium">제품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 검색 바 및 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">전체 둘러보기</h1>
          <p className="text-gray-500 text-sm mt-1">총 {searchIndex?.length || 0}개의 주종이 등록되어 있습니다.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="이름, 주종, 브랜드 검색..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 제품 그리드 */}
      {filteredSpirits.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredSpirits.map((item) => (
              <SpiritCard 
                key={item.i} 
                spirit={{
                  id: item.i,
                  name: item.n,
                  category: item.c,
                  thumbnailUrl: item.t,
                }} 
              />
            ))}
          </div>
          
          {searchIndex.length > displayLimit && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setDisplayLimit(prev => prev + 24)}
                disabled={isRefreshing}
                className="px-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isRefreshing ? "로딩 중..." : "더 많은 제품 보기"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-[32px] p-16 text-center border border-dashed border-gray-200 shadow-inner">
          <AlertCircle className="mx-auto w-16 h-16 text-gray-200 mb-6" />
          <h3 className="text-2xl font-bold text-gray-900">찾으시는 제품이 없나요?</h3>
          <p className="text-gray-500 mt-3 max-w-sm mx-auto">검색어를 변경하거나 아래 버튼을 눌러 최신 데이터를 새로고침 해보세요.</p>
          <button 
            onClick={() => refreshCache()}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 mx-auto active:scale-95"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            데이터 새로고침
          </button>
        </div>
      )}
    </div>
  );
}
