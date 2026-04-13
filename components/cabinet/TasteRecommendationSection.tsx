'use client';

import { SpiritCard } from '../ui/SpiritCard';
import { motion } from 'framer-motion';

export default function TasteRecommendationSection({ 
    recommendations,
    dict 
}: { 
    recommendations: any[],
    dict?: any
}) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <section className="mt-16 mb-20">
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">
                        {dict?.cabinet?.recommendation_title || "Discovery Flywheel"}
                    </h2>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-1">
                        Tailored Matches via AI Sommelier Logic
                    </p>
                </div>
                <div className="hidden sm:block text-[10px] font-black py-1 px-3 bg-secondary border border-border rounded-full text-muted-foreground uppercase opacity-60">
                    {recommendations.length} MATCHES FOUND
                </div>
            </div>

            <div className="relative group/flywheel">
                <div className="flex overflow-x-auto gap-8 pb-10 px-2 scrollbar-hide snap-x scroll-smooth">
                    {recommendations.map((spirit, idx) => (
                        <motion.div 
                            key={spirit.id || spirit.name || idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[320px] sm:min-w-[420px] lg:min-w-[500px] snap-start relative group"
                        >
                            <SpiritCard spirit={spirit} />
                            
                            {/* Backdrop Glow - Theme Aware */}
                            <div className="absolute inset-x-2 inset-y-4 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500 rounded-[32px] -z-10 blur-2xl" />
                        </motion.div>
                    ))}
                </div>

                {/* Right Fade Gradient for discovery */}
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover/flywheel:opacity-100 transition-opacity" />
            </div>
            
            {/* Horizontal Scroll Progress Indication */}
            <div className="w-full h-px bg-border/40 mt-4" />
        </section>
    );
}
