import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spirit } from "@/lib/db/schema";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet } from "@/app/actions/cabinet";
import { Plus, Bookmark, Loader2 } from "lucide-react";

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

    // Get results from cache
    const results = query.trim() ? searchSpirits(query) : [];

    const handleAdd = async (item: any, isWishlist: boolean) => {
        if (!user) {
            alert('로그인이 필요합니다.');
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
            alert('오류가 발생했습니다.');
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
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="bg-background border-2 border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-border bg-secondary">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-foreground">새 술 추가하기</h2>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <input
                            autoFocus
                            placeholder="찾으시는 술 이름을 입력하세요..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:ring-offset-2 outline-none"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {isLoading && <div className="p-8 text-center text-muted-foreground">데이터 로딩 중... 🥃</div>}
                        {!isLoading && results.length === 0 && query && (
                            <div className="p-8 text-center text-muted-foreground">검색 결과가 없습니다.</div>
                        )}
                        {!isLoading && !query && (
                            <div className="p-8 text-center text-muted-foreground">술 이름을 입력하여 검색하세요.</div>
                        )}

                        <div className="space-y-1">
                            {results.map(item => {
                                const isAdded = existingIds.has(item.i);
                                const isProcessing = processingId === item.i;

                                return (
                                    <div key={item.i} className="flex items-center gap-3 p-3 hover:bg-secondary rounded-xl transition-colors group">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                                            <img
                                                src={(item.t && item.t.trim()) ? item.t : getCategoryFallbackImage(item.c)}
                                                alt={item.n}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = getCategoryFallbackImage(item.c);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate text-foreground">{item.n}</div>
                                            <div className="text-xs text-muted-foreground">{item.c} {item.d ? `• ${item.d}` : ''}</div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {isAdded ? (
                                                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">보유중</span>
                                            ) : (
                                                <>
                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={() => handleAdd(item, false)}
                                                        className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-500 transition-colors"
                                                        title="술장에 담기"
                                                    >
                                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={() => handleAdd(item, true)}
                                                        className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-500 transition-colors"
                                                        title="위시리스트 담기"
                                                    >
                                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
