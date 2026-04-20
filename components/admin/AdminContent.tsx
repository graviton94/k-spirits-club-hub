'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AdminSpiritCard from "@/components/admin/AdminSpiritCard";
import AdminStats from "@/components/admin/AdminStats";
import DiscoveryLogsTable from "@/components/admin/DiscoveryLogsTable";
import ModificationRequestsTable from "@/components/admin/ModificationRequestsTable";
import type { Spirit } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { dbListModificationRequests } from "@/lib/db/data-connect-client";
import { 
  Database, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Layers,
  Search
} from 'lucide-react';

type AdminTab = 'spirits' | 'modifications' | 'discovery';

export default function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tab & Filter States
  const activeTab = (searchParams.get('tab') as AdminTab) || 'spirits';
  const spiritsFilter = searchParams.get('filter') || 'unreviewed';
  const page = Number(searchParams.get('page')) || 1;

  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Badge Counts
  const [counts, setCounts] = useState({
    pendingReview: 0,
    pendingModifications: 0,
  });

  useEffect(() => {
    // Load Counts for Badges
    async function loadCounts() {
      const { total: pendingSpirits } = await db.getSpirits({ isReviewed: false }, { page: 1, pageSize: 1 });
      const mods = await dbListModificationRequests();
      const pendingMods = mods.filter((m: any) => m.status === 'pending').length;
      
      setCounts({
        pendingReview: pendingSpirits,
        pendingModifications: pendingMods
      });
    }
    loadCounts();
  }, [activeTab, spiritsFilter]);

  useEffect(() => {
    if (activeTab !== 'spirits') return;
    
    async function loadSpirits() {
      const { data, total: totalCount, totalPages: pages } = await db.getSpirits(
        {
          isPublished: spiritsFilter === 'published',
          isReviewed: spiritsFilter === 'unreviewed' ? false : undefined
        },
        { page, pageSize: 50 }
      );
      setSpirits(data);
      setTotal(totalCount);
      setTotalPages(pages);
    }
    loadSpirits();
  }, [activeTab, spiritsFilter, page]);

  const handleTabChange = (tab: AdminTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('page'); // Reset page on tab change
    if (tab !== 'spirits') params.delete('filter');
    router.push(`/admin?${params.toString()}`);
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    params.delete('page');
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">⚙️ 관리자 대시보드</h1>
          <p className="text-muted-foreground font-medium">K-Spirits 통합 데이터 및 서비스 관리</p>
        </div>
      </header>

      <AdminStats />

      {/* Main Tab Navigation */}
      <div className="flex border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        <TabButton 
          icon={<Database size={18} />} 
          label="주류 DB 관리" 
          active={activeTab === 'spirits'} 
          onClick={() => handleTabChange('spirits')}
          badge={counts.pendingReview > 0 ? counts.pendingReview : undefined}
        />
        <TabButton 
          icon={<MessageSquare size={18} />} 
          label="정보 수정 요청" 
          active={activeTab === 'modifications'} 
          onClick={() => handleTabChange('modifications')}
          badge={counts.pendingModifications > 0 ? counts.pendingModifications : undefined}
        />
        <TabButton 
          icon={<Sparkles size={18} />} 
          label="AI 발굴 로그" 
          active={activeTab === 'discovery'} 
          onClick={() => handleTabChange('discovery')}
        />
      </div>

      <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm min-h-[500px]">
        {/* Tab 1: Spirits Management */}
        {activeTab === 'spirits' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
              <h2 className="text-xl font-black flex items-center gap-2">
                📦 {spiritsFilter === 'unreviewed' ? '검수 대기 중' : spiritsFilter === 'published' ? '발행된 주류' : '모든 주류'} 
                <span className="text-sm font-bold text-muted-foreground ml-1">({total})</span>
              </h2>
              
              <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl">
                <FilterButtonSmall label="미검수" value="unreviewed" current={spiritsFilter} onClick={handleFilterChange} />
                <FilterButtonSmall label="발행됨" value="published" current={spiritsFilter} onClick={handleFilterChange} />
                <FilterButtonSmall label="전체" value="all" current={spiritsFilter} onClick={handleFilterChange} />
              </div>
            </div>

            <div className="space-y-4">
              {spirits.map((spirit) => (
                <AdminSpiritCard key={spirit.id} spirit={spirit} />
              ))}
            </div>

            {spirits.length === 0 && (
              <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                <p className="text-muted-foreground font-medium">해당하는 주류 데이터가 없습니다.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Pagination filter={spiritsFilter} current={page} total={totalPages} tab={activeTab} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Modification Requests */}
        {activeTab === 'modifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              📝 유저 수정 요청 관리
            </h2>
            <ModificationRequestsTable />
          </div>
        )}

        {/* Tab 3: AI Discovery Logs */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              💎 AI 소믈리에 발굴로그
            </h2>
            <DiscoveryLogsTable />
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick, badge }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-4 border-b-2 transition-all whitespace-nowrap relative min-w-[160px] justify-center ${
        active 
          ? "border-primary text-primary font-black bg-primary/5" 
          : "border-transparent text-muted-foreground hover:text-foreground font-bold hover:bg-muted/50"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {badge !== undefined && (
        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm animate-in zoom-in duration-300">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

function FilterButtonSmall({ label, value, current, onClick }: { 
  label: string; 
  value: string; 
  current: string; 
  onClick: (val: string) => void;
}) {
  const isActive = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        isActive
          ? "bg-white text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-white/50"
      }`}
    >
      {label}
    </button>
  );
}

function Pagination({ filter, current, total, tab }: { filter: string, current: number, total: number, tab: string }) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  return (
    <div className="flex gap-1">
      {current > 1 && <PageLink filter={filter} page={current - 1} label="Prev" tab={tab} />}
      {start > 1 && <span className="px-2 self-center">...</span>}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
        <PageLink key={p} filter={filter} page={p} label={p.toString()} active={p === current} tab={tab} />
      ))}
      {end < total && <span className="px-2 self-center">...</span>}
      {current < total && <PageLink filter={filter} page={current + 1} label="Next" tab={tab} />}
    </div>
  );
}

function PageLink({ filter, page, label, active, tab }: { filter: string, page: number, label: string, active?: boolean, tab: string }) {
  return (
    <a
      href={`/admin?tab=${tab}&filter=${filter}&page=${page}`}
      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
        active
          ? "bg-primary text-white border-primary shadow-lg scale-105"
          : "border-border hover:bg-secondary text-muted-foreground"
      }`}
    >
      {label}
    </a>
  );
}
