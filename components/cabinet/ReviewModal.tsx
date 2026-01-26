'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import { TAG_COLORS, TagColorVariant, getTagColor, TAG_COLOR_MAPPING } from "@/lib/constants/tag-colors";
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
    return SPIRITS_METADATA.tag_index[category] as Record<string, { colors: any, tags: string[] }>;
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
                            className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${value >= star ? 'text-primary' : 'text-muted-foreground/25'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold text-muted-foreground">{value.toFixed(1)}</span>
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
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1 border-2 border-border rounded-lg bg-card">
                    {Object.entries(metadata).map(([subKey, info]) => {
                        const colorKey = (TAG_COLOR_MAPPING as any)[subKey] || 'stone';
                        const colors = TAG_COLORS[colorKey as TagColorVariant] || TAG_COLORS.stone;

                        return info.tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`
                     text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all
                     ${isSelected
                                            ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-primary/50 font-bold`
                                            : 'bg-card text-muted-foreground border-border hover:bg-secondary'}
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
                            className="w-full px-3 py-1 text-xs rounded-md border-2 border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
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
                    className="bg-background border-2 border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 sm:p-6 bg-secondary border-b border-border flex items-center gap-4 shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-muted border border-border">
                            <img
                                src={(spirit.imageUrl && spirit.imageUrl.trim()) ? spirit.imageUrl : getCategoryFallbackImage(spirit.category)}
                                alt={spirit.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getCategoryFallbackImage(spirit.category);
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground leading-tight">{spirit.name}</h2>
                            <p className="text-xs text-muted-foreground mt-1">{spirit.category} • ABV {spirit.abv}%</p>
                        </div>
                    </div>

                    {/* Body - Scrollable */}
                    <div className="p-4 sm:p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                        {/* Nose Section */}
                        <div className="space-y-3">
                            <div className="p-3 sm:p-4 bg-secondary/50 rounded-xl border border-border">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                        <span className="text-lg">👃</span> Aroma (향)
                                    </h3>
                                    <StarRating label="" value={ratingN} onChange={setRatingN} colorClass="text-primary" />
                                </div>
                            </div>
                            <TagMultiSelect category="nose" selectedTags={tagsN} onChange={setTagsN} />
                        </div>

                        <div className="h-px bg-border opacity-50" />

                        {/* Palate Section */}
                        <div className="space-y-3">
                            <div className="p-3 sm:p-4 bg-secondary/50 rounded-xl border border-border">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                        <span className="text-lg">👅</span> Taste (맛)
                                    </h3>
                                    <StarRating label="" value={ratingP} onChange={setRatingP} colorClass="text-primary" />
                                </div>
                            </div>
                            <TagMultiSelect category="palate" selectedTags={tagsP} onChange={setTagsP} />
                        </div>

                        <div className="h-px bg-border opacity-50" />

                        {/* Finish Section */}
                        <div className="space-y-3">
                            <div className="p-3 sm:p-4 bg-secondary/50 rounded-xl border border-border">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                        <span className="text-lg">🏁</span> Finish (여운)
                                    </h3>
                                    <StarRating label="" value={ratingF} onChange={setRatingF} colorClass="text-primary" />
                                </div>
                            </div>
                            <TagMultiSelect category="finish" selectedTags={tagsF} onChange={setTagsF} />
                        </div>

                        <div className="h-px bg-border opacity-50" />

                        {/* Comment */}
                        <div>
                            <h3 className="text-sm font-bold text-foreground mb-3">📝 총평</h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="전체적인 감상평을 남겨주세요."
                                className="w-full h-24 p-4 rounded-xl border-2 border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="p-4 sm:p-6 bg-secondary border-t border-border shrink-0 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Average Rating</span>
                            <div className="text-2xl font-black text-primary flex items-center gap-1">
                                ★ {ratingOverall.toFixed(1)}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-foreground hover:bg-muted transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/25 active:scale-95 transition-all"
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
