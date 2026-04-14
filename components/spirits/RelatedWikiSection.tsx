'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ShieldCheck, Thermometer, GlassWater } from 'lucide-react';
import { getSpiritCategory } from '@/lib/constants/spirits-guide-data';

interface RelatedWikiSectionProps {
  lang: string;
  category: string;
  subcategory?: string | null;
  mainCategory?: string | null;
  slug: string;
  labelKo: string;
  labelEn: string;
}

export default function RelatedWikiSection({
  lang,
  category,
  subcategory,
  mainCategory,
  slug,
  labelKo,
  labelEn,
}: RelatedWikiSectionProps) {
  const wikiCat = getSpiritCategory(slug);
  if (!wikiCat) return null;

  const isEn = lang === 'en';
  const title = isEn ? wikiCat.nameEn : wikiCat.nameKo;
  const tagline = isEn ? wikiCat.taglineEn : wikiCat.taglineKo;
  const section = isEn ? (wikiCat.sectionsEn || wikiCat.sections) : wikiCat.sections;

  // Extract a "Pro Tip" or "Best Glass" from metadata
  const servingInfo = section?.servingGuidelines;
  const metrics = section?.sensoryMetrics;

  return (
    <section className="mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden relative group">
        
        {/* Decorative Background Icon */}
        <div className="absolute -right-8 -top-8 text-slate-200/50 dark:text-white/5 transform -rotate-12 transition-transform group-hover:rotate-0 duration-700">
          <BookOpen size={160} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              {isEn ? 'Expert Guide' : '전문가 가이드'}
            </h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h4 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-slate-100">
                {wikiCat.emoji} {title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base mb-6 max-w-2xl leading-relaxed">
                {tagline}
              </p>

              {/* Snippets / Quick Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {servingInfo?.recommendedGlass && (
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                    <div className="text-blue-500">
                      <GlassWater size={18} />
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-400 font-bold uppercase tracking-tight">Best Glass</div>
                      <div className="text-slate-900 dark:text-slate-100 font-black">{servingInfo.recommendedGlass}</div>
                    </div>
                  </div>
                )}
                
                {servingInfo?.optimalTemperatures && servingInfo.optimalTemperatures.length > 0 && (
                  <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/5">
                    <div className="text-red-500">
                      <Thermometer size={18} />
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-400 font-bold uppercase tracking-tight">Best Temp</div>
                      <div className="text-slate-900 dark:text-slate-100 font-black">
                        {servingInfo.optimalTemperatures[0].temp}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/${lang}/contents/wiki/${slug}?utm_source=internal_linking&utm_content=related_section`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                {isEn ? 'Read Full Guide' : '가이드 전체 읽기'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* E-E-A-T Badge */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
          <ShieldCheck size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isEn ? 'Verified Content by K-Spirits Editorial Team' : 'K-Spirits 에디토리얼 팀 인증 콘텐츠'}
          </span>
        </div>
      </div>
    </section>
  );
}
