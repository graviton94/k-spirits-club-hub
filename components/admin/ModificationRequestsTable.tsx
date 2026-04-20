// components/admin/ModificationRequestsTable.tsx

'use client';

import { useState, useEffect } from 'react';
import { dbListModificationRequests, dbUpsertModificationRequest } from '@/lib/db/data-connect-client';
import { ModificationRequest } from '@/lib/db/schema';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  User,
  MessageSquare
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function ModificationRequestsTable() {
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await dbListModificationRequests();
      setRequests(data as any as ModificationRequest[]);
    } catch (error) {
      console.error('Failed to load modification requests:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(request: ModificationRequest, status: 'pending' | 'checked' | 'resolved') {
    try {
      // Data Connect upsert works by providing the ID and fields to update
      await dbUpsertModificationRequest({
        ...request,
        status
      });
      setRequests(prev => prev.map(r => r.id === request.id ? { ...r, status } : r));
    } catch (error) {
      console.error('Status update failed:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  }

  const getStatusBadge = (status: ModificationRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock size={12} /> 대기 중
          </span>
        );
      case 'checked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <AlertCircle size={12} /> 확인 중
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> 처리 완료
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">수정 요청 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold text-muted-foreground">접수된 수정 요청이 없습니다.</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">유저들이 보내는 피드백이 여기에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-widest text-muted-foreground font-black">
            <th className="py-4 px-4">대상 및 요청자</th>
            <th className="py-4 px-4">요청 내용</th>
            <th className="py-4 px-4 text-center">상태</th>
            <th className="py-4 px-4 text-right">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.map((request) => (
            <tr key={request.id} className="group hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 align-top">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 group/link">
                    <span className="text-sm font-bold text-foreground">{request.spiritName}</span>
                    <Link 
                      href={`/spirits/${request.spiritId}`} 
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <User size={12} />
                    <span>{request.userId || '익명 사용자'}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/60">
                    {format(new Date(request.createdAt), 'yyyy. MM. dd. HH:mm', { locale: ko })}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 align-top">
                <div className="space-y-1 max-w-md">
                  <p className="text-xs font-bold text-foreground">[{request.title}]</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {request.content}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4 text-center align-middle">
                {getStatusBadge(request.status)}
              </td>
              <td className="py-4 px-4 text-right align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <div className="px-2 py-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
                      상태 변경
                    </div>
                    <DropdownMenuItem 
                      onClick={() => handleStatusUpdate(request, 'pending')}
                      className="text-xs font-medium flex items-center gap-2"
                    >
                      <Clock size={14} className="text-amber-500" /> 대기 중
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusUpdate(request, 'checked')}
                      className="text-xs font-medium flex items-center gap-2"
                    >
                      <AlertCircle size={14} className="text-blue-500" /> 확인 중
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusUpdate(request, 'resolved')}
                      className="text-xs font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-emerald-500" /> 처리 완료
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
