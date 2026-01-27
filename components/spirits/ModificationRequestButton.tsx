'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Send, CheckCircle2 } from 'lucide-react';
import { submitModificationRequest } from '@/lib/actions/modification-actions';
import { useAuth } from '@/app/context/auth-context';

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
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-all text-xs font-bold shadow-sm"
            >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
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
                            className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white"
                        >
                            {isSuccess ? (
                                <div className="p-12 flex flex-col items-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">소중한 의견 감사합니다🙇</h3>
                                    <p className="text-neutral-400 text-sm">신속히 검토 후 반영하겠습니다!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-7 space-y-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-amber-500" />
                                            <h3 className="font-bold text-xl text-white">정보 수정 요청</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="p-1.5 hover:bg-neutral-800 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-neutral-500" />
                                        </button>
                                    </div>

                                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-1">대상 품목</span>
                                        <span className="text-sm font-bold text-white">{spiritName}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-400 ml-1">문의 제목</label>
                                            <input
                                                autoFocus
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="예: 도수 표기가 잘못되었습니다."
                                                className="w-full bg-[#1e1e1e] border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-400 ml-1">상세 내용</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="잘못된 정보와 올바른 정보(출처 등)를 적어주세요."
                                                className="w-full bg-[#1e1e1e] border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting || !title.trim() || !content.trim()}
                                        className="w-full h-13 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 mt-2 py-3.5"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
