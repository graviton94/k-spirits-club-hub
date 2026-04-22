'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Sparkles, ChevronRight, Search, RefreshCcw } from 'lucide-react';
import { SpiritCard } from './SpiritCard';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
  analysis?: string;
  step?: number;
}

interface ChatSommelierProps {
  lang: string;
}

// Sommelier Profile Image Component
const AiProfile = () => (
  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-primary/10 border border-primary/20 flex items-center justify-center">
    <img
      src="/icons/user/user-3.webp"
      alt="Sommelier"
      className="w-full h-full object-cover"
    />
  </div>
);

// Large Header Sommelier Profile
const AiHeaderProfile = () => (
  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/20 border border-white/30 flex items-center justify-center">
    <img
      src="/icons/user/user-3.webp"
      alt="Sommelier"
      className="w-full h-full object-cover"
    />
  </div>
);

export default function ChatSommelier({ lang }: ChatSommelierProps) {
    const getLastAssistantMessage = () => {
      for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index]?.role === 'assistant') {
          return messages[index];
        }
      }
      return undefined;
    };

  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dnaProgress, setDnaProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEn = lang === 'en';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = isEn
        ? "Hello! I am your **K-Sommelier**. I will help you find your perfect spirit through a 5-step professional interview. Shall we start? What kind of spirits do you usually enjoy? (Whisky, Wine, etc.)"
        : "안녕하세요! 당신의 전용 **K-소믈리에**입니다. 5단계의 정밀 인터뷰를 통해 인생 주류를 찾아드릴게요. 시작해볼까요? 평소 어떤 종류의 술을 즐기시나요? (위스키, 와인, 전통주 등)";

      setMessages([{ role: 'assistant', content: initialGreeting, step: 1 }]);
    }
  }, [isOpen, messages.length, isEn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setIsError(false);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          })),
          lang,
          currentStep,
          userId: user?.uid || 'guest'
        })
      });

      const data = await response.json();

      if (response.status === 429) {
        throw new Error(data.message || (isEn ? 'Daily chat limit reached. Please try again tomorrow.' : '오늘의 채팅 한도에 도달했습니다. 내일 다시 시도해 주세요.'));
      }

      if (!response.ok || !data.message) {
        throw new Error(data.error || data.details || 'API Error');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        recommendations: data.recommendations,
        analysis: data.analysis,
        step: data.nextStep
      }]);

      setCurrentStep(data.nextStep);
      setDnaProgress(Math.min((data.nextStep - 1) * 20, 100));

    } catch (error: any) {
      console.error('Chat Error:', error);
      setIsError(true);
      const fallbackMsg = isEn ? "Sorry, something went wrong. Please try again." : "죄송합니다. 오류가 발생했어요. 다시 시도해 주세요.";
      setMessages(prev => [...prev, { role: 'assistant', content: error?.message || fallbackMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep(1);
    setDnaProgress(0);
    setInput('');
    setIsError(false);
  };

  const handleRecommendClick = (id: string) => {
    if (!id) return;
    setIsOpen(false);
    if (!user) {
      const loginUrl = `/${lang}/login?redirect=/${lang}/spirits/${id}`;
      router.push(loginUrl);
    } else {
      router.push(`/${lang}/spirits/${id}`);
    }
  };

  // Markdown Bold Parser with Styling
  const renderMessageContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${i}`} className="font-black text-primary underline underline-offset-2 decoration-primary/30">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return (
        <span key={`text-${i}`}>
          {part}
        </span>
      );
    });
  };

  // Only consider the session finished when step 6 was reached AND the last
  // assistant message actually carries recommendations. This prevents the UI
  // from locking up (showing only a restart button) when the AI declared step 6
  // but returned an empty recommendations array.
  const lastAssistantMsg = getLastAssistantMessage();
  const isFinished = currentStep === 6 && (lastAssistantMsg?.recommendations?.length ?? 0) > 0;

  // Only show on main page and spirits pages
  const isVisible = pathname !== null && (
    /^\/(ko|en)\/?$/.test(pathname) ||
    /^\/(ko|en)\/spirits(\/.*)?$/.test(pathname)
  );

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2 pr-2 pb-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="bg-amber-500 px-4 py-2 rounded-2xl rounded-br-none shadow-[0_8px_30px_rgba(245,158,11,0.3)] text-[11px] font-black text-white whitespace-nowrap mb-1 relative group pointer-events-none flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {isEn ? "Get Recommendation" : "제품추천 받기"}
              <div className="absolute -bottom-1 right-3 w-2.5 h-2.5 bg-amber-500 rotate-45" />
              <div className="absolute inset-0 rounded-2xl bg-amber-400 animate-pulse -z-10 opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="relative w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden border-4 border-white dark:border-slate-950"
          whileHover={{ y: -4 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={28} className="z-10" />
          ) : (
            <>
              <img 
                src="/icons/user/user-3.webp" 
                alt="Sommelier" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 w-full h-[75vh] md:bottom-28 md:right-6 md:left-auto md:w-[440px] md:h-[620px] bg-card/95 backdrop-blur-xl border border-border rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden bottom-nav-safe"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-white shrink-0 relative">
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AiHeaderProfile />
                    <div>
                      <h3 className="font-black text-lg">K-Sommelier</h3>
                      <p className="text-xs text-white/70 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {isEn ? 'Professional Profiling' : '전문 상담 중'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white/60">
                    <span>Master Taste DNA</span>
                    <span>{dnaProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-amber-300 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${dnaProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {messages.map((message, idx) => (
                  <div key={`msg-${idx}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`shrink-0 flex items-center justify-center`}>
                        {message.role === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <User size={16} />
                          </div>
                        ) : (
                          <AiProfile />
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${message.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-muted/50 border border-border rounded-tl-none'
                          }`}>
                          {renderMessageContent(message.content)}
                        </div>

                        {message.analysis && (
                          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            <Sparkles size={12} />
                            {message.analysis}
                          </div>
                        )}

                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="space-y-3 mt-4">
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                              {isEn ? 'Top Picks' : '오늘의 추천 리스트'}
                            </p>
                            {message.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} className="relative group">
                                {rec?.inDb ? (
                                  <>
                                    <SpiritCard
                                      spirit={rec}
                                      size="compact"
                                      index={rIdx}
                                      onClick={() => handleRecommendClick(rec.id)}
                                    />
                                    {!user && (
                                      <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => handleRecommendClick(rec.id)}>
                                        <div className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                          {isEn ? 'Sign up to unlock details' : '상세 정보 보러가기'}
                                          <ChevronRight size={12} />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-amber-100 rounded-lg">
                                          <Search size={14} className="text-amber-600" />
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-bold text-amber-900">{rec?.name || (isEn ? 'External recommendation' : '외부 추천')}</h4>
                                          <span className="text-[10px] text-amber-600 font-medium">Coming Soon / External</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <a
                                        href={rec?.googleSearchLink || `https://www.google.com/search?q=${encodeURIComponent(rec?.name || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-border rounded-xl text-[10px] font-bold hover:bg-muted transition-colors"
                                      >
                                        <Search size={10} /> Google
                                      </a>
                                      <a
                                        href={rec?.naverSearchLink || `https://search.naver.com/search.naver?query=${encodeURIComponent(rec?.name || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#03C75A] text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-opacity"
                                      >
                                        Naver
                                      </a>
                                    </div>
                                  </div>
                                )}

                                <div className="mt-2 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border italic leading-relaxed">
                                  {renderMessageContent(rec?.reason || '')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <AiProfile />
                      <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none animate-pulse flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input & Action Area */}
              <div className="p-4 border-t border-border bg-card">
                {isFinished || isError ? (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleRestart}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <RefreshCcw size={20} />
                    {isEn ? 'Start New Session' : '상담 새로 시작하기'}
                  </motion.button>
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={isEn ? "Tell me about your taste..." : "무엇이든 물어보세요..."}
                      className="w-full bg-muted border-none rounded-2xl py-4 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-center text-muted-foreground mt-3">
                  {isEn ? 'K-Sommelier analyzes curated spirits based on MFDS factual data.' : 'K-소메리에는 식약처 공인 팩트 데이터를 기반으로 분석합니다.'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
