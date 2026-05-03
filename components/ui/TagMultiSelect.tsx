'use client';

import React, { useState } from 'react';

interface TagMultiSelectProps {
    label: string;
    availableTags: { [category: string]: { color: string, tags: string[] } };
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

const COLOR_MAP: Record<string, string> = {
    purple: 'bg-accent/10 text-accent border-accent/20',
    green: 'bg-primary/10 text-primary border-primary/20',
    red: 'bg-destructive/10 text-destructive border-destructive/20',
    yellow: 'bg-primary/10 text-primary border-primary/20',
    stone: 'bg-muted text-muted-foreground border-border',
    slate: 'bg-muted text-muted-foreground border-border',
    lime: 'bg-primary/10 text-primary border-primary/20',
    blue: 'bg-accent/10 text-accent border-accent/20',
    cyan: 'bg-accent/10 text-accent border-accent/20',
    teal: 'bg-accent/10 text-accent border-accent/20',
    orange: 'bg-primary/10 text-primary border-primary/20',
    pink: 'bg-accent/10 text-accent border-accent/20',
};

const DEFAULT_COLOR = 'bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground border-border dark:border-border';

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
            <label className="text-xs font-black uppercase text-muted-foreground block mb-1">{label}</label>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
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
                    <span className="text-xs text-muted-foreground self-center px-1">태그를 선택하세요... (Click to expand)</span>
                )}
            </div>

            {/* Dropdown / Expandable Area */}
            {isOpen && (
                <div className="mt-2 p-4 bg-background border border-border rounded-xl space-y-6 shadow-xl animate-in fade-in slide-in-from-top-2">
                    {Object.entries(availableTags).map(([categoryKey, data]) => {
                        const categoryColorClass = COLOR_MAP[data.color] || DEFAULT_COLOR;
                        // Strip border from header style to keep it clean, just use text color maybe?
                        // Or just use the map.

                        return (
                            <div key={categoryKey} className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-border pb-1 mb-2">
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
                                                    : `bg-muted/50 text-muted-foreground border-border hover:bg-muted`
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
