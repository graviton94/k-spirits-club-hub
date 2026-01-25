'use client';

import React, { useState } from 'react';

interface TagMultiSelectProps {
    label: string;
    availableTags: { [category: string]: { color: string, tags: string[] } };
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

const COLOR_MAP: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
    green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
    stone: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    lime: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-300 dark:border-lime-800',
    blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-800',
    teal: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800',
    orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
    pink: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800',
};

const DEFAULT_COLOR = 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';

export function TagMultiSelect({ label, availableTags, selectedTags, onChange }: TagMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter(t => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    // Helper to find color for a tag
    const getTagColorClass = (tag: string) => {
        for (const [_, data] of Object.entries(availableTags)) {
            if (data.tags.includes(tag)) {
                return COLOR_MAP[data.color] || DEFAULT_COLOR;
            }
        }
        return DEFAULT_COLOR;
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 block mb-1">{label}</label>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-amber-400/50 transition-colors shadow-sm"
                onClick={() => setIsOpen(!isOpen)}>
                {selectedTags.length > 0 ? (
                    selectedTags.map(tag => {
                        const colorClass = getTagColorClass(tag);
                        return (
                            <span key={tag} className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${colorClass}`}>
                                {tag}
                                <button type="button" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} className="ml-1.5 opacity-60 hover:opacity-100">×</button>
                            </span>
                        );
                    })
                ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 self-center px-1">태그를 선택하세요... (Click to expand)</span>
                )}
            </div>

            {/* Dropdown / Expandable Area */}
            {isOpen && (
                <div className="mt-2 p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl space-y-6 shadow-xl animate-in fade-in slide-in-from-top-2">
                    {Object.entries(availableTags).map(([categoryKey, data]) => {
                        const categoryColorClass = COLOR_MAP[data.color] || DEFAULT_COLOR;
                        // Strip border from header style to keep it clean, just use text color maybe?
                        // Or just use the map.

                        return (
                            <div key={categoryKey} className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800 pb-1 mb-2">
                                    {categoryKey.replace(/_/g, ' ')}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.tags.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        // For options, we use the category color but clearer
                                        // Unselected: faded version or gray? 
                                        // Let's use gray for unselected, and Colored for Selected.
                                        // OR: Colored outline for unselected, Solid for Selected?

                                        // Let's try: Unselected = Gray background, Hover = Color. Selected = Full Color.
                                        // But User wants "assigned color".

                                        // Better: Always show in its assigned color style, 
                                        // but if not selected, maybe lower opacity?
                                        // If selected, full opacity + ring.

                                        const baseColor = COLOR_MAP[data.color] || DEFAULT_COLOR;

                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${isSelected
                                                    ? `${baseColor} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-black ring-black/10 dark:ring-white/20`
                                                    : `bg-gray-50 dark:bg-zinc-900/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800`
                                                    }`}
                                            >
                                                {tag.split(' (')[0]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
