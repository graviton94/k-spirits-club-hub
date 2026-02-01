import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spirit } from "@/lib/db/schema";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet } from "@/app/actions/cabinet";
import { Plus, Bookmark, Loader2 } from "lucide-react";
import SuccessToast from "@/components/ui/SuccessToast";

interface SearchSpiritModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    existingIds: Set<string>;
}

export default function SearchSpiritModal({ isOpen, onClose, onSuccess, existingIds }: SearchSpiritModalProps) {
    const [query, setQuery] = useState("");
    const { searchSpirits, isLoading } = useSpiritsCache();
    const { user } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    // Get results from cache
    const results = query.trim() ? searchSpirits(query) : [];

    const handleAdd = async (item: any, isWishlist: boolean) => {
        if (!user) {
            setToastMessage('로그인이 필요합니다.');
            setToastVariant('error');
            setShowToast(true);
            return;
        }

        setProcessingId(item.i);
        try {
            await addToCabinet(user.uid, item.i, {
                isWishlist: isWishlist,
                name: item.n,
                distillery: item.d || undefined,
                imageUrl: item.t || undefined,
                category: item.c,
                // abv: item.a 
            });
            onSuccess(isWishlist ? "위시리스트에 담겼습니다! 🔖" : "성공적으로 술장에 담겼습니다! 🥃");
        } catch (e) {
            console.error(e);
            setToastMessage('오류가 발생했습니다.');
            setToastVariant('error');
            setShowToast(true);
        } finally {
            setProcessingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-slate-950 border border-white/10 w-full max-w-xl rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header bg glow */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

                    <div className="p-6 sm:p-8 border-b border-white/5 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">콜렉션 추가</h2>
                                <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Search & Add to Cabinet</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                autoFocus
                                placeholder="어떤 술을 찾고 계신가요?"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-lg"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-2 relative z-10 min-h-[300px]">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                                <p className="font-bold text-sm">데이터를 불러오는 중입니다...</p>
                            </div>
                        )}
                        {!isLoading && results.length === 0 && query && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="font-bold">검색 결과가 없습니다.</p>
                            </div>
                        )}
                        {!isLoading && !query && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                                <p className="text-4xl mb-4">🥃</p>
                                <p className="font-bold">제품명을 정확하게 입력해보세요.</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {results.map(item => {
                                const isAdded = existingIds.has(item.i);
                                const isProcessing = processingId === item.i;

                                return (
                                    <motion.div
                                        layout
                                        key={item.i}
                                        className="flex items-center gap-3 p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                                            <img
                                                src={getOptimizedImageUrl((item.t && item.t.trim()) ? item.t : getCategoryFallbackImage(item.c), 120)}
                                                alt={item.n}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = getCategoryFallbackImage(item.c);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="font-black text-sm text-white leading-tight line-clamp-2 whitespace-normal">{item.n}</div>
                                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 whitespace-normal mt-0.5">
                                                {item.c} {item.d ? `| ${item.d}` : ''}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {isAdded ? (
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">In</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={() => handleAdd(item, false)}
                                                        className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all shadow-lg shadow-amber-500/20 active:scale-90 disabled:opacity-50"
                                                        title="술장에 추가"
                                                    >
                                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={() => handleAdd(item, true)}
                                                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all border border-white/10 active:scale-90 disabled:opacity-50"
                                                        title="위시리스트"
                                                    >
                                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                variant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </AnimatePresence>
    );
}
