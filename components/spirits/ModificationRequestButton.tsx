'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Send, CheckCircle2 } from 'lucide-react';
import { submitModificationRequest } from '@/lib/actions/modification-actions';
import { useAuth } from '@/app/[lang]/context/auth-context';

interface ModificationRequestButtonProps {
    spiritId: string;
    spiritName: string;
}

export default function ModificationRequestButton({ spiritId, spiritName }: ModificationRequestButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            await submitModificationRequest({
                spiritId,
                spiritName,
                title,
                content,
                userId: user?.uid || null
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
                setTitle('');
                setContent('');
            }, 2000);
        } catch (error) {
            alert(error instanceof Error ? error.message : "제출에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted border border-border dark:border-border rounded-lg transition-all text-xs font-bold shadow-sm"
            >
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                정보 오류 신고 / 수정 요청
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground"
                        >
                            {isSuccess ? (
                                <div className="p-12 flex flex-col items-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">소중한 의견 감사합니다🙇</h3>
                                    <p className="text-muted-foreground text-sm">신속히 검토 후 반영하겠습니다!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-7 space-y-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-primary" />
                                            <h3 className="font-bold text-xl text-foreground">정보 수정 요청</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="p-1.5 hover:bg-muted rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest block mb-1">대상 품목</span>
                                        <span className="text-sm font-bold text-foreground">{spiritName}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">문의 제목</label>
                                            <input
                                                autoFocus
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="예: 도수 표기가 잘못되었습니다."
                                                className="w-full bg-input border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">상세 내용</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="잘못된 정보와 올바른 정보(출처 등)를 적어주세요."
                                                className="w-full bg-input border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting || !title.trim() || !content.trim()}
                                        className="w-full h-13 bg-primary hover:brightness-110 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground font-black rounded-xl transition-all flex items-center justify-center gap-2 mt-2 py-3.5"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" /> 제보하기
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
