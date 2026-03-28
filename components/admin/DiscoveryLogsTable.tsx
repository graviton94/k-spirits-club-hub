'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Database, Search, MessageSquare, User, X } from 'lucide-react';

export default function DiscoveryLogsTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/sommelier/logs?limit=100');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load discovery logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold text-sm">일시</th>
                <th className="p-4 font-semibold text-sm">사용자</th>
                <th className="p-4 font-semibold text-sm">취향 DNA</th>
                <th className="p-4 font-semibold text-sm">추천 결과</th>
                <th className="p-4 font-semibold text-sm text-center">동작</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                    {log.createdAt ? formatDate(log.createdAt) : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <User size={14} className="text-muted-foreground" />
                       <span className="text-xs font-mono">{log.userId?.slice(0, 8) || 'Guest'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {log.analysis?.split(' ').map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {log.recommendations?.map((rec: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          {rec.inDb ? (
                            <Database size={12} className="text-emerald-500" />
                          ) : (
                            <Search size={12} className="text-amber-500" />
                          )}
                          <span className={`text-xs ${rec.inDb ? 'font-medium' : 'text-amber-700'}`}>
                            {rec.name}
                          </span>
                          {!rec.inDb && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">Out-of-DB</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors"
                      title="대화 내역 보기"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="p-20 text-center text-muted-foreground">
            아직 수집된 상담 로그가 없습니다.
          </div>
        )}
      </div>

      {/* 대화 상세 모달 (Chat History Preview) */}
      {selectedLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                   상담 상세 내역
                </h3>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X size={24} />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedLog.messageHistory?.map((msg: any, i: number) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-muted border border-border'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
             </div>

             <div className="p-4 border-t border-border bg-muted/10">
                <div className="text-xs text-muted-foreground mb-2">AI 추천 분석 요약:</div>
                <div className="p-3 bg-card border border-border rounded-lg text-xs leading-relaxed italic">
                  {selectedLog.analysis}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
