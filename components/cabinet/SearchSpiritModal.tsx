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
                    className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[80vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">새 술 추가하기</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
                        </div>
                        <input
                            autoFocus
                            placeholder="찾으시는 술 이름을 입력하세요..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:ring-2 focus:ring-amber-500 outline-none"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {loading && <div className="p-8 text-center text-gray-500">검색 중... 🥃</div>}
                        {!loading && results.length === 0 && query && (
                            <div className="p-8 text-center text-gray-500">검색 결과가 없습니다.</div>
                        )}

                        <div className="space-y-1">
                            {results.map(spirit => {
                                const isAdded = existingIds.has(spirit.id);
                                return (
                                    <div key={spirit.id} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                                            <img
                                                src={spirit.imageUrl || getCategoryFallbackImage(spirit.category)}
                                                alt={spirit.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = getCategoryFallbackImage(spirit.category);
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{spirit.name}</div>
                                            <div className="text-xs text-gray-500">{spirit.category} • {spirit.abv}%</div>
                                        </div>
                                        <button
                                            disabled={isAdded}
                                            onClick={() => {
                                                onAdd(spirit);
                                                onClose();
                                            }}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${isAdded
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
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
