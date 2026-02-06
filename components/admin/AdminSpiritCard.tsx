'use client';

import type { Spirit } from "@/lib/db/schema";
import { useState } from "react";
import { db } from "@/lib/db";

interface AdminSpiritCardProps {
  spirit: Spirit;
  onRefresh?: () => void;
}

interface EnrichmentResult {
  name_en?: string;
  description_ko?: string;
  description_en?: string;
  nose_tags?: string[];
  palate_tags?: string[];
  finish_tags?: string[];
  pairing_guide_en?: string;
  pairing_guide_ko?: string;
  distillery?: string;
  region?: string;
  country?: string;
  abv?: number;
}

interface SpiritUpdateData {
  isPublished?: boolean;
  isReviewed?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  name_en?: string | null;
  description_ko?: string;
  description_en?: string;
  abv?: number;
  distillery?: string | null;
  region?: string | null;
  country?: string | null;
  metadata?: any;
}

export default function AdminSpiritCard({ spirit, onRefresh }: AdminSpiritCardProps) {
  const [status, setStatus] = useState(spirit.isPublished ? 'published' : 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [nameEn, setNameEn] = useState(spirit.name_en || '');
  const [descEn, setDescEn] = useState(spirit.metadata?.description_en || '');
  const [noteEn, setNoteEn] = useState(spirit.metadata?.tasting_note_en || '');
  const [pairingEn, setPairingEn] = useState(spirit.metadata?.pairing_guide_en || '');

  // Local states for metadata preview/edit
  const [distillery, setDistillery] = useState(spirit.distillery || '');
  const [region, setRegion] = useState(spirit.region || '');
  const [country, setCountry] = useState(spirit.country || 'South Korea');
  const [abv, setAbv] = useState(spirit.abv || 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnrich = async () => {
    if (!spirit.name) return;
    setIsTranslating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: spirit.name,
          category: spirit.category,
          subcategory: spirit.subcategory,
          distillery: distillery || spirit.distillery,
          abv: abv || spirit.abv,
          region: region || spirit.region,
          country: country || spirit.country,
          description_en: descEn,
          metadata: spirit.metadata
        })
      });

      if (!response.ok) throw new Error('Enrichment failed');
      const data: any = await response.json();

      if (data.name_en) setNameEn(data.name_en);
      if (data.description_en) setDescEn(data.description_en);
      if (data.tasting_note_en) setNoteEn(data.tasting_note_en);
      if (data.pairing_guide_en) setPairingEn(data.pairing_guide_en);

      if (data.distillery) setDistillery(data.distillery);
      if (data.region) setRegion(data.region);
      if (data.country) setCountry(data.country);
      if (data.abv !== undefined) setAbv(data.abv);

      alert('✨ AI 데이터 분석/교정 완료!');
    } catch (error: any) {
      console.error("Enrichment failed:", error);
      setErrorMessage(`Enrichment failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
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
        metadata: {
          ...spirit.metadata,
          description_en: descEn,
          tasting_note_en: noteEn,
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
          <h3 className="font-semibold text-lg mb-1 truncate">{spirit.name}</h3>

          <div className="flex flex-wrap gap-2 text-sm mb-3">
            <span className="px-2 py-1 rounded bg-secondary font-bold">도수 {abv}%</span>
            <span className="px-2 py-1 rounded bg-secondary font-bold">{region}, {country}</span>
            <span className="px-2 py-1 rounded bg-secondary">{spirit.category}</span>
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
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Tasting Note (EN)</label>
                  <input
                    type="text"
                    value={noteEn}
                    onChange={(e) => setNoteEn(e.target.value)}
                    placeholder="Evocative summary"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Description (EN)</label>
                <textarea
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="Sommelier-style description"
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded bg-background resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Pairing Guide (EN)</label>
                <textarea
                  value={pairingEn}
                  onChange={(e) => setPairingEn(e.target.value)}
                  placeholder="Appetizing pairing recommendations"
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded bg-background resize-none"
                />
              </div>

              <button
                onClick={handleEnrich}
                disabled={isTranslating || isLoading}
                className="w-full py-2 bg-purple-600/10 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded text-sm font-bold hover:bg-purple-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isTranslating ? '...' : '✨ AI 데이터 분석 및 영문 생성'}
              </button>

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
