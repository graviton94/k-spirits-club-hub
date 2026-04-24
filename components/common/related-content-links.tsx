'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    LayoutGrid, 
    Fingerprint, 
    BookOpen, 
    Search, 
    Trophy, 
    Newspaper, 
    MessageSquare,
    ArrowRight,
    LucideIcon
} from 'lucide-react';

interface RelatedLink {
    href: string;
    label: string;
    icon?: LucideIcon;
}

interface RelatedContentLinksProps {
    title: string;
    links: RelatedLink[];
}

export function RelatedContentLinks({ title, links }: RelatedContentLinksProps) {
    if (!links || links.length === 0) return null;

    return (
        <section className="space-y-10 pt-16 pb-8 border-t border-border/40 relative overflow-hidden group">
            {/* Minimal Atmosphere */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-brand-gradient opacity-40 shrink-0" />
                <h2 className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.4em] italic whitespace-nowrap">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border/40 via-border/10 to-transparent" />
            </div>

            <nav className="flex flex-wrap gap-x-3 gap-y-4 justify-start items-center">
                {links.map((link, index) => {
                    const Icon = link.icon || ArrowRight;
                    
                    return (
                        <motion.div
                            key={link.href + index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-card/40 backdrop-blur-3xl border border-white/5 hover:border-primary/40 hover:bg-card/60 transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-primary/5"
                            >
                                {/* Animated Hover Border/Glow */}
                                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                                
                                <div className="p-1.5 bg-background/50 rounded-lg border border-white/5 group-hover:bg-primary group-hover:border-primary group-hover:rotate-[360deg] shadow-lg transition-all duration-700">
                                    <Icon className="w-3.5 h-3.5 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                                </div>
                                <span className="text-[13px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                                    {link.label}
                                </span>
                                
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-1/2 transition-all duration-500 rounded-full" />
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>
        </section>
    );
}

// Helper to get common icons based on labels or paths
export function getRelatedIcon(label: string, href: string): LucideIcon {
    const l = label.toLowerCase();
    const h = href.toLowerCase();

    if (h.includes('mbti')) return Fingerprint;
    if (h.includes('worldcup')) return Trophy;
    if (h.includes('wiki') || l.includes('백과') || l.includes('가이드')) return BookOpen;
    if (h.includes('contents') && !h.includes('/')) return LayoutGrid;
    if (h.includes('news')) return Newspaper;
    if (h.includes('reviews') || l.includes('리뷰')) return MessageSquare;
    if (h.includes('explore') || l.includes('탐색')) return Search;
    
    return ArrowRight;
}
