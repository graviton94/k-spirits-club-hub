'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spirit } from "@/lib/db/schema";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";

interface SearchSpiritModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (spirit: Spirit) => void;
    existingIds: Set<string>;
}

export default function SearchSpiritModal({ isOpen, onClose, onAdd, existingIds }: SearchSpiritModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Spirit[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                // Using admin API for now as it supports search
                const res = await fetch(`/api/admin/spirits?search=${encodeURIComponent(query)}&pageSize=20`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.data || []);
                }
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

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
                        {loading && <div className="p-8 text-center text-muted-foreground">검색 중... 🥃</div>}
                        {!loading && results.length === 0 && query && (
                            <div className="p-8 text-center text-muted-foreground">검색 결과가 없습니다.</div>
                        )}

                        <div className="space-y-1">
                            {results.map(spirit => {
                                const isAdded = existingIds.has(spirit.id);
                                return (
                                    <div key={spirit.id} className="flex items-center gap-3 p-3 hover:bg-secondary rounded-xl transition-colors">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                                            <img
                                                src={(spirit.imageUrl && spirit.imageUrl.trim()) ? spirit.imageUrl : getCategoryFallbackImage(spirit.category)}
                                                alt={spirit.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = getCategoryFallbackImage(spirit.category);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate text-foreground">{spirit.name}</div>
                                            <div className="text-xs text-muted-foreground">{spirit.category} • {spirit.abv}%</div>
                                        </div>
                                        <button
                                            disabled={isAdded}
                                            onClick={() => {
                                                onAdd(spirit);
                                                onClose();
                                            }}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${isAdded
                                                    ? 'bg-muted text-muted-foreground cursor-not-allowed border-border'
                                                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border-transparent'
                                                }`}
                                        >
                                            {isAdded ? '보유중' : '추가'}
                                        </button>
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
