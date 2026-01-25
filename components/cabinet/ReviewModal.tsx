'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import { TAG_COLORS, TagColorVariant, getTagColor } from "@/lib/constants/tag-colors";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import SPIRITS_METADATA from "@/lib/constants/spirits-metadata.json";

interface ReviewModalProps {
    spirit: Spirit;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (review: UserReview) => void;
}

type TagCategory = 'nose' | 'palate' | 'finish';

// Helper to access metadata safely
const getMetadataTags = (category: TagCategory) => {
    return SPIRITS_METADATA.tag_index[category] as Record<string, { color: string, tags: string[] }>;
};

export default function ReviewModal({ spirit, isOpen, onClose, onSubmit }: ReviewModalProps) {
    // Ratings
    const [ratingN, setRatingN] = useState(spirit.userReview?.ratingN || 3.0);
    const [ratingP, setRatingP] = useState(spirit.userReview?.ratingP || 3.0);
    const [ratingF, setRatingF] = useState(spirit.userReview?.ratingF || 3.0);

    // Content
    const [comment, setComment] = useState(spirit.userReview?.comment || "");

    // Tags (Split by N/P/F)
    const [tagsN, setTagsN] = useState<string[]>([]);
    const [tagsP, setTagsP] = useState<string[]>([]);
    const [tagsF, setTagsF] = useState<string[]>([]);

    // Initialize state
    useEffect(() => {
        if (isOpen) {
            if (spirit.userReview) {
                setTagsN(spirit.userReview.tagsN || []);
                setTagsP(spirit.userReview.tagsP || []);
                setTagsF(spirit.userReview.tagsF || []);
            } else {
                // Reset or load defaults if needed
                setTagsN([]);
                setTagsP([]);
                setTagsF([]);
            }
        }
    }, [isOpen, spirit]);

    const ratingOverall = parseFloat(((ratingN + ratingP + ratingF) / 3).toFixed(1));

    const handleSubmit = () => {
        const review: UserReview = {
            ratingN,
            ratingP,
            ratingF,
            ratingOverall,
            comment,
            tagsN,
            tagsP,
            tagsF,
            createdAt: new Date().toISOString()
        };
        onSubmit(review);
        onClose();
    };

    const StarRating = ({ value, onChange, label, colorClass }: { value: number, onChange: (v: number) => void, label: string, colorClass: string }) => {
        return (
            <div className="flex items-center gap-4">
                <span className={`w-14 font-bold text-sm ${colorClass}`}>{label}</span>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => onChange(star)}
                            className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${value >= star ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-500">{value.toFixed(1)}</span>
                </div>
            </div>
        );
    };

    const TagMultiSelect = ({
        category,
        selectedTags,
        onChange
    }: {
        category: TagCategory,
        selectedTags: string[],
        onChange: (tags: string[]) => void
    }) => {
        const metadata = getMetadataTags(category);
        const [customTag, setCustomTag] = useState("");

        const toggleTag = (tag: string) => {
            if (selectedTags.includes(tag)) {
                onChange(selectedTags.filter(t => t !== tag));
            } else {
                onChange([...selectedTags, tag]);
            }
        };

        const addCustomTag = (e: React.FormEvent) => {
            e.preventDefault();
            if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
                onChange([...selectedTags, customTag.trim()]);
                setCustomTag("");
            }
        };

        return (
            <div className="space-y-3">
                {/* Preset Tags from Metadata */}
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1 border border-gray-100 dark:border-gray-800 rounded-lg">
                    {Object.entries(metadata).map(([subKey, info]) => {
                        const colorKey = info.color as TagColorVariant;
                        const colors = TAG_COLORS[colorKey] || TAG_COLORS.stone;

                        return info.tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`
                     text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all
                     ${isSelected
                                            ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-amber-500/50 font-bold`
                                            : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
                   `}
                                >
                                    {tag}
                                </button>
                            );
                        });
                    })}
                </div>

                {/* Selected Tags Display & Custom Input */}
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map(tag => {
                                const color = getTagColor(tag);
                                return (
                                    <span key={tag} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${color.bg} ${color.text} ${color.border}`}>
                                        {tag}
                                        <button onClick={() => toggleTag(tag)} className="hover:opacity-70">×</button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    <form onSubmit={addCustomTag} className="flex-1 min-w-[120px]">
                        <input
                            type="text"
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="+ 직접 입력"
                            className="w-full px-3 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-amber-500"
                        />
                    </form>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-white">
                            <img
                                src={spirit.imageUrl || getCategoryFallbackImage(spirit.category)}
                                alt={spirit.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getCategoryFallbackImage(spirit.category);
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{spirit.name}</h2>
                            <p className="text-xs text-gray-500 mt-1">{spirit.category} • ABV {spirit.abv}%</p>
                        </div>
                    </div>

                    {/* Body - Scrollable */}
                    <div className="p-4 sm:p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                        {/* Nose Section */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="text-lg">👃</span> Aroma (향)
                                </h3>
                                <StarRating label="" value={ratingN} onChange={setRatingN} colorClass="text-amber-500" />
                            </div>
                            <TagMultiSelect category="nose" selectedTags={tagsN} onChange={setTagsN} />
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 opacity-50" />

                        {/* Palate Section */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="text-lg">👅</span> Taste (맛)
                                </h3>
                                <StarRating label="" value={ratingP} onChange={setRatingP} colorClass="text-orange-500" />
                            </div>
                            <TagMultiSelect category="palate" selectedTags={tagsP} onChange={setTagsP} />
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 opacity-50" />

                        {/* Finish Section */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="text-lg">🏁</span> Finish (여운)
                                </h3>
                                <StarRating label="" value={ratingF} onChange={setRatingF} colorClass="text-blue-500" />
                            </div>
                            <TagMultiSelect category="finish" selectedTags={tagsF} onChange={setTagsF} />
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 opacity-50" />

                        {/* Comment */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📝 총평</h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="전체적인 감상평을 남겨주세요."
                                className="w-full h-24 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 shrink-0 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Average Rating</span>
                            <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                                ★ {ratingOverall.toFixed(1)}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
