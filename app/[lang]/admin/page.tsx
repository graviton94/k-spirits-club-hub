'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
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
    description_ko: string;
    description_en: string;
    pairing_guide_ko: string;
    pairing_guide_en: string;
    nose_tags: string;
    palate_tags: string;
    finish_tags: string;
}

export default function AdminDashboard() {
    useEffect(() => {
        document.title = `K-Spirits Club | 관리자 대시보드`;
    }, []);

    // State
    const [spirits, setSpirits] = useState<Spirit[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 50;

    // Filters
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
    const [distilleryFilter, setDistilleryFilter] = useState<string>('ALL');
    const [isPublishedFilter, setIsPublishedFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Local filter state (before applying)
    const [localCategoryFilter, setLocalCategoryFilter] = useState<string>('ALL');
    const [localDistilleryFilter, setLocalDistilleryFilter] = useState<string>('ALL');
    const [localIsPublishedFilter, setLocalIsPublishedFilter] = useState<string>('ALL');
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    // Edit Modal
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editForm, setEditForm] = useState<EditFormState>({
        name: '', abv: 0, imageUrl: '', name_en: '', category: '', subcategory: '',
        country: '', region: '', distillery: '', bottler: '', volume: 700,
        tasting_note: '', description_ko: '', description_en: '', pairing_guide_ko: '', pairing_guide_en: '',
        nose_tags: '', palate_tags: '', finish_tags: ''
    });

    // Metadata
    const categoryOptions = Object.keys(metadata.categories);
    const distilleryOptions = (metadata as any).distilleries || [];

    // Load Spirits
    const loadSpirits = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('pageSize', pageSize.toString());

            if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
            if (distilleryFilter !== 'ALL') params.append('distillery', distilleryFilter);
            if (isPublishedFilter !== 'ALL') params.append('isPublished', isPublishedFilter);
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
    }, [page, categoryFilter, distilleryFilter, isPublishedFilter, searchQuery]);

    const handleApplyFilters = () => {
        setPage(1);
        setCategoryFilter(localCategoryFilter);
        setDistilleryFilter(localDistilleryFilter);
        setIsPublishedFilter(localIsPublishedFilter);
        setSearchQuery(localSearchQuery);
    };

    useEffect(() => {
        loadSpirits();
    }, [loadSpirits]);

    useEffect(() => {
        setPage(1);
    }, [categoryFilter, distilleryFilter, isPublishedFilter, searchQuery]);

    // Actions
    const publishSpirit = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/spirits/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'PUBLISHED',
                    isPublished: true,
                    reviewedBy: 'ADMIN',
                    reviewedAt: new Date().toISOString()
                })
            });
            if (res.ok) {
                await loadSpirits();
            }
        } catch (e) {
            alert('발행 실패');
        }
    };

    const deleteSpirit = async (id: string) => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/spirits/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await loadSpirits();
            }
        } catch (e) {
            alert('삭제 실패');
        }
    };

    const startEdit = (spirit: Spirit) => {
        setEditingId(spirit.id);
        setEditForm({
            name: spirit.name,
            abv: spirit.abv,
            imageUrl: spirit.imageUrl || '',
            name_en: spirit.metadata?.name_en || spirit.name_en || '',
            category: spirit.category || '',
            subcategory: spirit.subcategory || '',
            country: spirit.country || '',
            region: spirit.region || '',
            distillery: spirit.distillery || '',
            bottler: spirit.bottler || '',
            volume: spirit.volume || 700,
            tasting_note: spirit.tasting_note || spirit.metadata?.tasting_note || '',
            description_ko: spirit.metadata?.description_ko || '',
            description_en: spirit.metadata?.description_en || '',
            pairing_guide_ko: spirit.metadata?.pairing_guide_ko || '',
            pairing_guide_en: spirit.metadata?.pairing_guide_en || '',
            nose_tags: (spirit.nose_tags || []).join(', '),
            palate_tags: (spirit.palate_tags || []).join(', '),
            finish_tags: (spirit.finish_tags || []).join(', ')
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
                thumbnailUrl: editForm.imageUrl,
                category: editForm.category,
                subcategory: editForm.subcategory,
                country: editForm.country,
                region: editForm.region,
                distillery: editForm.distillery,
                bottler: editForm.bottler,
                volume: Number(editForm.volume) || 700,
                name_en: editForm.name_en,
                tasting_note: editForm.tasting_note,
                nose_tags: editForm.nose_tags.split(',').filter(Boolean).map(t => t.trim()),
                palate_tags: editForm.palate_tags.split(',').filter(Boolean).map(t => t.trim()),
                finish_tags: editForm.finish_tags.split(',').filter(Boolean).map(t => t.trim()),
                metadata: {
                    description_ko: editForm.description_ko,
                    description_en: editForm.description_en,
                    pairing_guide_ko: editForm.pairing_guide_ko,
                    pairing_guide_en: editForm.pairing_guide_en,
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
                await loadSpirits();
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

    const generateAIData = async () => {
        if (!editingId) return;
        setIsProcessing(true);
        try {
            const res = await fetch('/api/admin/spirits/bulk-patch', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spiritIds: [editingId],
                    enrich: true,
                    updates: {}
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Enrichment failed');
            }

            const data = await res.json();

            if (data.enrichmentErrors && data.enrichmentErrors.length > 0) {
                throw new Error(data.enrichmentErrors[0].error);
            }

            // Reload spirit data
            const spiritRes = await fetch(`/api/admin/spirits/${editingId}`);
            if (spiritRes.ok) {
                const updatedSpirit = await spiritRes.json();
                setEditForm({
                    ...editForm,
                    name_en: updatedSpirit.name_en ?? editForm.name_en,
                    description_ko: updatedSpirit.metadata?.description_ko ?? editForm.description_ko,
                    description_en: updatedSpirit.metadata?.description_en ?? editForm.description_en,
                    nose_tags: (updatedSpirit.nose_tags || []).join(', '),
                    palate_tags: (updatedSpirit.palate_tags || []).join(', '),
                    finish_tags: (updatedSpirit.finish_tags || []).join(', '),
                    pairing_guide_en: updatedSpirit.metadata?.pairing_guide_en ?? editForm.pairing_guide_en,
                    pairing_guide_ko: updatedSpirit.metadata?.pairing_guide_ko ?? editForm.pairing_guide_ko,
                    distillery: updatedSpirit.distillery ?? editForm.distillery,
                    region: updatedSpirit.region ?? editForm.region,
                    country: updatedSpirit.country ?? editForm.country,
                    abv: updatedSpirit.abv ?? editForm.abv
                });
            }

            alert('✨ AI 데이터 생성 완료!');
        } catch (e: any) {
            alert(`AI 생성 중 오류: ${e.message}`);
            console.error('Enrichment error:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <div className="container mx-auto px-4 py-4 md:py-8 max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-black">🏭 관리자 대시보드</h1>
                    <Link href="/" prefetch={false} className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl hover:opacity-80">
                        홈으로
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl mb-6">
                    <div className="space-y-4">
                        {/* Filter Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <select
                                className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                                value={localCategoryFilter}
                                onChange={e => setLocalCategoryFilter(e.target.value)}
                            >
                                <option value="ALL">📂 전체 카테고리</option>
                                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <select
                                className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                                value={localDistilleryFilter}
                                onChange={e => setLocalDistilleryFilter(e.target.value)}
                            >
                                <option value="ALL">🏭 전체 증류소</option>
                                {distilleryOptions.slice(0, 200).map((d: string) => <option key={d} value={d}>{d}</option>)}
                            </select>

                            <select
                                className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                                value={localIsPublishedFilter}
                                onChange={e => setLocalIsPublishedFilter(e.target.value)}
                            >
                                <option value="ALL">📋 발행 상태 (전체)</option>
                                <option value="true">✅ 발행됨</option>
                                <option value="false">❌ 미발행</option>
                            </select>

                            <input
                                placeholder="제품명 검색..."
                                className="px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                                value={localSearchQuery}
                                onChange={e => setLocalSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleApplyFilters}
                                className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600"
                            >
                                🔍 필터 적용
                            </button>

                            <button
                                disabled={isProcessing}
                                onClick={async () => {
                                    if (!confirm('최신 글로벌 주류 뉴스를 수집하시겠습니까?')) return;
                                    setIsProcessing(true);
                                    try {
                                        const res = await fetch('/api/admin/news/collect', { method: 'POST' });
                                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                                        const data = await res.json();
                                        if (data.success) {
                                            alert(`✅ 뉴스 수집 완료! (${data.count ?? 0}건)`);
                                        } else {
                                            alert(`❌ 실패: ${data.error || '알 수 없는 오류'}`);
                                        }
                                    } catch (e: any) {
                                        alert(`뉴스 수집 중 에러: ${e.message}`);
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-cyan-500"
                            >
                                📰 뉴스 수집
                            </button>
                        </div>

                        {/* Count */}
                        <div className="text-xs font-bold text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-900">
                            총 <span className="text-amber-600 dark:text-amber-400 text-base mx-1">{totalCount.toLocaleString()}</span>건
                            (현재 페이지: {spirits.length}건)
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="p-3 md:p-4">주류 정보</th>
                                    <th className="p-3 md:p-4">상태</th>
                                    <th className="p-3 md:p-4 hidden sm:table-cell">이미지</th>
                                    <th className="p-3 md:p-4">작업</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                                {spirits.map(spirit => (
                                    <tr key={spirit.id} className="hover:bg-amber-500/5">
                                        <td className="p-3 md:p-4">
                                            <div className="font-bold text-sm md:text-base max-w-[200px] md:max-w-[300px] truncate">
                                                {spirit.name}
                                            </div>
                                            <div className="text-[10px] md:text-[11px] text-gray-500">
                                                {spirit.distillery || '-'} | {spirit.abv}% | {spirit.category}
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <span className={`px-2 py-1 rounded text-[9px] md:text-[10px] font-black ${spirit.isPublished
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {spirit.isPublished ? '✅ 발행' : '❌ 미발행'}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 hidden sm:table-cell">
                                            {spirit.imageUrl ? (
                                                <img src={getOptimizedImageUrl(spirit.imageUrl, 80)}
                                                    className="w-8 h-8 md:w-10 md:h-10 object-contain bg-white rounded-lg border"
                                                    alt="Bottle" />
                                            ) : (
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-900 rounded-lg border border-dashed" />
                                            )}
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <div className="flex gap-1 md:gap-2">
                                                <button
                                                    onClick={() => startEdit(spirit)}
                                                    className="px-2 md:px-3 py-1 md:py-1.5 bg-white dark:bg-black border text-[10px] md:text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
                                                >
                                                    편집
                                                </button>
                                                {!spirit.isPublished && (
                                                    <button
                                                        onClick={() => publishSpirit(spirit.id)}
                                                        className="px-2 md:px-3 py-1 md:py-1.5 bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] md:text-xs font-bold rounded-lg"
                                                    >
                                                        발행
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteSpirit(spirit.id)}
                                                    className="px-2 md:px-3 py-1 md:py-1.5 bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] md:text-xs font-bold rounded-lg"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {spirits.length === 0 && !loading && (
                                    <tr><td colSpan={4} className="p-12 text-center text-gray-500">조건에 맞는 데이터가 없습니다.</td></tr>
                                )}
                                {loading && (
                                    <tr><td colSpan={4} className="p-12 text-center text-amber-500 animate-pulse font-bold">로딩 중...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 md:px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 font-bold text-xs md:text-sm"
                        >
                            이전
                        </button>
                        <div className="text-xs md:text-sm font-bold text-gray-500">
                            Page <span className="text-black dark:text-white">{page}</span> of {Math.max(1, totalPages)}
                        </div>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 md:px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-30 font-bold text-xs md:text-sm"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-2 md:p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-black w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl border p-4 md:p-8 my-4 md:my-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black">제품 편집</h2>
                                <p className="text-gray-500 text-xs md:text-sm mt-1">ID: {editingId}</p>
                            </div>
                            <button
                                onClick={() => setEditingId(null)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-xl md:text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* AI Generate Button */}
                        <button
                            disabled={isProcessing}
                            onClick={generateAIData}
                            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
                        >
                            ✨ {isProcessing ? 'AI 생성 중...' : 'AI 데이터 생성 (영문명, 설명, 페어링 가이드)'}
                        </button>

                        {/* Form - Scrollable */}
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                            {/* Basic Info */}
                            <section className="space-y-3">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">기본 정보</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">제품명 (KO)</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">영문 명칭</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
                                            value={editForm.name_en}
                                            onChange={e => setEditForm({ ...editForm, name_en: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">카테고리</label>
                                        <select
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.category}
                                            onChange={e => setEditForm({ ...editForm, category: e.target.value, subcategory: '' })}
                                        >
                                            <option value="">선택</option>
                                            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">세부종류</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.subcategory}
                                            onChange={e => setEditForm({ ...editForm, subcategory: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">도수 (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.abv}
                                            onChange={e => setEditForm({ ...editForm, abv: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Origin */}
                            <section className="space-y-3 pt-4 border-t">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">제조 정보</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">증류소</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm"
                                            value={editForm.distillery}
                                            onChange={e => setEditForm({ ...editForm, distillery: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">보틀러</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm"
                                            value={editForm.bottler}
                                            onChange={e => setEditForm({ ...editForm, bottler: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">국가</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm"
                                            value={editForm.country}
                                            onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">지역</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm"
                                            value={editForm.region}
                                            onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Image */}
                            <section className="space-y-3 pt-4 border-t">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">이미지</h3>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">이미지 URL</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 font-bold text-sm"
                                            value={editForm.imageUrl}
                                            onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setEditForm({ ...editForm, imageUrl: '' })}
                                        className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold rounded-lg"
                                    >
                                        이미지 제거
                                    </button>
                                </div>
                                {editForm.imageUrl && (
                                    <img src={editForm.imageUrl} className="w-20 h-20 object-contain bg-white rounded-lg border" alt="Preview" />
                                )}
                            </section>

                            {/* Tags */}
                            <section className="space-y-3 pt-4 border-t">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">향미 태그</h3>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Nose (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.nose_tags}
                                        onChange={e => setEditForm({ ...editForm, nose_tags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Palate (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.palate_tags}
                                        onChange={e => setEditForm({ ...editForm, palate_tags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Finish (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.finish_tags}
                                        onChange={e => setEditForm({ ...editForm, finish_tags: e.target.value })}
                                    />
                                </div>
                            </section>

                            {/* Descriptions */}
                            <section className="space-y-3 pt-4 border-t">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">설명</h3>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">한글 설명</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.description_ko}
                                        onChange={e => setEditForm({ ...editForm, description_ko: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">영문 설명</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.description_en}
                                        onChange={e => setEditForm({ ...editForm, description_en: e.target.value })}
                                    />
                                </div>
                            </section>

                            {/* Pairing Guide */}
                            <section className="space-y-3 pt-4 border-t">
                                <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">페어링 가이드</h3>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">한글</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.pairing_guide_ko}
                                        onChange={e => setEditForm({ ...editForm, pairing_guide_ko: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">영문</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.pairing_guide_en}
                                        onChange={e => setEditForm({ ...editForm, pairing_guide_en: e.target.value })}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-6 border-t">
                            <button
                                disabled={isProcessing}
                                onClick={() => setEditingId(null)}
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                취소
                            </button>
                            <button
                                disabled={isProcessing}
                                onClick={() => saveEdit(false)}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 disabled:opacity-50"
                            >
                                {isProcessing ? '저장 중...' : '💾 저장만'}
                            </button>
                            <button
                                disabled={isProcessing}
                                onClick={() => saveEdit(true)}
                                className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 disabled:opacity-50"
                            >
                                {isProcessing ? '처리 중...' : '✨ 저장 및 발행'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
