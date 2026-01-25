'use client';

import React, { useState } from 'react';

interface TagMultiSelectProps {
    label: string;
    availableTags: { [category: string]: { color: string, tags: string[] } };
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

export function TagMultiSelect({ label, availableTags, selectedTags, onChange }: TagMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter(t => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">{label}</label>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-background border border-input rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}>
                {selectedTags.length > 0 ? (
                    selectedTags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary">
                            {tag}
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} className="ml-1 hover:text-primary/70">×</button>
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-muted-foreground self-center px-2">태그를 선택하세요...</span>
                )}
            </div>

            {/* Dropdown / Expandable Area */}
            {isOpen && (
                <div className="mt-2 p-4 bg-secondary/30 border border-border rounded-xl space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
                    {Object.entries(availableTags).map(([categoryKey, data]) => (
                        <div key={categoryKey} className="space-y-2">
                            <h4 className="text-xs font-bold text-foreground capitalize opacity-70 border-b border-border/50 pb-1">{categoryKey.replace(/_/g, ' ')}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {data.tags.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${isSelected
                                                    ? `bg-primary text-primary-foreground border-primary shadow-sm scale-105`
                                                    : `bg-background text-muted-foreground border-border hover:bg-white hover:text-foreground hover:border-foreground/30`
                                                }`}
                                        >
                                            {tag.split(' (')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
