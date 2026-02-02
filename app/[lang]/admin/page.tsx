'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Spirit, SpiritStatus, ModificationRequest } from '@/lib/db/schema';
import Link from 'next/link';
import metadata from '@/lib/constants/spirits-metadata.json';
import { TagMultiSelect } from '@/components/ui/TagMultiSelect';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';


interface EditFormState {
  name: string;
  abv: number | string;
  imageUrl: string;
  name_en: string;
  category: string;
  subcategory: string;
  country: string;
  region: string;
  distillery: string;
  bottler: string;
  volume: number;
  tasting_note: string;
  description: string;
  description_en: string;
  pairing_guide_ko: string;
  pairing_guide_en: string;
  nose_tags: string;
  palate_tags: string;
  finish_tags: string;
}

/**
 * AdminDashboard Component
 * Features:
 * - Server-side Pagination & Infinite Scroll
 * - Server-side Filtering
 * - Bulk Actions (Enrich, Publish, Delete)
 * - Enhanced Edit Modal with Select Inputs
 */
export default function AdminDashboard() {
  // Set page title for SEO
  useEffect(() => {
    document.title = `K-Spirits Club | 관리자 대시보드 - 주류 데이터 관리`;
  }, []);

  // --- Server-Side Filtering Admin Dashboard ---
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState<'spirits' | 'modifications'>('spirits');

  // Modification Requests State
  const [modificationRequests, setModificationRequests] = useState<ModificationRequest[]>([]);
  const [loadingMods, setLoadingMods] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 50; // Reduced from 20 for efficiency

  // Filters - Default to ALL for better visibility of data in pipeline
  const [statusFilter, setStatusFilter] = useState<SpiritStatus | 'ALL'>('ALL');
  const [localStatusFilter, setLocalStatusFilter] = useState<SpiritStatus | 'ALL'>('ALL');
  const [noImageOnly, setNoImageOnly] = useState(false);
  const [localNoImageOnly, setLocalNoImageOnly] = useState(false);
  const [level1Cat, setLevel1Cat] = useState<string>('ALL');
  const [localLevel1Cat, setLocalLevel1Cat] = useState<string>('ALL');
  const [level2Cat, setLevel2Cat] = useState<string>('ALL');
  const [localLevel2Cat, setLocalLevel2Cat] = useState<string>('ALL');
  const [level3Cat, setLevel3Cat] = useState<string>('ALL');
  const [localLevel3Cat, setLocalLevel3Cat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{ status: string, issues: string[], suggestions: any, reasoning: string } | null>(null);

  // Edit Form State (Kept same)
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '', abv: 0, imageUrl: '', name_en: '', category: '', subcategory: '',
    country: '', region: '', distillery: '', bottler: '', volume: 700,
    tasting_note: '', description: '', description_en: '', pairing_guide_ko: '', pairing_guide_en: '',
    nose_tags: '', palate_tags: '', finish_tags: ''
  });

  // Metadata Helpers for 3-Level Hierarchy
  // Level 1: Keys of metadata.categories (e.g. 위스키, 소주)
  const level1Options = Object.keys(metadata.categories);

  // Level 2: Keys inside selected Level 1 (e.g. scotch, american)
  const getLevel2Options = (l1: string) => {
    if (l1 === 'ALL' || !metadata.categories[l1 as keyof typeof metadata.categories]) return [];
    const catData = metadata.categories[l1 as keyof typeof metadata.categories];
    // If it's Array (like simple structure), no Level 2
    if (Array.isArray(catData)) return [];
    return Object.keys(catData);
  };
  const level2Options = getLevel2Options(level1Cat);

  // Level 3: Values inside selected Level 2
  // Level 3: Values inside selected Level 2
  const getLevel3Options = (l1: string, l2: string): string[] => {
    if (l1 === 'ALL' || l2 === 'ALL') return [];
    const catData = metadata.categories[l1 as keyof typeof metadata.categories];
    if (typeof catData === 'object' && !Array.isArray(catData)) {
      const subData = catData[l2 as keyof typeof catData];
      return Array.isArray(subData) ? subData : [];
    }
    return [];
  };
  const level3Options = getLevel3Options(localLevel1Cat, localLevel2Cat);

  // --- Load Spirits with Server-Side Filtering ---
  const loadSpirits = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (level1Cat !== 'ALL') params.append('category', level1Cat);
      if (level3Cat !== 'ALL') params.append('subcategory', level3Cat);
      if (noImageOnly) params.append('noImage', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/spirits?${params.toString()}`);
      const data = await response.json();

      setSpirits(data.data || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Failed to load spirits:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, level1Cat, level3Cat, noImageOnly, searchQuery]);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(localSearchQuery);
    setStatusFilter(localStatusFilter);
    setLevel1Cat(localLevel1Cat);
    setLevel2Cat(localLevel2Cat);
    setLevel3Cat(localLevel3Cat);
    setNoImageOnly(localNoImageOnly);
  };

  useEffect(() => {
    loadSpirits();
    loadModificationRequests();
  }, [loadSpirits]);

  // Load Modification Requests
  const loadModificationRequests = async () => {
    setLoadingMods(true);
    try {
      const response = await fetch('/api/admin/modifications');
      const data = await response.json();
      setModificationRequests(data.data || []);
    } catch (error) {
      console.error('Failed to load modification requests:', error);
    } finally {
      setLoadingMods(false);
    }
  };

  // Update Modification Request Status
  const updateModificationStatus = async (id: string, status: 'checked' | 'resolved') => {
    try {
      const res = await fetch('/api/admin/modifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        setModificationRequests(prev => prev.map(req =>
          req.id === id ? { ...req, status } : req
        ));
        alert(status === 'resolved' ? '✅ 적용 완료' : '❌ 기각됨');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };



  // --- Pagination ---
  const totalPages = Math.ceil(totalCount / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, level1Cat, level3Cat, searchQuery, noImageOnly]);


  const publishSpirit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/spirits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', isPublished: true, reviewedBy: 'ADMIN', reviewedAt: new Date().toISOString() })
      });
      if (res.ok) {
        await loadSpirits(); // Reload from server
      }
    } catch (e) {
      alert('발행 실패');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;

    const choice = confirm(`${selectedIds.size}건을 최종 공개하시겠습니까?\n\n[확인] - 그냥 발행\n[취소] - 중단`);
    if (!choice) return;

    const doExtra = confirm("발행 전 'AI 분석' 및 '데이터 정규화'를 함께 진행하시겠습니까?\n(영문명 생성, 지역/증류소 통일 등)");

    setIsProcessing(true);

    // Use batch size of 1 for AI operations, 10 for standard publish (safer than 50)
    const BATCH_SIZE = doExtra ? 1 : 10;
    const allIds = Array.from(selectedIds);
    let totalUpdated = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
        const batch = allIds.slice(i, i + BATCH_SIZE);
        try {
          // REMOVED TRAILING SLASH
          const res = await fetch('/api/admin/spirits/bulk-patch', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              spiritIds: batch,
              enrich: doExtra,
              normalize: doExtra,
              updates: { status: 'PUBLISHED', isPublished: true, reviewedBy: 'ADMIN', reviewedAt: new Date().toISOString() }
            })
          });

          if (res.ok) {
            const data = await res.json();
            totalUpdated += data.updatedCount || 0;
          } else {
            errorCount += batch.length;
            console.error(`Batch ${i / BATCH_SIZE + 1} failed`);
          }
        } catch (err) {
          errorCount += batch.length;
          console.error(`Batch ${i / BATCH_SIZE + 1} error:`, err);
        }
      }

      await loadSpirits(); // Reload from server
      alert(doExtra ? `✅ ${totalUpdated}건 분석 후 발행 완료 (실패: ${errorCount}건)` : `✅ ${totalUpdated}건 일괄 발행 완료 (실패: ${errorCount}건)`);
      if (errorCount === 0) setSelectedIds(new Set());
    } catch (e) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteSpirit = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/admin/spirits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadSpirits(); // Reload from server
      }
    } catch (e) {
      alert('삭제 실패');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`선택한 ${selectedIds.size}건을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/spirits/bulk-delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spiritIds: Array.from(selectedIds) })
      });

      if (res.ok) {
        await loadSpirits(); // Reload from server
        alert('✅ 일괄 삭제 완료');
        setSelectedIds(new Set());
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (spirit: Spirit) => {
    setEditingId(spirit.id);
    setAuditResult(null); // Reset audit
    // ... populate form (same as before) ...
    setEditForm({
      name: spirit.name, abv: spirit.abv, imageUrl: spirit.imageUrl || '',
      name_en: spirit.metadata?.name_en || spirit.name_en || '',
      category: spirit.category || '', subcategory: spirit.subcategory || '',
      country: spirit.country || '', region: spirit.region || '', distillery: spirit.distillery || '', bottler: spirit.bottler || '',
      volume: spirit.volume || 700,
      tasting_note: spirit.metadata?.tasting_note || '',
      description: spirit.metadata?.description || '',
      description_en: spirit.description_en || '',
      pairing_guide_ko: spirit.pairing_guide_ko || (spirit.metadata as any)?.pairing_guide_ko || '',
      pairing_guide_en: spirit.pairing_guide_en || (spirit.metadata as any)?.pairing_guide_en || '',
      nose_tags: (spirit.metadata?.nose_tags || []).join(', '),
      palate_tags: (spirit.metadata?.palate_tags || []).join(', '),
      finish_tags: (spirit.metadata?.finish_tags || []).join(', ')
    });
  };

  const saveEdit = async (publish: boolean) => {
    if (!editingId) return;
    setIsProcessing(true);
    try {
      const payload: any = {
        name: editForm.name,
        abv: parseFloat(String(editForm.abv)) || 0,
        imageUrl: editForm.imageUrl,
        thumbnailUrl: editForm.imageUrl, // Sync thumbnailUrl with imageUrl
        category: editForm.category,
        subcategory: editForm.subcategory,
        country: editForm.country,
        region: editForm.region,
        distillery: editForm.distillery,
        bottler: editForm.bottler,
        volume: Number(editForm.volume) || 700,
        description_en: editForm.description_en,
        pairing_guide_ko: editForm.pairing_guide_ko,
        pairing_guide_en: editForm.pairing_guide_en,
        metadata: {
          name_en: editForm.name_en,
          tasting_note: editForm.tasting_note,
          description: editForm.description,
          nose_tags: editForm.nose_tags.split(',').filter(Boolean).map(t => t.trim()),
          palate_tags: editForm.palate_tags.split(',').filter(Boolean).map(t => t.trim()),
          finish_tags: editForm.finish_tags.split(',').filter(Boolean).map(t => t.trim())
        },
        updatedAt: new Date().toISOString()
      };

      if (publish) {
        payload.status = 'PUBLISHED';
        payload.isPublished = true;
        payload.reviewedBy = 'ADMIN';
        payload.reviewedAt = new Date().toISOString();
      }

      const res = await fetch(`/api/admin/spirits/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await loadSpirits(); // Reload from server
        setEditingId(null);
        alert(publish ? '✅ 저장 및 공개 완료' : '✅ 저장 완료');
      } else {
        const err = await res.text();
        alert(`저장 실패: ${err}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error during save');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };
  const toggleSelectAll = () => {
    const idsOnPage = spirits.map(s => s.id);
    if (idsOnPage.every(id => selectedIds.has(id))) {
      // Deselect all on page
      const newSet = new Set(selectedIds);
      idsOnPage.forEach(id => newSet.delete(id));
      setSelectedIds(newSet);
    } else {
      // Select all on page
      const newSet = new Set(selectedIds);
      idsOnPage.forEach(id => newSet.add(id));
      setSelectedIds(newSet);
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">🏭 Club Hub Pipeline</h1>
          <Link href="/" prefetch={false} className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl hover:opacity-80 transition-all">홈으로</Link>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('spirits')}
            className={`px-8 py-4 font-bold border-b-4 transition-all whitespace-nowrap ${activeTab === 'spirits'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}>
            📚 마스터 데이터
          </button>
          <button
            onClick={() => setActiveTab('modifications')}
            className={`px-8 py-4 font-bold border-b-4 transition-all whitespace-nowrap ${activeTab === 'modifications'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}>
            📝 보고된 수정 요청 {modificationRequests.filter(r => r.status === 'pending').length > 0 &&
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {modificationRequests.filter(r => r.status === 'pending').length}
              </span>
            }
          </button>
        </div>

        {activeTab === 'spirits' && (
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* Control Bar */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">

                {/* 3-Level Category Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-2">분류 필터:</span>

                  {/* Level 1 */}
                  <select className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white"
                    value={localLevel1Cat} onChange={e => { setLocalLevel1Cat(e.target.value); setLocalLevel2Cat('ALL'); setLocalLevel3Cat('ALL'); }}>
                    <option value="ALL">📂 전체 카테고리</option>
                    {level1Options.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {/* Level 2 (Conditional) */}
                  {level2Options.length > 0 && (
                    <>
                      <span className="text-gray-400">›</span>
                      <select className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white"
                        value={localLevel2Cat} onChange={e => { setLocalLevel2Cat(e.target.value); setLocalLevel3Cat('ALL'); }}>
                        <option value="ALL">📁 세부 분류 (전체)</option>
                        {level2Options.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </>
                  )}

                  {/* Level 3 (Conditional) */}
                  {level3Options.length > 0 && (
                    <>
                      <span className="text-gray-400">›</span>
                      <select className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white"
                        value={localLevel3Cat} onChange={e => setLocalLevel3Cat(e.target.value)}>
                        <option value="ALL">📑 제품 종류 (전체)</option>
                        {level3Options.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </>
                  )}
                </div>

                {/* Status & Search */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                    {(['ALL', 'ENRICHED', 'READY_FOR_CONFIRM', 'IMAGE_FAILED', 'PUBLISHED'] as const).map(f => (
                      <button key={f} onClick={() => setLocalStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${localStatusFilter === f ? 'bg-white dark:bg-black shadow text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {f === 'ALL' ? '전체' : f === 'PUBLISHED' ? '공개됨' : f === 'ENRICHED' ? 'AI분석' : f === 'IMAGE_FAILED' ? '이미지실패' : '검수대기'}
                      </button>
                    ))}
                  </div>

                  {/* Image Filter Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-transparent hover:border-amber-500/30 transition-all">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 accent-amber-500"
                      checked={localNoImageOnly}
                      onChange={e => setLocalNoImageOnly(e.target.checked)}
                    />
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">이미지 없음</span>
                  </label>

                  <div className="relative flex items-center gap-2">
                    <input
                      placeholder="이름 검색..."
                      className="bg-gray-100 dark:bg-gray-950 px-4 py-2 rounded-xl text-xs font-bold w-48 border border-transparent focus:border-amber-500 focus:outline-none text-black dark:text-white placeholder:text-gray-400"
                      value={localSearchQuery}
                      onChange={e => setLocalSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-amber-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/10"
                    >
                      검색
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions & Counts */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-900">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  총 <span className="text-amber-600 dark:text-amber-400 text-base mx-1">{totalCount.toLocaleString()}</span>건 조회됨 (현재 페이지: {spirits.length}건)
                  {selectedIds.size > 0 && <span className="ml-4 text-black dark:text-white">({selectedIds.size}개 선택됨)</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={!selectedIds.size || isProcessing}
                    onClick={async () => {
                      if (!confirm(`${selectedIds.size}건에 대해 AI 분석(영문명, 소개글, 페어링 가이드 생성)을 진행하시겠습니까?`)) return;
                      setIsProcessing(true);

                      const BATCH_SIZE = 1; // Ultra-safe mode
                      const allIds = Array.from(selectedIds);
                      let processedCount = 0;
                      let totalEnriched = 0;
                      let errorCount = 0;

                      try {
                        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
                          const batch = allIds.slice(i, i + BATCH_SIZE);
                          try {
                            // REMOVED TRAILING SLASH
                            const res = await fetch('/api/admin/spirits/bulk-patch', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                spiritIds: batch,
                                enrich: true,
                                updates: { status: 'ENRICHED' }
                              })
                            });

                            if (res.ok) {
                              const data = await res.json();
                              totalEnriched += data.enrichedCount || 0;
                            } else {
                              errorCount += batch.length;
                              console.error(`Batch ${i / BATCH_SIZE + 1} failed`);
                            }
                          } catch (err) {
                            errorCount += batch.length;
                            console.error(`Batch ${i / BATCH_SIZE + 1} error:`, err);
                          }
                          processedCount += batch.length;
                        }

                        alert(`✅ 총 ${totalEnriched}건 AI 분석 완료 (실패: ${errorCount}건)`);
                        await loadSpirits();
                      } catch (e) {
                        alert('처리 중 심각한 오류가 발생했습니다.');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-purple-500 transition-colors"
                  >
                    🚀 선택 항목 AI 분석
                  </button>

                  <button
                    disabled={!selectedIds.size || isProcessing}
                    onClick={async () => {
                      if (!confirm(`${selectedIds.size}건에 대해 [AI 분석 + 데이터 정규화]를 통합 실행하시겠습니까?\n(영문명/설명 생성 + 증류소/지역 표준화)`)) return;
                      setIsProcessing(true);

                      const BATCH_SIZE = 1; // Ultra-safe mode: 1 item per request to completely avoid timeouts
                      const allIds = Array.from(selectedIds);
                      let totalProcessed = 0;
                      let errorCount = 0;

                      try {
                        for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
                          const batch = allIds.slice(i, i + BATCH_SIZE);
                          try {
                            // REMOVED TRAILING SLASH to prevent 308 Redirects
                            const res = await fetch('/api/admin/spirits/bulk-patch', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                spiritIds: batch,
                                enrich: true,
                                normalize: true,
                                updates: { status: 'ENRICHED' }
                              })
                            });

                            if (res.ok) {
                              const data = await res.json();
                              totalProcessed += data.updatedCount || 0;
                            } else {
                              errorCount += batch.length;
                            }
                          } catch (err) {
                            errorCount += batch.length;
                            console.error(`Batch error:`, err);
                          }
                          // Add small delay between batches to reduce server load
                          await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        alert(`✅ 총 ${totalProcessed}건 통합 처리 완료 (실패: ${errorCount}건)`);
                        await loadSpirits();
                        if (errorCount === 0) setSelectedIds(new Set());
                      } catch (e) {
                        alert('처리 중 심각한 오류가 발생했습니다.');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-indigo-500 transition-colors border border-indigo-400/30"
                  >
                    ⚡ AI + 정규화 (통합)
                  </button>

                  <button
                    disabled={!selectedIds.size || isProcessing}
                    onClick={async () => {
                      if (!confirm(`${selectedIds.size}건에 대해 데이터 정규화(증류소명, 지역 통일 등)를 진행하시겠습니까?`)) return;
                      setIsProcessing(true);
                      try {
                        const res = await fetch('/api/admin/spirits/bulk-patch/', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            spiritIds: Array.from(selectedIds),
                            normalize: true,
                            updates: {}
                          })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          alert(`✅ ${data.normalizedCount}건 데이터 정규화 완료`);
                          await loadSpirits();
                        }
                      } catch (e) {
                        alert('오류가 발생했습니다.');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-blue-500 transition-colors"
                  >
                    📊 선택 항목 정규화
                  </button>
                  <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkPublish} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-amber-500 transition-colors">선택 항목 발행</button>
                  <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-red-500 transition-colors">선택 삭제</button>
                </div>
              </div>
            </div>

            {/* Data Table with Horizontal Scroll */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input type="checkbox"
                          checked={spirits.length > 0 && spirits.every(s => selectedIds.has(s.id))}
                          onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-amber-500" />
                      </th>
                      <th className="p-4">주류 정보</th>
                      <th className="p-4">상태</th>
                      <th className="p-4">DNA (Tags)</th>
                      <th className="p-4">이미지</th>
                      <th className="p-4">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                    {spirits.map(spirit => (
                      <tr key={spirit.id} className={`hover:bg-amber-500/5 transition-colors ${selectedIds.has(spirit.id) ? 'bg-amber-500/5' : ''}`}>
                        <td className="p-4 text-center"><input type="checkbox" checked={selectedIds.has(spirit.id)} onChange={() => toggleSelect(spirit.id)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-amber-500" /></td>
                        <td className="p-4">
                          <div className="font-bold text-base text-black dark:text-white max-w-[300px] truncate">{spirit.name}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">{spirit.distillery || '-'} | {spirit.abv}% | {spirit.category} › {spirit.subcategory}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black border ${spirit.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 border-green-200' :
                            spirit.status === 'ENRICHED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              spirit.status === 'IMAGE_FAILED' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-amber-100 text-amber-700 border-amber-200'
                            }`}>
                            {spirit.status === 'PUBLISHED' ? 'PUBLISHED' :
                              spirit.status === 'ENRICHED' ? 'AI분석됨' :
                                spirit.status === 'IMAGE_FAILED' ? '이미지실패' : '검수대기'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="max-w-[240px] flex flex-wrap gap-1">
                            {(spirit.metadata?.nose_tags || []).slice(0, 3).map(t => <span key={t} className="text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{t}</span>)}
                            {(spirit.metadata?.nose_tags?.length || 0) > 3 && <span className="text-[9px] text-gray-400">...</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          {spirit.imageUrl ? (
                            <img src={getOptimizedImageUrl(spirit.imageUrl, 80)} className="w-10 h-10 object-contain bg-white rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm" alt="Bottle" />
                          ) : <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 border-dashed" />}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(spirit)} className="px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white">편집</button>
                            {spirit.status !== 'PUBLISHED' && (
                              <button onClick={() => publishSpirit(spirit.id)} className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold rounded-lg hover:bg-green-500/20">발행</button>
                            )}
                            <button onClick={() => deleteSpirit(spirit.id)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold rounded-lg hover:bg-red-500/20">삭제</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {spirits.length === 0 && !loading && (
                      <tr><td colSpan={6} className="p-12 text-center text-gray-500">조건에 맞는 데이터가 없습니다.</td></tr>
                    )}
                    {loading && (
                      <tr><td colSpan={6} className="p-12 text-center text-amber-500 animate-pulse font-bold">데이터를 로딩 중입니다...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800 flex justify-center items-center gap-4">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 font-bold text-sm text-black dark:text-white">Prev</button>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Page <span className="text-black dark:text-white">{page}</span> of {Math.max(1, totalPages)}
                </div>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 font-bold text-sm text-black dark:text-white">Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modifications' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-black dark:text-white">📝 사용자 수정 요청</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  총 <span className="text-amber-600 dark:text-amber-400 font-bold">{modificationRequests.length}</span>건
                </div>
              </div>

              {loadingMods && (
                <div className="text-center py-12 text-amber-500 animate-pulse font-bold">로딩 중...</div>
              )}

              {!loadingMods && modificationRequests.length === 0 && (
                <div className="text-center py-12 text-gray-500">수정 요청이 없습니다.</div>
              )}

              <div className="space-y-4">
                {modificationRequests.map(request => (
                  <div key={request.id} className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-amber-500/30 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <button
                            onClick={() => {
                              const spirit = spirits.find((s: Spirit) => s.id === request.spiritId);
                              if (spirit) startEdit(spirit);
                            }}
                            className="text-lg font-bold text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          >
                            {request.spiritName}
                          </button>
                          <span className={`px-2 py-1 rounded text-xs font-black ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            request.status === 'checked' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                            {request.status === 'pending' ? '대기 중' : request.status === 'checked' ? '기각됨' : '적용 완료'}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{request.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">
                          {request.content}
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>요청자: {request.userId || '익명'}</span>
                          <span>•</span>
                          <span>{new Date(request.createdAt).toLocaleString('ko-KR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateModificationStatus(request.id, 'checked')}
                              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold rounded-lg hover:bg-red-500/20 whitespace-nowrap"
                            >
                              기각
                            </button>
                            <button
                              onClick={() => updateModificationStatus(request.id, 'resolved')}
                              className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-bold rounded-lg hover:bg-green-500/20 whitespace-nowrap"
                            >
                              적용 완료
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}





        {/* Expanded Edit Modal with High Z-Index to cover Bottom Nav */}
        {
          editingId && (
            <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-sm z-9999 flex items-start justify-center p-4 overflow-y-auto pt-12">
              <div className="bg-white dark:bg-black w-full max-w-7xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 animate-in zoom-in-95 duration-200 flex flex-col h-fit my-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-900">
                  <div>
                    <h2 className="text-3xl font-black text-black dark:text-white">데이터 클린룸 (Deep Edit)</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ID: {editingId}</p>
                    {auditResult && (
                      <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black ${auditResult.status === 'PASS' ? 'bg-green-100 text-green-700' :
                        auditResult.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        🛡️ AI Audit: {auditResult.status} {auditResult.issues.length > 0 && `(${auditResult.issues.length} 이슈)`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        try {
                          const res = await fetch('/api/admin/spirits/audit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ spirit: editForm })
                          });
                          if (!res.ok) throw new Error('Audit failed');
                          const data = await res.json();
                          setAuditResult(data);
                          if (data.status === 'PASS') {
                            alert('✅ 데이터가 완벽해 보입니다!');
                          } else {
                            alert(`⚠️ 이슈 발견: ${data.issues.join(', ')}\n\n제안사항을 확인하세요.`);
                          }
                        } catch (e: any) {
                          alert(`AI 감사 중 오류: ${e.message}`);
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-xs font-black rounded-xl hover:bg-gray-200 transition-all border border-gray-200 dark:border-gray-800"
                    >
                      🛡️ AI 데이터 검출
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        try {
                          const res = await fetch('/api/admin/spirits/enrich', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: editForm.name,
                              category: editForm.category,
                              subcategory: editForm.subcategory,
                              distillery: editForm.distillery,
                              abv: editForm.abv,
                              region: editForm.region,
                              country: editForm.country,
                              metadata: {
                                tasting_note: editForm.tasting_note,
                                description: editForm.description
                              }
                            })
                          });
                          if (!res.ok) throw new Error('Enrichment failed');
                          const data = await res.json();
                          setEditForm({
                            ...editForm,
                            name_en: data.name_en || editForm.name_en,
                            description_en: data.description_en || editForm.description_en,
                            pairing_guide_en: data.pairing_guide_en || editForm.pairing_guide_en,
                            pairing_guide_ko: data.pairing_guide_ko || editForm.pairing_guide_ko
                          });
                          alert('✨ AI 자동 생성 성공!');
                        } catch (e: any) {
                          alert(`AI 분석 중 오류: ${e.message}`);
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                    >
                      ✨ {isProcessing ? 'AI 분석 중...' : 'AI 데이터 생성'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-2xl">✕</button>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Top Section: Info + Image */}
                  <div className="flex flex-col xl:flex-row gap-12 items-start">

                    {/* Left Column: Core Data */}
                    <div className="flex-1 space-y-8 w-full">
                      {/* Basic Info Block */}
                      <section className="space-y-4">
                        <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block text-black dark:text-white border border-gray-200 dark:border-gray-800">기본 정보</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">제품명 (KO)</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-black dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">영문 명칭</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-black dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.name_en} onChange={e => setEditForm({ ...editForm, name_en: e.target.value })} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">카테고리</label>
                            <select className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black font-bold text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value, subcategory: '' })}>
                              <option value="">선택</option>
                              {level1Options.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">세부종류</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black font-bold text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              list="subcategory-options"
                              value={editForm.subcategory} onChange={e => setEditForm({ ...editForm, subcategory: e.target.value })} />
                            <datalist id="subcategory-options">
                              {(() => {
                                if (!editForm.category) return null;
                                const catData = metadata.categories[editForm.category as keyof typeof metadata.categories];
                                if (!catData) return null;
                                const subOptions = Array.isArray(catData) ? catData : Object.values(catData).flat();
                                return subOptions.map((c: string) => <option key={c} value={c} />);
                              })()}
                            </datalist>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">도수 (ABV)</label>
                            <div className="relative">
                              <input type="number" step="0.1" className="w-full mt-1 pl-4 pr-8 py-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black font-bold text-black dark:text-white text-right focus:ring-2 focus:ring-amber-500/50 outline-none"
                                value={editForm.abv} onChange={e => setEditForm({ ...editForm, abv: e.target.value })} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">%</span>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Origin & Production Block */}
                      <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-900">
                        <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block text-black dark:text-white border border-gray-200 dark:border-gray-800">제조 및 원산지</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">제조국 (Country)</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold bg-white dark:bg-black text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">지역 (Region)</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold bg-white dark:bg-black text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">증류소/제조사 (Distillery)</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold bg-white dark:bg-black text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.distillery} onChange={e => setEditForm({ ...editForm, distillery: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">병입자/브랜드 (Bottler)</label>
                            <input className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold bg-white dark:bg-black text-black dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                              value={editForm.bottler} onChange={e => setEditForm({ ...editForm, bottler: e.target.value })} />
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Right Column: Visuals + Suggestions */}
                    <div className="w-full xl:w-96 shrink-0 space-y-6">
                      {auditResult && auditResult.status !== 'PASS' && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-6 rounded-3xl space-y-4">
                          <h4 className="text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase flex items-center gap-2">💡 AI Suggestions</h4>
                          <div className="text-[11px] text-yellow-800 dark:text-yellow-400 space-y-2">
                            {Object.entries(auditResult.suggestions).map(([key, value]: [string, any]) => value && (
                              <div key={key} className="flex justify-between items-center bg-white/50 dark:bg-black/50 p-2 rounded-lg">
                                <span className="opacity-60">{key}:</span>
                                <button
                                  onClick={() => setEditForm(prev => ({ ...prev, [key]: value }))}
                                  className="font-bold hover:text-amber-600 transition-colors"
                                >
                                  {String(value)} ↵
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-yellow-600 font-medium italic">{auditResult.reasoning}</p>
                        </div>
                      )}

                      <div className="bg-gray-50 dark:bg-gray-950/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">제품 이미지</label>
                        <div className="aspect-3/4 bg-white rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden relative group shadow-sm">
                          {editForm.imageUrl ? (
                            <img src={getOptimizedImageUrl(editForm.imageUrl, 400)} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" alt="Preview" />
                          ) : <span className="text-5xl opacity-20 text-black dark:text-white">🥃</span>}
                        </div>
                        <input className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-[10px] bg-white dark:bg-black text-gray-400 font-mono truncate focus:ring-2 focus:ring-amber-500/50 outline-none"
                          value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="https://..." />
                      </div>
                    </div>
                  </div>

                  {/* AI Content Block */}
                  <section className="bg-purple-500/5 dark:bg-purple-500/10 p-8 rounded-3xl border border-purple-200 dark:border-purple-900/40 space-y-6">
                    <h3 className="text-lg font-black text-purple-700 dark:text-purple-400 flex items-center gap-2">✨ AI Generated Content</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-purple-400 dark:text-purple-500">English Description</label>
                          <textarea rows={4} className="w-full mt-1 px-4 py-3 border border-purple-100 dark:border-purple-900/20 rounded-xl font-medium bg-white dark:bg-black text-black dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-purple-500/50 outline-none"
                            value={editForm.description_en} onChange={e => setEditForm({ ...editForm, description_en: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-purple-400 dark:text-purple-500">Introduction (KO)</label>
                          <textarea rows={4} className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-medium bg-white dark:bg-black text-black dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-amber-500/50 outline-none"
                            value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-purple-400 dark:text-purple-500">Pairing Guide (KO)</label>
                          <textarea rows={4} className="w-full mt-1 px-4 py-3 border border-purple-100 dark:border-purple-900/20 rounded-xl font-medium bg-white dark:bg-black text-black dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-purple-500/50 outline-none"
                            value={editForm.pairing_guide_ko} onChange={e => setEditForm({ ...editForm, pairing_guide_ko: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-purple-400 dark:text-purple-500">Pairing Guide (EN)</label>
                          <textarea rows={4} className="w-full mt-1 px-4 py-3 border border-purple-100 dark:border-purple-900/20 rounded-xl font-medium bg-white dark:bg-black text-black dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-purple-500/50 outline-none"
                            value={editForm.pairing_guide_en} onChange={e => setEditForm({ ...editForm, pairing_guide_en: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Flavor DNA Section (Horizontal) */}
                  <section className="bg-gray-100 dark:bg-gray-950 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-black dark:text-white">🧬 Flavor DNA</h3>
                      <span className="text-[10px] text-gray-400 font-medium bg-white dark:bg-black px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800">태그를 선택하여 맛을 표현하세요</span>
                    </div>

                    <div className="space-y-8">
                      <TagMultiSelect
                        label="Nose (향)"
                        availableTags={metadata.tag_index.nose as any}
                        selectedTags={editForm.nose_tags ? editForm.nose_tags.split(',').filter(Boolean).map(t => t.trim()) : []}
                        onChange={(tags) => setEditForm({ ...editForm, nose_tags: tags.join(', ') })}
                      />

                      <TagMultiSelect
                        label="Palate (맛)"
                        availableTags={metadata.tag_index.palate as any}
                        selectedTags={editForm.palate_tags ? editForm.palate_tags.split(',').filter(Boolean).map(t => t.trim()) : []}
                        onChange={(tags) => setEditForm({ ...editForm, palate_tags: tags.join(', ') })}
                      />

                      <TagMultiSelect
                        label="Finish (여운)"
                        availableTags={metadata.tag_index.finish as any}
                        selectedTags={editForm.finish_tags ? editForm.finish_tags.split(',').filter(Boolean).map(t => t.trim()) : []}
                        onChange={(tags) => setEditForm({ ...editForm, finish_tags: tags.join(', ') })}
                      />
                    </div>
                  </section>
                </div>

                {/* Footer Actions (Static at bottom of container) */}
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 flex gap-4">
                  <button onClick={() => setEditingId(null)} className="flex-1 py-4 font-bold bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">닫기 (취소)</button>
                  <button disabled={isProcessing} onClick={() => saveEdit(false)} className="flex-1 py-4 font-bold bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 border-2 border-amber-200 dark:border-amber-900/30 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors">단순 저장</button>
                  <button disabled={isProcessing} onClick={() => saveEdit(true)} className="flex-2 py-4 font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all">
                    {isProcessing ? '처리 중...' : '✨ 저장 및 최종 승인 (공개)'}
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}