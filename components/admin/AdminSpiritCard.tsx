'use client';

import type { Spirit } from "@/lib/db/schema";
import { useState } from "react";
import { db } from "@/lib/db";

interface AdminSpiritCardProps {
  spirit: Spirit;
  onRefresh?: () => void;
}

export default function AdminSpiritCard({ spirit, onRefresh }: AdminSpiritCardProps) {
  const [status, setStatus] = useState(spirit.isPublished ? 'published' : 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [enrichStep, setEnrichStep] = useState<'idle' | 'audit' | 'sensory' | 'pairing'>('idle');

  const [nameEn, setNameEn] = useState(spirit.name_en || '');
  const [descKo, setDescKo] = useState(spirit.metadata?.description_ko || spirit.description_ko || '');
  const [descEn, setDescEn] = useState(spirit.metadata?.description_en || spirit.description_en || '');
  const [pairingKo, setPairingKo] = useState(spirit.metadata?.pairing_guide_ko || spirit.pairing_guide_ko || '');
  const [pairingEn, setPairingEn] = useState(spirit.metadata?.pairing_guide_en || spirit.pairing_guide_en || '');

  // Sensory Tags
  const [noseTags, setNoseTags] = useState<string[]>(spirit.nose_tags || spirit.metadata?.nose_tags || []);
  const [palateTags, setPalateTags] = useState<string[]>(spirit.palate_tags || spirit.metadata?.palate_tags || []);
  const [finishTags, setFinishTags] = useState<string[]>(spirit.finish_tags || spirit.metadata?.finish_tags || []);
  const [tastingNote, setTastingNote] = useState(spirit.tasting_note || spirit.metadata?.tasting_note || '');

  // Local states for metadata preview/edit
  const [distillery, setDistillery] = useState(spirit.distillery || '');
  const [region, setRegion] = useState(spirit.region || '');
  const [country, setCountry] = useState(spirit.country || 'South Korea');
  const [abv, setAbv] = useState(spirit.abv || 0);
  const [category, setCategory] = useState(spirit.category || '');
  const [subcategory, setSubcategory] = useState(spirit.subcategory || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnrich = async () => {
    if (!spirit.name) return;
    setIsTranslating(true);
    setErrorMessage(null);
    try {
      // STEP 1: AUDIT
      setEnrichStep('audit');
      const auditRes = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'audit',
          name: spirit.name,
          category: category || spirit.category,
          subcategory: subcategory || spirit.subcategory,
          distillery: distillery || spirit.distillery,
          abv: abv || spirit.abv,
          region: region || spirit.region,
          country: country || spirit.country
        })
      });
      if (!auditRes.ok) throw new Error('Audit failed');
      const auditData = await auditRes.json();
      if (auditData.name_en) setNameEn(auditData.name_en);
      if (auditData.distillery) setDistillery(auditData.distillery);
      if (auditData.region) setRegion(auditData.region);
      if (auditData.country) setCountry(auditData.country);
      if (auditData.abv !== undefined) setAbv(auditData.abv);
      if (auditData.category) setCategory(auditData.category);
      if (auditData.subcategory) setSubcategory(auditData.subcategory);

      // STEP 2: SENSORY
      setEnrichStep('sensory');
      const sensoryRes = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'sensory',
          name: spirit.name,
          name_en: auditData.name_en || nameEn,
          category: auditData.category || category || spirit.category,
          abv: auditData.abv || abv || spirit.abv
        })
      });
      if (!sensoryRes.ok) throw new Error('Sensory data generation failed');
      const sensoryData = await sensoryRes.json();
      if (sensoryData.description_ko) setDescKo(sensoryData.description_ko);
      if (sensoryData.description_en) setDescEn(sensoryData.description_en);
      if (sensoryData.nose_tags) setNoseTags(sensoryData.nose_tags);
      if (sensoryData.palate_tags) setPalateTags(sensoryData.palate_tags);
      if (sensoryData.finish_tags) setFinishTags(sensoryData.finish_tags);
      if (sensoryData.tasting_note) setTastingNote(sensoryData.tasting_note);

      // STEP 3: PAIRING
      setEnrichStep('pairing');
      const pairingRes = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'pairing',
          name: spirit.name,
          category: auditData.category || category || spirit.category,
          description_en: sensoryData.description_en,
          description_ko: sensoryData.description_ko,
          nose_tags: sensoryData.nose_tags,
          palate_tags: sensoryData.palate_tags,
          finish_tags: sensoryData.finish_tags
        })
      });
      if (!pairingRes.ok) throw new Error('Pairing guide generation failed');
      const pairingData = await pairingRes.json();
      if (pairingData.pairing_guide_ko) setPairingKo(pairingData.pairing_guide_ko);
      if (pairingData.pairing_guide_en) setPairingEn(pairingData.pairing_guide_en);

      setEnrichStep('idle');
      alert('✨ AI 데이터 순차 생성 완료!');
    } catch (error: any) {
      console.error("Enrichment failed:", error);
      setErrorMessage(`Enrichment failed at [${enrichStep}]: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!spirit.name) return;
    setIsGeneratingDescription(true);
    setErrorMessage(null);
    try {
      const descRes = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'description',
          name: spirit.name,
          category: category || spirit.category,
          subcategory: subcategory || spirit.subcategory,
          distillery: distillery || spirit.distillery,
          abv: abv || spirit.abv,
          region: region || spirit.region,
          country: country || spirit.country,
          nose_tags: noseTags,
          palate_tags: palateTags,
          finish_tags: finishTags
        })
      });
      if (!descRes.ok) throw new Error('Description generation failed');
      const descData = await descRes.json();
      if (descData.description_ko) setDescKo(descData.description_ko);
      if (descData.description_en) setDescEn(descData.description_en);
      
      alert('✨ 설명 생성 완료!');
    } catch (error: any) {
      console.error("Description generation failed:", error);
      setErrorMessage(`Description generation failed: ${error.message}`);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const updateData: any = {
        isPublished: true,
        isReviewed: true,
        reviewedBy: 'ADMIN',
        reviewedAt: new Date(),
        name_en: nameEn || null,
        abv: abv,
        distillery: distillery,
        region: region,
        country: country,
        category: category,
        subcategory: subcategory,
        nose_tags: noseTags,
        palate_tags: palateTags,
        finish_tags: finishTags,
        tasting_note: tastingNote,
        metadata: {
          ...spirit.metadata,
          description_ko: descKo,
          description_en: descEn,
          pairing_guide_ko: pairingKo,
          pairing_guide_en: pairingEn,
          enriched_at: new Date().toISOString()
        }
      };

      await db.updateSpirit(spirit.id, updateData);
      setStatus('published');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to publish:", error);
      setErrorMessage(`Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await db.updateSpirit(spirit.id, {
        isPublished: false,
        isReviewed: true
      });
      setStatus('rejected');
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded flex items-center justify-center shrink-0">
          <span className="text-3xl">🥃</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg truncate">{spirit.name}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary rounded uppercase tracking-widest">{spirit.category}</span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm mb-3">
            <span className="px-2 py-1 rounded bg-secondary font-bold">도수 {abv}%</span>
            <span className="px-2 py-1 rounded bg-secondary font-bold">{region}, {country}</span>
          </div>

          {status === 'pending' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">English Name</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Jinro Is Back"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Description (KO / EN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    value={descKo}
                    onChange={(e) => setDescKo(e.target.value)}
                    placeholder="Korean description"
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded bg-background resize-none"
                  />
                  <textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="English description"
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded bg-background resize-none"
                  />
                </div>
                <button
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription || isTranslating || isLoading}
                  className="w-full py-2 bg-blue-600 shadow-md shadow-blue-500/20 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isGeneratingDescription ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Generating...
                    </>
                  ) : '✨ 설명만 생성 (현재 정보 기반)'}
                </button>
              </div>

              {/* Tags Section */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase text-pink-500">Nose Tags</label>
                  <div className="text-[10px] bg-secondary/50 p-2 rounded min-h-[40px] border border-border/50">
                    {noseTags.join(', ') || 'No tags'}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase text-amber-500">Palate Tags</label>
                  <div className="text-[10px] bg-secondary/50 p-2 rounded min-h-[40px] border border-border/50">
                    {palateTags.join(', ') || 'No tags'}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase text-blue-500">Finish Tags</label>
                  <div className="text-[10px] bg-secondary/50 p-2 rounded min-h-[40px] border border-border/50">
                    {finishTags.join(', ') || 'No tags'}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Pairing Guide (KO / EN)</label>
                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    value={pairingKo}
                    onChange={(e) => setPairingKo(e.target.value)}
                    placeholder="Korean pairing guide"
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded bg-background resize-none"
                  />
                  <textarea
                    value={pairingEn}
                    onChange={(e) => setPairingEn(e.target.value)}
                    placeholder="English pairing guide"
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs border border-border rounded bg-background resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className={enrichStep === 'audit' ? 'text-purple-500 scale-110' : 'opacity-30'}>1. Audit</span>
                  <span className={enrichStep === 'sensory' ? 'text-purple-500 scale-110' : 'opacity-30'}>2. Sensory</span>
                  <span className={enrichStep === 'pairing' ? 'text-purple-500 scale-110' : 'opacity-30'}>3. Pairing</span>
                </div>
                <button
                  onClick={handleEnrich}
                  disabled={isTranslating || isLoading}
                  className="w-full py-3 bg-purple-600 shadow-lg shadow-purple-500/20 text-white rounded-xl text-sm font-black hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isTranslating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Generating {enrichStep}...
                    </>
                  ) : '✨ AI 데이터 순차 생성 (Audit > Sensory > Pairing)'}
                </button>
              </div>

              {errorMessage && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                  ⚠️ {errorMessage}
                </div>
              )}
            </div>
          )}

          {status === 'published' && (
            <div className="mt-2 text-xs text-muted-foreground">
              ✓ 발행됨: {spirit.reviewedBy} ({spirit.reviewedAt ? new Date(spirit.reviewedAt).toLocaleDateString() : '날짜 없음'})
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {status === 'pending' && (
            <>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-bold"
              >
                발행하기
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 bg-background border border-border text-muted-foreground rounded hover:bg-secondary disabled:opacity-50 text-sm"
              >
                취소
              </button>
            </>
          )}
          {status === 'published' && (
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm text-center">
              발행됨
            </span>
          )}
          {status === 'rejected' && (
            <span className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-sm text-center">
              거절됨
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
