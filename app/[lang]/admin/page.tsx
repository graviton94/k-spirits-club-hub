'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Spirit, SpiritStatus, ModificationRequest } from '@/lib/db/schema';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import metadata from '@/lib/constants/spirits-metadata.json';
import { TagMultiSelect } from '@/components/ui/TagMultiSelect';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import DiscoveryLogsTable from '@/components/admin/DiscoveryLogsTable';
import { 
    getDC,
    dbAdminListRawSpirits, 
    dbListModificationRequests, 
    dbUpsertModificationRequest,
    dbListNewsArticles
} from '@/lib/db/data-connect-client';
import { getSpiritById } from '@/app/[lang]/actions/spirits';
import { useModal } from '@/app/[lang]/context/modal-context';


interface EditFormState {
    name: string;
    mainCategory: string;
    abv: number | string;
    imageUrl: string;
    nameEn: string;
    category: string;
    categoryEn: string;
    subcategory: string;
    country: string;
    region: string;
    distillery: string;
    bottler: string;
    volume: number;
    tastingNote: string;
    descriptionKo: string;
    descriptionEn: string;
    pairingGuideKo: string;
    pairingGuideEn: string;
    noseTags: string;
    palateTags: string;
    finishTags: string;
}

export default function AdminDashboard() {
    const pathname = usePathname() || '';
    const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
    const isEn = lang === 'en';
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        document.title = `K-Spirits Club | ${isEn ? 'Admin Dashboard' : '관리자 대시보드'}`;
    }, [isEn]);

    // State
    const [activeTab, setActiveTab] = useState<'spirits' | 'requests' | 'discovery'>('spirits');
    const [spirits, setSpirits] = useState<Spirit[]>([]);
    const [requests, setRequests] = useState<ModificationRequest[]>([]);
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
    const [isCreating, setIsCreating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editForm, setEditForm] = useState<EditFormState>({
        name: '', mainCategory: '', abv: 0, imageUrl: '', nameEn: '', category: '', categoryEn: '', subcategory: '',
        country: '', region: '', distillery: '', bottler: '', volume: 700,
        tastingNote: '', descriptionKo: '', descriptionEn: '', pairingGuideKo: '', pairingGuideEn: '',
        noseTags: '', palateTags: '', finishTags: ''
    });

    // [Task 3.2] Scroll Lock for Mobile Stability + Modal Context
    useEffect(() => {
        if (editingId || isCreating) {
            document.body.style.overflow = 'hidden';
            openModal();
        } else {
            document.body.style.overflow = 'unset';
            closeModal();
        }
        return () => {
            document.body.style.overflow = 'unset';
            closeModal();
        };
    }, [editingId, isCreating]);


    // Lock background scroll while modal is open to prevent mobile viewport shift / focus loss
    useEffect(() => {
        if (!editingId) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [editingId]);

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

            // Direct SQL query using Client SDK with implicit Auth Token
            const spiritsObj = await dbAdminListRawSpirits({
                limit: pageSize,
                offset: (page - 1) * pageSize,
                category: categoryFilter === 'ALL' ? undefined : categoryFilter,
                distillery: distilleryFilter === 'ALL' ? undefined : distilleryFilter,
                isPublished: isPublishedFilter === 'ALL' ? undefined : (isPublishedFilter === 'true'),
                search: searchQuery || undefined
            });

            setSpirits((spiritsObj || []) as any);
            setTotalCount(13000); // Pagination proxy

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

    const loadRequests = useCallback(async () => {
        setLoading(true);
        try {
            const mods = await dbListModificationRequests();
            setRequests((mods || []) as any);

        } catch (error) {
            console.error('Failed to load requests:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'spirits') {
            loadSpirits();
        } else if (activeTab === 'requests') {
            loadRequests();
        }
    }, [activeTab, loadSpirits, loadRequests]);

    useEffect(() => {
        setPage(1);
    }, [categoryFilter, distilleryFilter, isPublishedFilter, searchQuery]);

    // Actions
    const updateRequestStatus = async (id: string, status: 'pending' | 'checked' | 'resolved') => {
        try {
            await dbUpsertModificationRequest({
                id,
                status
            });
            await loadRequests();
        } catch (e) {
            alert('상태 업데이트 에러 발생');
        }
    };
    const publishSpirit = async (id: string) => {
        try {
            const current = spirits.find(s => s.id === id);
            if (!current) throw new Error('Spirit not found');

            const res = await fetch('/api/admin/spirits/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                id: current.id,
                name: current.name,
                category: current.category,
                imageUrl: current.imageUrl || current.thumbnailUrl || '/mys-4.webp',
                thumbnailUrl: current.thumbnailUrl || current.imageUrl || '/mys-4.webp',
                status: 'PUBLISHED',
                isPublished: true,
                isReviewed: true,
                reviewedBy: 'ADMIN',
                reviewedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            await loadSpirits();
        } catch (e) {
            alert('발행 실패');
        }
    };

    const deleteSpirit = async (id: string) => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;
        try {
            const res = await fetch('/api/admin/spirits/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            await loadSpirits();
        } catch (e) {
            alert('삭제 실패');
        }
    };

    const startEdit = async (spirit: Spirit) => {
        setIsProcessing(true);
        try {
            // [Task 3.1] Fresh Fetch strategy
            const freshSpirit = await getSpiritById(spirit.id);
            if (!freshSpirit) {
                alert('최신 데이터를 가져오는데 실패했습니다.');
                return;
            }

            setIsCreating(false);
            setEditingId(freshSpirit.id);
            setEditForm({
                name: freshSpirit.name,
                mainCategory: freshSpirit.mainCategory || '',
                abv: freshSpirit.abv ?? 0,

                imageUrl: freshSpirit.imageUrl || '',
                nameEn: freshSpirit.nameEn || '',
                category: freshSpirit.category || '',
                categoryEn: freshSpirit.categoryEn || '',
                subcategory: freshSpirit.subcategory || '',
                country: freshSpirit.country || '',
                region: freshSpirit.region || '',
                distillery: freshSpirit.distillery || '',
                bottler: freshSpirit.bottler || '',
                volume: freshSpirit.volume || 700,
                tastingNote: freshSpirit.tastingNote || '',
                descriptionKo: freshSpirit.descriptionKo || '',
                descriptionEn: freshSpirit.descriptionEn || '',
                pairingGuideKo: freshSpirit.pairingGuideKo || '',
                pairingGuideEn: freshSpirit.pairingGuideEn || '',
                noseTags: (freshSpirit.noseTags || []).join(', '),
                palateTags: (freshSpirit.palateTags || []).join(', '),
                finishTags: (freshSpirit.finishTags || []).join(', ')
            });
        } catch (error) {
            console.error('Failed to start edit:', error);
            alert('데이터 로드 중 에러가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const startCreate = () => {
        setIsCreating(true);
        setEditingId('__new__');
        setEditForm({
            name: '', mainCategory: '', abv: 0, imageUrl: '', nameEn: '', category: '', categoryEn: '', subcategory: '',
            country: '', region: '', distillery: '', bottler: '', volume: 700,
            tastingNote: '', descriptionKo: '', descriptionEn: '', pairingGuideKo: '', pairingGuideEn: '',
            noseTags: '', palateTags: '', finishTags: ''
        });
    };

    const createSpirit = async (publish: boolean) => {
        if (!editForm.name || !editForm.category) {
            alert('제품명과 카테고리는 필수입니다.');
            return;
        }
        setIsProcessing(true);
        try {
            const payload: any = {
                name: editForm.name,
                mainCategory: editForm.mainCategory,
                abv: parseFloat(String(editForm.abv)) || 0,
                imageUrl: editForm.imageUrl,
                category: editForm.category,
                categoryEn: editForm.categoryEn,
                subcategory: editForm.subcategory,
                country: editForm.country,
                region: editForm.region,
                distillery: editForm.distillery,
                bottler: editForm.bottler,
                volume: Number(editForm.volume) || 700,
                nameEn: editForm.nameEn,
                tastingNote: editForm.tastingNote,
                noseTags: editForm.noseTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                palateTags: editForm.palateTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                finishTags: editForm.finishTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                descriptionKo: editForm.descriptionKo,
                descriptionEn: editForm.descriptionEn,
                pairingGuideKo: editForm.pairingGuideKo,
                pairingGuideEn: editForm.pairingGuideEn,
            };

            if (publish) {
                payload.isPublished = true;
            }

            const nextId = `kspt-${Math.random().toString(36).substring(2, 10)}`;
            payload.id = nextId;
            payload.createdAt = new Date().toISOString();
            payload.updatedAt = new Date().toISOString();
            payload.isReviewed = payload.isPublished || false;
            
            const res = await fetch('/api/admin/spirits/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                ...payload,
                imageUrl: payload.imageUrl || '/mys-4.webp',
                thumbnailUrl: payload.imageUrl || '/mys-4.webp',
                isPublished: publish ? true : false,
                status: publish ? 'PUBLISHED' : 'DRAFT',
                isReviewed: publish ? true : false,
                reviewedBy: publish ? 'ADMIN' : null,
                reviewedAt: publish ? new Date().toISOString() : null,
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            await loadSpirits();
            setEditingId(null);
            setIsCreating(false);
            alert(`✅ 새 제품 등록${publish ? ' 및 발행' : ''} 완료 (ID: ${nextId})`);
        } catch (e) {
            console.error(e);
            alert('Error during create');
        } finally {
            setIsProcessing(false);
        }
    };

    const saveEdit = async (publish: boolean) => {
        if (!editingId || isCreating) return;
        setIsProcessing(true);
        try {
            const payload: any = {
                name: editForm.name,
                mainCategory: editForm.mainCategory,
                abv: parseFloat(String(editForm.abv)) || 0,
                imageUrl: editForm.imageUrl,
                thumbnailUrl: editForm.imageUrl,
                category: editForm.category,
                categoryEn: editForm.categoryEn,
                subcategory: editForm.subcategory,
                country: editForm.country,
                region: editForm.region,
                distillery: editForm.distillery,
                bottler: editForm.bottler,
                volume: Number(editForm.volume) || 700,
                nameEn: editForm.nameEn,
                tastingNote: editForm.tastingNote,
                noseTags: editForm.noseTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                palateTags: editForm.palateTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                finishTags: editForm.finishTags.split(',').filter(Boolean).map((t: string) => t.trim()),
                descriptionKo: editForm.descriptionKo,
                descriptionEn: editForm.descriptionEn,
                pairingGuideKo: editForm.pairingGuideKo,
                pairingGuideEn: editForm.pairingGuideEn,
                updatedAt: new Date().toISOString()
            };

            if (publish) {
                payload.status = 'PUBLISHED';
                payload.isPublished = true;
                payload.reviewedBy = 'ADMIN';
                payload.reviewedAt = new Date().toISOString();
            }

            payload.id = editingId;
            const res = await fetch('/api/admin/spirits/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                ...payload,
                id: editingId,
                name: payload.name || editForm.name,
                category: payload.category || editForm.category,
                imageUrl: payload.imageUrl || '/mys-4.webp',
                thumbnailUrl: payload.imageUrl || '/mys-4.webp',
                ...(publish ? {
                    status: 'PUBLISHED',
                    isPublished: true,
                    isReviewed: true,
                    reviewedBy: 'ADMIN',
                    reviewedAt: new Date().toISOString(),
                } : {}),
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            await loadSpirits();
            setEditingId(null);
            alert(publish ? '✅ 저장 및 공개 완료' : '✅ 저장 완료');
        } catch (e) {
            console.error(e);
            alert('Error during save');
        } finally {
            setIsProcessing(false);
        }
    };

    const generateAIData = async () => {
        if (!editingId || isCreating) return;
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
                    // Identity fields
                    nameEn: updatedSpirit.nameEn ?? editForm.nameEn,
                    // Category is LOCKED - never update from AI
                    subcategory: updatedSpirit.subcategory ?? editForm.subcategory,
                    distillery: updatedSpirit.distillery ?? editForm.distillery,
                    region: updatedSpirit.region ?? editForm.region,
                    country: updatedSpirit.country ?? editForm.country,
                    abv: updatedSpirit.abv ?? editForm.abv,
                    // Sensory fields
                    descriptionKo: updatedSpirit.descriptionKo ?? editForm.descriptionKo,
                    descriptionEn: updatedSpirit.descriptionEn ?? editForm.descriptionEn,
                    noseTags: (updatedSpirit.noseTags || []).join(', '),
                    palateTags: (updatedSpirit.palateTags || []).join(', '),
                    finishTags: (updatedSpirit.finishTags || []).join(', '),
                    // Pairing fields
                    pairingGuideEn: updatedSpirit.pairingGuideEn ?? editForm.pairingGuideEn,
                    pairingGuideKo: updatedSpirit.pairingGuideKo ?? editForm.pairingGuideKo
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

    const generatePairingOnly = async () => {
        if (!editingId) return;
        setIsProcessing(true);
        try {
            const res = await fetch('/api/admin/spirits/ai/pairing', {
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
                    nameEn: editForm.nameEn,
                    noseTags: editForm.noseTags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    palateTags: editForm.palateTags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    finishTags: editForm.finishTags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    pairingGuideKo: editForm.pairingGuideKo,
                    pairingGuideEn: editForm.pairingGuideEn
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Pairing generation failed');
            }

            const data = await res.json();
            if (data.success && data.pairingData) {
                setEditForm({
                    ...editForm,
                    pairingGuideKo: data.pairingData.pairingGuideKo,
                    pairingGuideEn: data.pairingData.pairingGuideEn
                });
                alert('✨ 페어링 가이드 생성 완료!');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (e: any) {
            alert(`페어링 생성 중 오류: ${e.message}`);
            console.error('Pairing error:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    const generateDescriptionOnly = async () => {
        if (!editingId) return;
        setIsProcessing(true);
        try {
            const res = await fetch('/api/admin/spirits/ai/description', {
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
                    nameEn: editForm.nameEn,
                    noseTags: editForm.noseTags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    palateTags: editForm.palateTags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    finishTags: editForm.finishTags.split(',').map((t: string) => t.trim()).filter(Boolean)
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Description generation failed');
            }

            const data = await res.json();
            if (data.success && data.descriptionData) {
                setEditForm({
                    ...editForm,
                    descriptionKo: data.descriptionData.descriptionKo,
                    descriptionEn: data.descriptionData.descriptionEn
                });
                alert('✨ 설명 생성 완료!');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (e: any) {
            alert(`설명 생성 중 오류: ${e.message}`);
            console.error('Description error:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-4 md:py-8 max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-black">🏭 {lang === 'en' ? 'Admin Dashboard' : '관리자 대시보드'}</h1>
                    <Link href={`/${lang}`} prefetch={false} className="text-sm font-black bg-secondary text-foreground px-4 py-2 rounded-xl hover:brightness-110 shadow-sm">
                        {lang === 'en' ? 'Back Home' : '홈으로'}
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-border pb-2">
                    <button
                        onClick={() => setActiveTab('spirits')}
                        className={`text-lg font-black pb-2 border-b-2 transition-colors ${activeTab === 'spirits' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        {lang === 'en' ? 'Spirits' : '주류 관리'}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`text-lg font-black pb-2 border-b-2 transition-colors ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        {lang === 'en' ? 'Requests' : '정보 수정 요청'}
                    </button>
                    <button
                        onClick={() => setActiveTab('discovery')}
                        className={`text-lg font-black pb-2 border-b-2 transition-colors ${activeTab === 'discovery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        {lang === 'en' ? 'AI Logs' : 'AI 발굴 로그'}
                    </button>
                </div>

                {activeTab === 'spirits' ? (
                    <>
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
                                        placeholder={isEn ? "Search products..." : "제품명 검색..."}
                                        className="px-3 py-2 rounded-lg text-xs font-black border border-border bg-background"
                                        value={localSearchQuery}
                                        onChange={e => setLocalSearchQuery(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handleApplyFilters}
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95"
                                    >
                                        🔍 {isEn ? 'Apply Filters' : '필터 적용'}
                                    </button>

                                    <button
                                        disabled={isProcessing}
                                        onClick={async () => {
                                            if (!confirm('최신 글로벌 주류 뉴스를 수집하시겠습니까?')) return;
                                            setIsProcessing(true);
                                            try {
                                                // Client-orchestrated News Collection
                                                const existingNews = await dbListNewsArticles(200, 0);
                                                const existingLinks = existingNews.map(n => n.link);

                                                const res = await fetch('/api/admin/news/collect', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ existingLinks })
                                                });
                                                if (!res.ok) {
                                                    const errorData = await res.json().catch(() => ({}));
                                                    console.group('❌ News Collection Failed');
                                                    console.error('Status:', res.status);
                                                    console.table(errorData);
                                                    console.groupEnd();
                                                    throw new Error(errorData.error || `HTTP ${res.status}`);
                                                }
                                                const data = await res.json();

                                                if (data.success) {
                                                    const count = Number(data.insertedCount || 0);
                                                    if (count > 0) {
                                                        alert(`✅ 뉴스 수집 완료! (${count}건 처리됨)`);
                                                    } else {
                                                        alert(`✅ 최신 뉴스가 없습니다. (이미 최신 상태)`);
                                                    }
                                                } else {
                                                    alert(`❌ 실패: ${data.error || '알 수 없는 오류'}`);
                                                }
                                            } catch (e: any) {
                                                console.error('Collection process error:', e);
                                                alert(`뉴스 수집 중 에러: ${e.message}`);
                                            } finally {
                                                setIsProcessing(false);
                                            }
                                        }}
                                        className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-accent/20 disabled:opacity-30 hover:brightness-110 active:scale-95"
                                    >
                                        📰 {lang === 'en' ? 'Collect News' : '뉴스 수집'}
                                    </button>

                                    <button
                                        onClick={startCreate}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95"
                                    >
                                        ➕ {lang === 'en' ? 'Register Product' : '새 제품 등록'}
                                    </button>
                                </div>

                                {/* Count */}
                                <div className="text-[10px] font-black text-foreground/40 pt-4 border-t border-border flex items-baseline gap-1.5 uppercase tracking-widest">
                                    {isEn ? 'Total' : '총'} <span className="text-primary text-base font-black">{totalCount.toLocaleString()}</span> {isEn ? 'Items' : '건'}
                                    <span className="opacity-50">({isEn ? 'Current Page' : '현재 페이지'}: {spirits.length})</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                    <thead className="bg-muted text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="p-3 md:p-4 font-black uppercase tracking-wider text-[10px]">{lang === 'en' ? 'Product' : '주류 정보'}</th>
                                            <th className="p-3 md:p-4 font-black uppercase tracking-wider text-[10px]">{lang === 'en' ? 'Status' : '상태'}</th>
                                            <th className="p-3 md:p-4 hidden sm:table-cell font-black uppercase tracking-wider text-[10px]">{lang === 'en' ? 'Image' : '이미지'}</th>
                                            <th className="p-3 md:p-4 font-black uppercase tracking-wider text-[10px]">{lang === 'en' ? 'Actions' : '작업'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {spirits.map(spirit => (
                                            <tr key={spirit.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="p-3 md:p-4">
                                                    <div className="font-black text-sm md:text-base max-w-[200px] md:max-w-[300px] truncate group-hover:text-primary transition-colors">
                                                        {spirit.name}
                                                    </div>
                                                    <div className="text-[10px] md:text-[11px] text-muted-foreground font-bold">
                                                        {spirit.distillery || '-'} | {spirit.abv}% | {spirit.category}
                                                    </div>
                                                </td>
                                                <td className="p-3 md:p-4">
                                                    <span className={`px-2 py-1 rounded text-[9px] md:text-[10px] font-black uppercase tracking-tighter ${spirit.isPublished
                                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                                        : 'bg-muted text-muted-foreground border border-border'
                                                        }`}>
                                                        {spirit.isPublished ? (lang === 'en' ? 'PUBLISHED' : 'PUBLISHED') : (lang === 'en' ? 'DRAFT' : '미발행')}
                                                    </span>
                                                </td>
                                                <td className="p-3 md:p-4 hidden sm:table-cell">
                                                    {spirit.imageUrl ? (
                                                        <img src={getOptimizedImageUrl(spirit.imageUrl, 80)}
                                                            className="w-8 h-8 md:w-10 md:h-10 object-contain bg-white rounded-lg border border-border shadow-sm group-hover:scale-110 transition-transform"
                                                            alt="Bottle" />
                                                    ) : (
                                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-lg border border-dashed border-border" />
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
                    </>
                ) : activeTab === 'requests' ? (
                    <div className="bg-card border border-border rounded-[32px] p-6 md:p-10 shadow-2xl shadow-primary/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <span className="text-xl">📩</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{isEn ? 'Modification Requests' : '정보 수정 요청'}</h3>
                                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{isEn ? 'Review and update spirit data' : '사용자가 제보한 정보를 검토하세요'}</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] border-b border-border">
                                    <tr>
                                        <th className="p-4 md:p-6">{isEn ? 'SPIRIT' : '대상 주류'}</th>
                                        <th className="p-4 md:p-6">{isEn ? 'CONTENT' : '요청 내용'}</th>
                                        <th className="p-4 md:p-6 text-center">{isEn ? 'STATUS' : '처리 상태'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {requests.map(req => (
                                        <tr key={req.id} className="hover:bg-primary/5 transition-all group">
                                            <td className="p-4 md:p-6 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <a href={`/${lang}/spirits/${req.spiritId}`} target="_blank" className="font-black text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2">
                                                        {req.spiritName}
                                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                                    </a>
                                                    <span className="text-[10px] text-foreground/30 font-black tracking-tighter">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-6 align-top max-w-md">
                                                <div className="font-bold text-sm mb-1.5">{req.title}</div>
                                                <p className="text-xs text-foreground/60 leading-relaxed whitespace-pre-wrap bg-muted/30 p-3 rounded-xl border border-border/50">{req.content}</p>
                                            </td>
                                            <td className="p-4 md:p-6 align-top">
                                                <div className="flex flex-col gap-2 min-w-[120px]">
                                                    <button
                                                        onClick={() => updateRequestStatus(req.id, 'pending')}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${req.status === 'pending' ? 'bg-amber-500 text-black border-amber-600 shadow-lg shadow-amber-500/20' : 'bg-transparent text-foreground/40 border-border hover:border-border-hover'}`}
                                                    >{isEn ? 'Pending' : '대기중'}</button>
                                                    <button
                                                        onClick={() => updateRequestStatus(req.id, 'checked')}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${req.status === 'checked' ? 'bg-secondary text-secondary-foreground border-secondary shadow-lg shadow-secondary/20' : 'bg-transparent text-foreground/40 border-border hover:border-border-hover'}`}
                                                    >{isEn ? 'Checked' : '확인됨'}</button>
                                                    <button
                                                        onClick={() => updateRequestStatus(req.id, 'resolved')}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${req.status === 'resolved' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-foreground/40 border-border hover:border-border-hover'}`}
                                                    >{isEn ? 'Resolved' : '완료'}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={3} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="text-4xl opacity-20">🍃</span>
                                                    <p className="text-xs text-foreground/40 font-black uppercase tracking-widest">{isEn ? 'No modification requests found' : '접수된 정보 수정 요청이 없습니다'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Discovery Logs View */
                    <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
                        <DiscoveryLogsTable />
                    </div>
                )}
            </div>

            {/* Edit / Create Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-2 md:p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-black w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl border p-4 md:p-8 my-4 md:my-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{isCreating ? (isEn ? 'New Product' : '새 제품 등록') : (isEn ? 'Edit Product' : '제품 편집')}</h2>
                                <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-1.5">
                                    {isCreating ? (isEn ? 'ID will be auto-generated' : 'ID는 저장 시 자동 생성됩니다') : `Product ID: ${editingId}`}
                                </p>
                            </div>
                            <button
                                onClick={() => { setEditingId(null); setIsCreating(false); }}
                                className="p-3 rounded-2xl hover:bg-muted text-foreground/60 transition-all active:scale-90"
                            >
                                <span className="text-2xl">✕</span>
                            </button>
                        </div>

                        {/* AI Generate Button (edit mode only) */}
                        {!isCreating && (
                        <button
                            disabled={isProcessing}
                            onClick={generateAIData}
                            className="w-full mb-6 px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
                        >
                            ✨ {isProcessing ? 'AI 생성 중...' : 'AI 데이터 생성 (영문명, 설명, 페어링 가이드)'}
                        </button>
                        )}

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
                                            value={editForm.nameEn}
                                            onChange={e => setEditForm({ ...editForm, nameEn: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                        <label className="text-[10px] font-black uppercase text-gray-400">메인 카테고리</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.mainCategory}
                                            onChange={e => setEditForm({ ...editForm, mainCategory: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">카테고리 (EN)</label>
                                        <input
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.categoryEn}
                                            onChange={e => setEditForm({ ...editForm, categoryEn: e.target.value })}
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
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400">용량 (ml)</label>
                                        <input
                                            type="number"
                                            className="w-full mt-1 px-3 py-2 border rounded-xl bg-white dark:bg-black font-bold text-sm"
                                            value={editForm.volume}
                                            onChange={e => setEditForm({ ...editForm, volume: Number(e.target.value) || 0 })}
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
                                    <label className="text-[10px] font-black uppercase text-gray-400">테이스팅 노트</label>
                                    <textarea
                                        rows={2}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.tastingNote}
                                        onChange={e => setEditForm({ ...editForm, tastingNote: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Nose (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.noseTags}
                                        onChange={e => setEditForm({ ...editForm, noseTags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Palate (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.palateTags}
                                        onChange={e => setEditForm({ ...editForm, palateTags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Finish (,로 구분)</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.finishTags}
                                        onChange={e => setEditForm({ ...editForm, finishTags: e.target.value })}
                                    />
                                </div>
                            </section>

                            {/* Descriptions */}
                            <section className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">설명</h3>
                                    <button
                                        disabled={isProcessing}
                                        onClick={generateDescriptionOnly}
                                        className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 disabled:opacity-30"
                                    >
                                        ✨ 설명만 생성 (현재 정보 기반)
                                    </button>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">한글 설명</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.descriptionKo}
                                        onChange={e => setEditForm({ ...editForm, descriptionKo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">영문 설명</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.descriptionEn}
                                        onChange={e => setEditForm({ ...editForm, descriptionEn: e.target.value })}
                                    />
                                </div>
                            </section>

                            {/* Pairing Guide */}
                            <section className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg inline-block">페어링 가이드</h3>
                                    <button
                                        disabled={isProcessing}
                                        onClick={generatePairingOnly}
                                        className="text-[10px] font-black bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-500 disabled:opacity-30"
                                    >
                                        ✨ 페어링만 생성 (현재 정보 기반)
                                    </button>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">한글</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.pairingGuideKo}
                                        onChange={e => setEditForm({ ...editForm, pairingGuideKo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">영문</label>
                                    <textarea
                                        rows={3}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm"
                                        value={editForm.pairingGuideEn}
                                        onChange={e => setEditForm({ ...editForm, pairingGuideEn: e.target.value })}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-border">
                            <button
                                disabled={isProcessing}
                                onClick={() => { setEditingId(null); setIsCreating(false); }}
                                className="flex-1 px-6 py-4 bg-muted text-foreground font-black rounded-2xl hover:bg-muted/80 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isEn ? 'Cancel' : '취소'}
                            </button>
                            {isCreating ? (
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => createSpirit(false)}
                                        className="flex-1 px-6 py-4 bg-background border border-border text-foreground font-black rounded-2xl hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isProcessing ? (isEn ? 'Saving...' : '등록 중...') : `💾 ${isEn ? 'Save Only' : '등록만'}`}
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => createSpirit(true)}
                                        className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isProcessing ? (isEn ? 'Processing...' : '처리 중...') : `✨ ${isEn ? 'Save & Publish' : '등록 및 발행'}`}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => saveEdit(false)}
                                        className="flex-1 px-6 py-4 bg-background border border-border text-foreground font-black rounded-2xl hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isProcessing ? (isEn ? 'Saving...' : '저장 중...') : `💾 ${isEn ? 'Save Only' : '저장만'}`}
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => saveEdit(true)}
                                        className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isProcessing ? (isEn ? 'Processing...' : '처리 중...') : `✨ ${isEn ? 'Save & Publish' : '저장 및 발행'}`}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
