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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collection'>('dashboard');
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Server-side Filters
  const [statusFilter, setStatusFilter] = useState<SpiritStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('ALL');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '', abv: 0, imageUrl: '', name_en: '', category: '', subcategory: '',
    country: '', region: '', distillery: '', bottler: '', volume: 700,
    tasting_note: '', description: '', nose_tags: '', palate_tags: '', finish_tags: ''
  });

  // Console Logs for Collection Tab
  const [consoleLogs, setConsoleLogs] = useState<string>('');

  // Extract Categories from Metadata
  const whiskyCats = metadata.categories.whisky; // object
  const otherCats = metadata.categories; // keys: gin, rum, etc (arrays)

  const getSubcategories = (cat: string) => {
    if (cat === 'ALL') return [];

    // Normalize Check
    const catLower = cat.toLowerCase();

    if (catLower.includes('whisky') || catLower.includes('위스키')) {
      // Flatten all whisky subcats
      return [
        ...whiskyCats.scotch,
        ...whiskyCats.american,
        ...whiskyCats.other_regions
      ];
    } else if (otherCats[catLower as keyof typeof otherCats]) {
      return otherCats[catLower as keyof typeof otherCats] as string[];
    }
    return [];
  };

  const currentSubcategories = getSubcategories(categoryFilter);

  // Load Data Function (Server-side)
  const loadData = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (subcategoryFilter !== 'ALL') params.set('subcategory', subcategoryFilter);
      params.set('page', pageNum.toString());
      params.set('pageSize', '50'); // Load 50 at a time

      const response = await fetch(`/api/admin/spirits/?${params.toString()}`);
      const data = await response.json();

      if (reset) {
        setSpirits(data.data || []);
      } else {
        setSpirits(prev => {
          // Filter out duplicates just in case
          const newIds = new Set(prev.map(p => p.id));
          const newItems = (data.data || []).filter((item: Spirit) => !newIds.has(item.id));
          return [...prev, ...newItems];
        });
      }

      setTotal(data.total);
      setHasMore((data.data || []).length === 50); // If < 50, end of list
    } catch (error) {
      console.error('Failed to load spirits:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, subcategoryFilter]); // Depend on filters

  // Initial Load & Filter Change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadData(1, true);
    setSelectedIds(new Set());
  }, [statusFilter, categoryFilter, subcategoryFilter]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;

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

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => { if (observerRef.current) observerRef.current.disconnect(); }
  }, [hasMore, loading]);


  // --- Action Handlers ---

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size > 0) {
      setSelectedIds(new Set());
    } else {
      // Only select loaded items
      const ids = spirits.map(s => s.id);
      setSelectedIds(new Set(ids));
    }
  };

  // Get selected objects for validation
  const getSelectedSpirits = () => spirits.filter(s => selectedIds.has(s.id));

  // Bulk Auto Process (Enrich)
  const handleBulkAutoProcess = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/pipeline/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spiritIds: Array.from(selectedIds), action: 'ENRICH' })
      });
      if (response.ok) {
        alert('AI 데이터 보완 요청이 완료되었습니다.');
        // Refresh Current View
        loadData(1, true);
        setSelectedIds(new Set());
      }
    } catch (error) {
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

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

  // Edit Logic
  const startEdit = (spirit: Spirit) => {
    setEditingId(spirit.id);
    setEditForm({
      name: spirit.name,
      abv: spirit.abv,
      imageUrl: spirit.imageUrl || '',
      name_en: spirit.metadata?.name_en || '',
      category: spirit.category || '',
      subcategory: spirit.subcategory || '',
      country: spirit.country || '',
      region: spirit.region || '',
      distillery: spirit.distillery || '',
      bottler: spirit.bottler || '',
      volume: spirit.volume || 700,
      tasting_note: spirit.metadata?.tasting_note || '',
      description: spirit.metadata?.description || '',
      nose_tags: (spirit.metadata?.nose_tags || []).join(', '),
      palate_tags: (spirit.metadata?.palate_tags || []).join(', '),
      finish_tags: (spirit.metadata?.finish_tags || []).join(', ')
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/spirits/${editingId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        setEditingId(null);
        // Refresh only the edited item? Re-fetching page 1 is safer for simplicity
        loadData(1, true);
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      alert('오류 발생');
    } finally {
      setIsProcessing(false);
    }
  };

  // Collection Control
  const runCollection = async (type: 'run_imported' | 'run_domestic' | 'run_reviews_gemini' | 'merge_ingest' | 'reset_all') => {
    setIsProcessing(true);
    setConsoleLogs(prev => prev + `\n🔄 [${new Date().toLocaleTimeString()}] 시작: ${type}...\n`);
    try {
      const res = await fetch('/api/admin/collection/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type })
      });
      const data = await res.json();
      if (data.success) {
        setConsoleLogs(prev => prev + `✅ 완료: ${data.count || 0}건 처리됨\n`);
        if (type === 'merge_ingest') loadData(1, true);
        else if (type !== 'reset_all') await runCollection('merge_ingest');
      }
    } catch (e) {
      setConsoleLogs(prev => prev + `❌ 오류 발생: ${e}\n`);
    } finally {
      if (type === 'merge_ingest' || type === 'reset_all') setIsProcessing(false);
    }
  };

  // Pre-calculated Lists for Selects
  const availableCategories = ['위스키', '진', '럼', '테킬라', '브랜디', '소주', '맥주', '리큐르', '기타주류'];
  const editSubcategories = getSubcategories(editForm.category) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]"> {/* Widen Container */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">🛠️ Club Hub Admin</h1>
        <Link href="/" className="text-sm font-bold bg-secondary px-4 py-2 rounded-xl hover:opacity-80 transition-all">홈으로</Link>
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        {(['dashboard', 'collection'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 font-bold border-b-4 transition-all whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab === 'dashboard' ? '📊 데이터 검수' : '⚙️ 파이프라인 제어'}
          </button>
        ))}
      </div>

      {activeTab === 'collection' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Same Collection UI... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground mb-2">국내 데이터</h3>
              <button disabled={isProcessing} onClick={() => runCollection('run_domestic')} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all">🇰🇷 식품안전나라 갱신</button>
            </div>
            <div className="bg-card border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground mb-2">해외 데이터</h3>
              <button disabled={isProcessing} onClick={() => runCollection('run_imported')} className="w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-bold hover:bg-secondary/80 disabled:opacity-50 transition-all">🚢 수입식품 갱신</button>
            </div>
            <div className="bg-card border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-muted-foreground mb-2">데이터베이스</h3>
              <button disabled={isProcessing} onClick={() => runCollection('merge_ingest')} className="w-full py-3 bg-gray-800 text-white border border-border rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all">📥 데이터 병합 (Ingest)</button>
            </div>
          </div>
          <div className="bg-black text-emerald-400 p-6 rounded-2xl font-mono text-xs h-80 overflow-y-auto border-4 border-gray-800 shadow-2xl">
            <pre className="whitespace-pre-wrap">{consoleLogs || '> Ready for commands...'}</pre>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-card border-border rounded-2xl p-6 shadow-xl ring-1 ring-border space-y-6">

            {/* Top Row: Title & Total & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-lg border border-primary/20">
                  Total <span className="text-2xl ml-1">{total.toLocaleString()}</span>
                </div>

                {/* Status Filter Group */}
                <div className="flex bg-secondary rounded-xl p-1">
                  {(['ALL', 'RAW', 'ENRICHED', 'PUBLISHED'] as const).map(f => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkAutoProcess} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:opacity-90">AI 보완 ({selectedIds.size})</button>
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkPublish} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:opacity-90">최종 발행</button>
                <button disabled={!selectedIds.size || isProcessing} onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:opacity-90">삭제</button>
                <button onClick={toggleSelectAll} className="text-xs font-bold border border-border px-4 py-2 rounded-xl hover:bg-secondary text-foreground">전체선택 ({spirits.length})</button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => { setCategoryFilter('ALL'); setSubcategoryFilter('ALL'); }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${categoryFilter === 'ALL' ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground/50'}`}
                >
                  전체 카테고리
                </button>
                {availableCategories.map(c => (
                  <button key={c}
                    onClick={() => { setCategoryFilter(c); setSubcategoryFilter('ALL'); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${categoryFilter === c ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground/50'}`}
                  >
                    {c}
                  </button>
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
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedIds.has(spirit.id)} onChange={() => toggleSelect(spirit.id)} className="w-4 h-4 rounded border-border accent-primary" />
                    </td>
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
                      <button onClick={() => startEdit(spirit)} className="px-3 py-1.5 bg-background border border-border text-xs font-bold rounded-lg hover:bg-secondary transition-all text-foreground">편집</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Infinite Scroll Sentinel */}
            <div ref={loadMoreRef} className="p-8 text-center text-muted-foreground text-sm font-bold flex justify-center">
              {loading && <span className="animate-pulse">Loading more spirits...</span>}
              {!hasMore && !loading && spirits.length > 0 && <span>✨ All loaded! ({spirits.length} items)</span>}
              {!loading && spirits.length === 0 && <span>No data found.</span>}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Edit Modal */}
      {editingId && (
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
                      {editSubcategories.map(c => <option key={c} value={c}>{c}</option>)}
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
                  ) : <span className="text-sm text-muted-foreground">No Image</span>}

                  <button className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md hover:bg-black/70"
                    onClick={() => window.open(editForm.imageUrl, '_blank')}>
                    View Full
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
              <button onClick={() => setEditingId(null)} className="flex-1 py-4 font-bold bg-secondary text-secondary-foreground rounded-2xl hover:bg-secondary/80">닫기</button>
              <button disabled={isProcessing} onClick={saveEdit} className="flex-[2] py-4 font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">수정 내용 저장 및 승인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}