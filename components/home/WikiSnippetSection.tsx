'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WikiSnippet } from '@/lib/utils/wiki-snippet';
import { surfaces, chips, typography } from '@/lib/design/patterns';

export default function WikiSnippetSection({ lang, initialSnippet }: { lang: string, initialSnippet: WikiSnippet | null }) {
    const isEn = lang === 'en';

    if (!initialSnippet) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    </div>
                    <h2 className={typography.sectionTitle}>
                        {isEn ? 'Spirits Wiki' : '주류 백과사전'}
                    </h2>
                </div>
            </div>

            <Link href={initialSnippet.link} className="group block">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={initialSnippet.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 md:p-8 ${surfaces.panelSoft} rounded-3xl group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all cursor-pointer relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-24 h-24 text-primary" />
                        </div>

                        <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-3 text-primary group-hover:text-accent transition-colors drop-shadow-sm leading-tight">
                            Q. {initialSnippet.title}
                        </h3>
                        <p className="text-[13px] md:text-base text-muted-foreground leading-relaxed md:leading-loose font-medium mb-4 md:mb-6 relative z-10 line-clamp-3">
                            A. {initialSnippet.content}
                        </p>

                        <div className="flex justify-end relative z-10">
                            <span className={`inline-flex items-center gap-1.5 ${chips.primary} group-hover:bg-primary group-hover:text-primary-foreground transition-all`}>
                                {isEn ? 'Read More on Spirits Wiki' : '주류 백과사전에서 더 찾아보기'}
                                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Link>
        </section>
    );
}
