'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WikiSnippet } from '@/lib/utils/wiki-snippet';

export default function WikiSnippetSection({ lang, initialSnippet }: { lang: string, initialSnippet: WikiSnippet | null }) {
    const isEn = lang === 'en';

    if (!initialSnippet) return null;

    return (
        <section className="container max-w-4xl mx-auto px-4 mb-20">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-black tracking-tight text-foreground">
                        {isEn ? 'Spirits Wiki Knowledge' : '주류 백과사전 한 토막 (FAQ)'}
                    </h2>
                </div>
            </div>

            <Link href={initialSnippet.link} className="group block">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={initialSnippet.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 md:p-8 bg-card/40 backdrop-blur-sm border border-border/80 rounded-3xl group-hover:border-emerald-500/50 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-24 h-24 text-emerald-500" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-black mb-3 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors drop-shadow-sm">
                            Q. {initialSnippet.title}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:leading-loose font-medium mb-6 relative z-10 line-clamp-3">
                            A. {initialSnippet.content}
                        </p>

                        <div className="flex justify-end relative z-10">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
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
