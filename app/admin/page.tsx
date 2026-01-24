'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Spirit, SpiritStatus } from '@/lib/db/schema';
import Link from 'next/link';
import metadata from '@/lib/constants/spirits-metadata.json';

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
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Pagination & Filters
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [statusFilter, setStatusFilter] = useState<SpiritStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(''); // Search State

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit Form
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '', abv: 0, imageUrl: '', name_en: '', category: '', subcategory: '',
    country: '', region: '', distillery: '', bottler: '', volume: 700,
    tasting_note: '', description: '', nose_tags: '', palate_tags: '', finish_tags: ''
  });

  // Metadata Helpers
  const whiskyCats = metadata.categories.whisky;
  const otherCats = metadata.categories;

  const getSubcategories = (cat: string) => {
    if (cat === 'ALL') return [];
    const catLower = cat.toLowerCase();
    if (catLower.includes('whisky') || catLower.includes('위스키')) {
      return [...whiskyCats.scotch, ...whiskyCats.american, ...whiskyCats.other_regions];
    } else if (otherCats[catLower as keyof typeof otherCats]) {
      return otherCats[catLower as keyof typeof otherCats] as string[];
    }
    return [];
  };
  const currentSubcategories = getSubcategories(categoryFilter);
  const availableCategories = ['위스키', '진', '럼', '테킬라', '브랜디', '소주', '맥주', '리큐르', '기타주류'];

  // --- Data Loading ---
  const loadData = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (subcategoryFilter !== 'ALL') params.set('subcategory', subcategoryFilter);
      if (searchQuery) params.set('search', searchQuery); // Pass search query
      params.set('page', pageNum.toString());
      params.set('pageSize', '50');

      const response = await fetch(`/api/admin/spirits/?${params.toString()}`);
      const data = await response.json();

      if (reset) setSpirits(data.data || []);
      else {
        setSpirits(prev => {
          const newIds = new Set(prev.map(p => p.id));
          const newItems = (data.data || []).filter((item: Spirit) => !newIds.has(item.id));
          return [...prev, ...newItems];
        });
      }
      setTotal(data.total);
      setHasMore((data.data || []).length === 50);

      // Update Pipeline Counts (simplified - ideal: separate API)
      // For now we assume the total from separate queries or just estimate
      // In a real app, we'd fetch counts specifically. 
    } catch (error) {
      console.error('Failed to load spirits:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, subcategoryFilter, searchQuery]);

  // Load Pipeline Stats
  const refreshStats = async () => {
    // This is a rough way to get stats. In prod, make a dedicated /api/admin/stats endpoint
    // Here we just rely on what we can glimpse or we skip for now.
    // Let's rely on the user manually refreshing the lists.
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setHasMore(true);
    loadData(1, true);
    setSelectedIds(new Set());
  }, [statusFilter, categoryFilter, subcategoryFilter, searchQuery]); // Add searchQuery dependency

  // Infinite Scroll
  useEffect(() => {
    if (loading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => {
          const nextPage = prev + 1;
          loadData(nextPage, false);
          return nextPage;
        });
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => { observerRef.current?.disconnect(); }
  }, [hasMore, loading]);




  const publishSpirit = async (id: string) => {
    if (!confirm('최종 승인하시겠습니까? (공개 전환)')) return;
    setIsProcessing(true);
    try {
      await fetch(`/api/admin/spirits/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', isPublished: true, updatedAt: new Date().toISOString() })
      });
      loadData(1, true); // Refresh to remove from list (if filtered)
    } finally {
      setIsProcessing(false);
    }
  };


  // ... Existing Actions (Edit, Delete, Bulk) ...
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size >= 100) {
        alert('⚠️ 최대 100개까지만 선택 가능합니다.');
        return;
      }
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size > 0) setSelectedIds(new Set());
    else {
      // Select up to 100 items
      const idsToSelect = spirits.slice(0, 100).map(s => s.id);
      setSelectedIds(new Set(idsToSelect));
      if (spirits.length > 100) {
        alert(`처음 100개 항목만 선택되었습니다. (전체: ${spirits.length}개)`);
      }
    }
  };

  // Get selected objects for validation
  const getSelectedSpirits = () => spirits.filter(s => selectedIds.has(s.id));



  // Bulk Publish
  const handleBulkPublish = async () => {
    if (selectedIds.size === 0) return;

    // Validation: Check for RAW items
    const selectedItems = getSelectedSpirits();
    const rawItems = selectedItems.filter(s => s.status === 'RAW');
    if (rawItems.length > 0) {
      alert(`⚠️ 경고: 선택된 항목 중 ${rawItems.length}개가 'RAW' 상태입니다.\nRAW 상태의 데이터는 최종 발행할 수 없습니다. 먼저 AI 보완을 진행해주세요.`);
      return;
    }

    if (!confirm(`${selectedIds.size}건을 최종 공개하시겠습니까?`)) return;

    setIsProcessing(true);
    try {
      await fetch('/api/admin/spirits/bulk-patch/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spiritIds: Array.from(selectedIds),
          updates: { status: 'PUBLISHED', isPublished: true }
        })
      });
      alert('일괄 발행이 완료되었습니다.');
      loadData(1, true);
      setSelectedIds(new Set());
    } catch (error) {
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Single Delete Action
  const deleteSpirit = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setIsProcessing(true);
    try {
      await fetch('/api/admin/spirits/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spiritIds: [id] })
      });
      loadData(1, true);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`선택한 ${selectedIds.size}건을 삭제하시겠습니까?`)) return;

    setIsProcessing(true);
    try {
      await fetch('/api/admin/spirits/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spiritIds: Array.from(selectedIds) })
      });
      loadData(1, true);
      setSelectedIds(new Set());
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (spirit: Spirit) => {
    setEditingId(spirit.id);
    setEditForm({
      name: spirit.name, abv: spirit.abv, imageUrl: spirit.imageUrl || '',
      name_en: spirit.metadata?.name_en || '', category: spirit.category || '', subcategory: spirit.subcategory || '',
      country: spirit.country || '', region: spirit.region || '', distillery: spirit.distillery || '', bottler: spirit.bottler || '',
      volume: spirit.volume || 700, tasting_note: spirit.metadata?.tasting_note || '', description: spirit.metadata?.description || '',
      nose_tags: (spirit.metadata?.nose_tags || []).join(', '), palate_tags: (spirit.metadata?.palate_tags || []).join(', '), finish_tags: (spirit.metadata?.finish_tags || []).join(', ')
    });
  };

  const saveEdit = async (publish: boolean = false) => {
    if (!editingId) return;

    if (publish && !confirm('수정 내용을 저장하고 최종 승인(공개) 하시겠습니까?')) return;

    setIsProcessing(true);
    try {
      const payload: any = {
        name: editForm.name,
        abv: parseFloat(String(editForm.abv)),
        imageUrl: editForm.imageUrl,
        category: editForm.category,
        subcategory: editForm.subcategory,
        country: editForm.country,
        region: editForm.region,
        distillery: editForm.distillery,
        bottler: editForm.bottler,
        volume: Number(editForm.volume),
        metadata: {
          name_en: editForm.name_en,
          tasting_note: editForm.tasting_note,
          description: editForm.description,
          nose_tags: editForm.nose_tags.split(',').map(t => t.trim()).filter(Boolean),
          palate_tags: editForm.palate_tags.split(',').map(t => t.trim()).filter(Boolean),
          finish_tags: editForm.finish_tags.split(',').map(t => t.trim()).filter(Boolean),
        },
        updatedAt: new Date().toISOString()
      };

      if (publish) {
        payload.status = 'PUBLISHED';
        payload.isPublished = true;
      }

      const response = await fetch(`/api/admin/spirits/${editingId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setEditingId(null);
        loadData(1, true);
        if (publish) alert('✅ 최종 승인되었습니다.');
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      alert('오류 발생');
    } finally { setIsProcessing(false); }
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">🏭 Club Hub Pipeline</h1>
        <Link href="/" className="text-sm font-bold bg-secondary px-4 py-2 rounded-xl hover:opacity-80 transition-all">홈으로</Link>
      </div>

      <div className="flex border-b mb-8 overflow-x-auto">
        <button className="px-8 py-4 font-bold border-b-4 border-primary text-primary transition-all whitespace-nowrap">📚 마스터 데이터</button>
      </div>

      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 text-sm text-blue-800 flex items-start gap-4">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="font-bold mb-1">데이터 관리 가이드</h3>
            <p>
              이제 데이터 수집 및 AI 보완 작업은 <b>로컬 터미널</b>에서 수행합니다.<br />
              웹 관리자 페이지에서는 최종 데이터의 검수, 수정, 및 공개(Publish) 작업만 담당합니다.
            </p>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Reuse existing Master List UI here... */}
          <div className="bg-card border-border rounded-2xl p-6 shadow-xl ring-1 ring-border space-y-6">
            {/* Filters... */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-lg border border-primary/20">
                  총 <span className="text-2xl ml-1">{total.toLocaleString()}</span>건
                </div>
                <div className="flex bg-secondary rounded-xl p-1">
                  {(['ALL', 'RAW', 'ENRICHED', 'READY_FOR_CONFIRM', 'PUBLISHED'] as const).map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                      {f.replace('READY_FOR_CONFIRM', '검수대기')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">

                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkPublish} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:opacity-90">최종 발행</button>
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:opacity-90">일괄 삭제</button>
                <div className="relative">
                  <input placeholder="이름 검색..." className="bg-secondary px-4 py-2 rounded-xl text-xs font-bold w-48 border border-transparent focus:border-primary focus:outline-none"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <button onClick={toggleSelectAll} className="text-xs font-bold border border-border px-4 py-2 rounded-xl hover:bg-secondary text-foreground">전체선택 ({spirits.length})</button>
              </div>
            </div>
            {/* Category Filter Pills */}
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => { setCategoryFilter('ALL'); setSubcategoryFilter('ALL'); }} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${categoryFilter === 'ALL' ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground/50'}`}>전체 카테고리</button>
                {availableCategories.map(c => (
                  <button key={c} onClick={() => { setCategoryFilter(c); setSubcategoryFilter('ALL'); }} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${categoryFilter === c ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground/50'}`}>{c}</button>
                ))}
              </div>
              {/* Subcategory Filter Pills (Conditional) */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide min-h-[40px]">
                {categoryFilter !== 'ALL' && (
                  <>
                    <button
                      onClick={() => setSubcategoryFilter('ALL')}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${subcategoryFilter === 'ALL' ? 'bg-secondary text-secondary-foreground border-secondary-foreground' : 'bg-background text-muted-foreground border-border hover:bg-secondary/50'}`}
                    >
                      전체 세부종류
                    </button>
                    {currentSubcategories.map(c => (
                      <button key={c}
                        onClick={() => setSubcategoryFilter(c)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${subcategoryFilter === c ? 'bg-secondary text-secondary-foreground border-secondary-foreground' : 'bg-background text-muted-foreground border-border hover:bg-secondary/50'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </>
                )}
                {categoryFilter === 'ALL' && <span className="text-xs text-muted-foreground py-2 px-2">카테고리를 먼저 선택해주세요.</span>}
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-secondary/50 text-muted-foreground border-b border-border sticky top-0 z-20">
                <tr>
                  <th className="p-4 w-12 text-center">선택</th>
                  <th className="p-4">주류 정보</th>
                  <th className="p-4">상태</th>
                  <th className="p-4">AI 보완 내용</th>
                  <th className="p-4">이미지</th>
                  <th className="p-4">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {spirits.map(spirit => (
                  <tr key={spirit.id} className={`hover:bg-primary/5 transition-colors ${selectedIds.has(spirit.id) ? 'bg-primary/5' : ''}`}>
                    <td className="p-4 text-center"><input type="checkbox" checked={selectedIds.has(spirit.id)} onChange={() => toggleSelect(spirit.id)} className="w-4 h-4 rounded border-border accent-primary" /></td>
                    <td className="p-4">
                      <div className="font-bold text-base text-foreground max-w-[300px] truncate">{spirit.name}</div>
                      <div className="text-[11px] text-muted-foreground">{spirit.distillery} | {spirit.abv}% | {spirit.category} / {spirit.subcategory}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${spirit.status === 'PUBLISHED' ? 'bg-primary/10 text-primary border-primary/20' :
                        spirit.status === 'ENRICHED' ? 'bg-secondary text-secondary-foreground border-secondary-foreground/20' :
                          'bg-muted text-muted-foreground border-border'}`}>
                        {spirit.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[240px]">
                        <div className="text-xs font-bold text-primary truncate">{spirit.metadata?.name_en || '-'}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                          {spirit.metadata?.nose_tags?.join(', ') || '태그 없음'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {spirit.imageUrl ? (
                        <img src={spirit.imageUrl} className="w-12 h-12 object-contain bg-background rounded-lg border border-border shadow-sm" alt="Bottle" />
                      ) : (
                        <div className="w-12 h-12 bg-secondary rounded-lg border border-border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">Empty</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(spirit)} className="px-3 py-1.5 bg-background border border-border text-xs font-bold rounded-lg hover:bg-secondary transition-all text-foreground">편집</button>
                        <button onClick={() => deleteSpirit(spirit.id)} className="px-3 py-1.5 bg-destructive/10 border border-destructive/20 text-xs font-bold rounded-lg hover:bg-destructive/20 transition-all text-destructive">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Infinite Scroll Sentinel */}
            <div ref={loadMoreRef} className="p-8 text-center text-muted-foreground text-sm font-bold flex justify-center">
              {loading && <span className="animate-pulse">더 많은 주류를 로드 중...</span>}
              {!hasMore && !loading && spirits.length > 0 && <span>✨ 모든 항목 로드 완료! ({spirits.length}개)</span>}
              {!loading && spirits.length === 0 && <span>데이터를 찾을 수 없습니다.</span>}
            </div>
          </div>
        </div>


        {/* Expanded Edit Modal */}
        {
          editingId && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-card w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-border p-10 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-black mb-6 text-foreground">데이터 최종 검수</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">제품명 (KO)</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl bg-secondary/50 font-bold text-foreground text-sm" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">영문 명칭</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold text-primary bg-background text-sm" value={editForm.name_en} onChange={e => setEditForm({ ...editForm, name_en: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">카테고리</label>
                        <select className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm"
                          value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value, subcategory: '' })}>
                          <option value="">선택</option>
                          {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">세부종류</label>
                        <select className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm"
                          value={editForm.subcategory} onChange={e => setEditForm({ ...editForm, subcategory: e.target.value })}>
                          <option value="">선택</option>
                          {currentSubcategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">도수 (%)</label>
                        <input type="number" className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.abv} onChange={e => setEditForm({ ...editForm, abv: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">제조국</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">지역</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">증류소</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.distillery} onChange={e => setEditForm({ ...editForm, distillery: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-muted-foreground">병입자/브랜드</label>
                        <input className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.bottler} onChange={e => setEditForm({ ...editForm, bottler: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-muted-foreground">테이스팅 노트 (Review Summary)</label>
                      <textarea rows={3} className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.tasting_note} onChange={e => setEditForm({ ...editForm, tasting_note: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-muted-foreground">소개/설명 (Description)</label>
                      <textarea rows={4} className="w-full mt-1 px-4 py-3 border border-input rounded-xl font-bold bg-background text-foreground text-sm" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>
                  </div>

                  {/* Right Side: Image & Tags */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">제품 이미지</label>
                    <div className="aspect-[4/3] bg-secondary rounded-2xl border border-border flex items-center justify-center overflow-hidden relative">
                      {editForm.imageUrl ? (
                        <img src={editForm.imageUrl} className="h-full object-contain" alt="Preview" />
                      ) : <span className="text-sm text-muted-foreground">이미지 없음</span>}

                      <button className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md hover:bg-black/70"
                        onClick={() => window.open(editForm.imageUrl, '_blank')}>
                        전체 보기
                      </button>
                    </div>
                    <input className="w-full px-4 py-3 border border-input rounded-xl text-xs bg-background text-foreground font-mono" value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} placeholder="Image URL" />

                    <div className="grid grid-cols-1 gap-4 mt-8">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1">Nose Tags</label>
                        <input className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground" value={editForm.nose_tags} onChange={e => setEditForm({ ...editForm, nose_tags: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1">Palate Tags</label>
                        <input className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground" value={editForm.palate_tags} onChange={e => setEditForm({ ...editForm, palate_tags: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1">Finish Tags</label>
                        <input className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground" value={editForm.finish_tags} onChange={e => setEditForm({ ...editForm, finish_tags: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border flex gap-4">
                  <button onClick={() => setEditingId(null)} className="flex-1 py-4 font-bold bg-secondary text-secondary-foreground rounded-2xl hover:bg-secondary/80">닫기 (저장 안함)</button>
                  <button disabled={isProcessing} onClick={() => saveEdit(false)} className="flex-1 py-4 font-bold bg-primary/10 text-primary border-2 border-primary/20 rounded-2xl hover:bg-primary/20">단순 저장 (승인 보류)</button>
                  <button disabled={isProcessing} onClick={() => saveEdit(true)} className="flex-[2] py-4 font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">수정 내용 저장 및 최종 승인 (공개)</button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}