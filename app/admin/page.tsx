'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Spirit, SpiritStatus } from '@/lib/db/schema';
import Link from 'next/link';
import metadata from '@/lib/constants/spirits-metadata.json';
import { TagMultiSelect } from '@/components/ui/TagMultiSelect';

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
  // --- Refactored Admin Dashboard for Client-Side Processing ---
  const [allSpirits, setAllSpirits] = useState<Spirit[]>([]);
  const [filteredSpirits, setFilteredSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filters
  const [statusFilter, setStatusFilter] = useState<SpiritStatus | 'ALL'>('ALL');
  const [level1Cat, setLevel1Cat] = useState<string>('ALL'); // Legal Category (e.g. 위스키)
  const [level2Cat, setLevel2Cat] = useState<string>('ALL'); // Main Family (e.g. scotch) - Virtual
  const [level3Cat, setLevel3Cat] = useState<string>('ALL'); // Sub Category (e.g. Single Malt)
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit Form State (Kept same)
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '', abv: 0, imageUrl: '', name_en: '', category: '', subcategory: '',
    country: '', region: '', distillery: '', bottler: '', volume: 700,
    tasting_note: '', description: '', nose_tags: '', palate_tags: '', finish_tags: ''
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
  const level3Options = getLevel3Options(level1Cat, level2Cat);

  // --- 1. Load ALL Data on Mount ---
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch larger chunk (2000) to act as "All" for now
      const response = await fetch(`/api/admin/spirits/?page=1&pageSize=2000`);
      const data = await response.json();
      setAllSpirits(data.data || []);
      setFilteredSpirits(data.data || []);
    } catch (error) {
      console.error('Failed to load spirits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // --- 2. Client-Side Filtering ---
  useEffect(() => {
    let result = allSpirits;

    // A. Status Filter (Only if not ALL)
    if (statusFilter !== 'ALL') {
      result = result.filter(s => s.status === statusFilter);
    }

    // B. Category Hierarchy Filter
    if (level1Cat !== 'ALL') {
      result = result.filter(s => s.category === level1Cat);
    }

    // Level 2 Filter (Virtual - match any of the subcategories in this group)
    if (level1Cat !== 'ALL' && level2Cat !== 'ALL') {
      const validSubcats = getLevel3Options(level1Cat, level2Cat);
      if (validSubcats.length > 0) {
        result = result.filter(s => s.subcategory && validSubcats.includes(s.subcategory));
      }
    }

    // Level 3 Filter (Specific Subcategory)
    if (level3Cat !== 'ALL') {
      result = result.filter(s => s.subcategory === level3Cat);
    }

    // C. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.metadata?.name_en || '').toLowerCase().includes(q)
      );
    }

    setFilteredSpirits(result);
    setPage(1); // Reset to page 1 on filter change
    setSelectedIds(new Set());
  }, [allSpirits, statusFilter, level1Cat, level2Cat, level3Cat, searchQuery]);

  // --- 3. Pagination Slicing ---
  const totalPages = Math.ceil(filteredSpirits.length / pageSize);
  const paginatedSpirits = filteredSpirits.slice((page - 1) * pageSize, page * pageSize);

  // ... Actions (Publish, Delete) remain mostly same but refresh local state ...
  const handleDeleteLocal = (ids: string[]) => {
    setAllSpirits(prev => prev.filter(s => !ids.includes(s.id)));
    setSelectedIds(new Set());
  };

  const handleUpdateLocal = (id: string, updates: Partial<Spirit>) => {
    setAllSpirits(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };


  const publishSpirit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/spirits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', isPublished: true, reviewedBy: 'ADMIN', reviewedAt: new Date().toISOString() })
      });
      if (res.ok) {
        handleUpdateLocal(id, { status: 'PUBLISHED', isPublished: true });
      }
    } catch (e) {
      alert('발행 실패');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`${selectedIds.size}건을 최종 공개하시겠습니까?`)) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/spirits/bulk-patch/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spiritIds: Array.from(selectedIds),
          updates: { status: 'PUBLISHED', isPublished: true, reviewedBy: 'ADMIN', reviewedAt: new Date().toISOString() }
        })
      });

      if (res.ok) {
        // Local Update
        setAllSpirits(prev => prev.map(s => selectedIds.has(s.id) ? { ...s, status: 'PUBLISHED', isPublished: true } : s));
        alert('✅ 일괄 발행 완료');
        setSelectedIds(new Set());
      }
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
        handleDeleteLocal([id]);
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
        handleDeleteLocal(Array.from(selectedIds));
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
    // ... populate form (same as before) ...
    setEditForm({
      name: spirit.name, abv: spirit.abv, imageUrl: spirit.imageUrl || '',
      name_en: spirit.metadata?.name_en || '', category: spirit.category || '', subcategory: spirit.subcategory || '',
      country: spirit.country || '', region: spirit.region || '', distillery: spirit.distillery || '', bottler: spirit.bottler || '',
      volume: spirit.volume || 700, tasting_note: spirit.metadata?.tasting_note || '', description: spirit.metadata?.description || '',
      nose_tags: (spirit.metadata?.nose_tags || []).join(', '), palate_tags: (spirit.metadata?.palate_tags || []).join(', '), finish_tags: (spirit.metadata?.finish_tags || []).join(', ')
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
        category: editForm.category,
        subcategory: editForm.subcategory,
        country: editForm.country,
        region: editForm.region,
        distillery: editForm.distillery,
        bottler: editForm.bottler,
        volume: Number(editForm.volume) || 700,
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
        handleUpdateLocal(editingId, payload);
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
    // Select all visible on current PAGE only? Or all filtered? Usually page for bulk actions is safer visually
    const idsOnPage = paginatedSpirits.map(s => s.id);
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
          <Link href="/" className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl hover:opacity-80 transition-all">홈으로</Link>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto">
          <button className="px-8 py-4 font-bold border-b-4 border-amber-500 text-amber-600 dark:text-amber-400 transition-all whitespace-nowrap">📚 마스터 데이터</button>
        </div>

        <div className="space-y-8 animate-in fade-in duration-500">

          {/* Control Bar */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">

              {/* 3-Level Category Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-2">분류 필터:</span>

                {/* Level 1 */}
                <select className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white"
                  value={level1Cat} onChange={e => { setLevel1Cat(e.target.value); setLevel2Cat('ALL'); setLevel3Cat('ALL'); }}>
                  <option value="ALL">📂 전체 카테고리</option>
                  {level1Options.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Level 2 (Conditional) */}
                {level2Options.length > 0 && (
                  <>
                    <span className="text-gray-400">›</span>
                    <select className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white"
                      value={level2Cat} onChange={e => { setLevel2Cat(e.target.value); setLevel3Cat('ALL'); }}>
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
                      value={level3Cat} onChange={e => setLevel3Cat(e.target.value)}>
                      <option value="ALL">📑 제품 종류 (전체)</option>
                      {level3Options.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </>
                )}
              </div>

              {/* Status & Search */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                  {(['ALL', 'READY_FOR_CONFIRM', 'PUBLISHED'] as const).map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${statusFilter === f ? 'bg-white dark:bg-black shadow text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {f === 'ALL' ? '전체' : f === 'PUBLISHED' ? '공개됨' : '검수대기'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input placeholder="이름 검색..." className="bg-gray-100 dark:bg-gray-950 px-4 py-2 rounded-xl text-xs font-bold w-48 border border-transparent focus:border-amber-500 focus:outline-none text-black dark:text-white placeholder:text-gray-400"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Bulk Actions & Counts */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-900">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                총 <span className="text-amber-600 dark:text-amber-400 text-base mx-1">{filteredSpirits.length.toLocaleString()}</span>건 조회됨
                {selectedIds.size > 0 && <span className="ml-4 text-black dark:text-white">({selectedIds.size}개 선택됨)</span>}
              </div>
              <div className="flex gap-2">
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkPublish} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-amber-500 transition-colors">선택 항목 발행</button>
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-red-500 transition-colors">선택 삭제</button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm min-h-[500px] flex flex-col">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox"
                      checked={paginatedSpirits.length > 0 && paginatedSpirits.every(s => selectedIds.has(s.id))}
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
                {paginatedSpirits.map(spirit => (
                  <tr key={spirit.id} className={`hover:bg-amber-500/5 transition-colors ${selectedIds.has(spirit.id) ? 'bg-amber-500/5' : ''}`}>
                    <td className="p-4 text-center"><input type="checkbox" checked={selectedIds.has(spirit.id)} onChange={() => toggleSelect(spirit.id)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-amber-500" /></td>
                    <td className="p-4">
                      <div className="font-bold text-base text-black dark:text-white max-w-[300px] truncate">{spirit.name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{spirit.distillery || '-'} | {spirit.abv}% | {spirit.category} › {spirit.subcategory}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black border ${spirit.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {spirit.status === 'PUBLISHED' ? 'PUBLISHED' : '검수대기'}
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
                        <img src={spirit.imageUrl} className="w-10 h-10 object-contain bg-white rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm" alt="Bottle" />
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
                {paginatedSpirits.length === 0 && !loading && (
                  <tr><td colSpan={6} className="p-12 text-center text-gray-500">데이터가 없습니다.</td></tr>
                )}
                {loading && (
                  <tr><td colSpan={6} className="p-12 text-center text-amber-500 animate-pulse font-bold">데이터를 로딩 중입니다...</td></tr>
                )}
              </tbody>
            </table>

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





        {/* Expanded Edit Modal with High Z-Index to cover Bottom Nav */}
        {
          editingId && (
            <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto pt-12">
              <div className="bg-white dark:bg-black w-full max-w-7xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 animate-in zoom-in-95 duration-200 flex flex-col h-fit my-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-900">
                  <div>
                    <h2 className="text-3xl font-black text-black dark:text-white">데이터 클린룸 (Deep Edit)</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ID: {editingId}</p>
                  </div>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-2xl">✕</button>
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

                    {/* Right Column: Visuals (Fixed Width) */}
                    <div className="w-full xl:w-96 shrink-0 space-y-6 bg-gray-50 dark:bg-gray-950/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">제품 이미지</label>
                        <div className="aspect-[3/4] bg-white rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden relative group shadow-sm">
                          {editForm.imageUrl ? (
                            <img src={editForm.imageUrl} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" alt="Preview" />
                          ) : <span className="text-5xl opacity-20 text-black dark:text-white">🥃</span>}
                        </div>
                        <input className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-[10px] bg-white dark:bg-black text-gray-400 font-mono truncate focus:ring-2 focus:ring-amber-500/50 outline-none"
                          value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="https://..." />
                      </div>
                    </div>
                  </div>

                  {/* Description Block (Full Width) */}
                  <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-900">
                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">소개/설명 (Description)</label>
                    <textarea rows={5} className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-medium bg-white dark:bg-black text-black dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-amber-500/50 outline-none"
                      value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
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
                  <button disabled={isProcessing} onClick={() => saveEdit(true)} className="flex-[2] py-4 font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all">
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