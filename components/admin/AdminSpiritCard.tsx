'use client';

import type { Spirit } from "@/lib/db/schema";
import { useState } from "react";
import { db } from "@/lib/db";

interface AdminSpiritCardProps {
  spirit: Spirit;
}

interface EnrichmentResult {
  name_en?: string;
  description_en?: string;
  pairing_guide_en?: string;
  pairing_guide_ko?: string;
}

interface SpiritUpdateData {
  isPublished?: boolean;
  isReviewed?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  name_en?: string | null;
  description_en?: string;
  metadata?: any;
}

export default function AdminSpiritCard({ spirit }: AdminSpiritCardProps) {
  const [status, setStatus] = useState(spirit.isPublished ? 'published' : 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [nameEn, setNameEn] = useState(spirit.name_en || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!spirit.name) return;
    setIsTranslating(true);
    try {
      const response = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: spirit.name,
          category: spirit.category,
          distillery: spirit.distillery
        })
      });
      const data = await response.json();
      if (data.name_en) {
        setNameEn(data.name_en);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Step 1: Call AI enrichment API to generate name_en, description_en, and pairing guides
      console.log('[Publish] Starting AI enrichment for:', spirit.name);
      const enrichResponse = await fetch('/api/admin/spirits/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: spirit.name,
          category: spirit.category,
          subcategory: spirit.subcategory,
          distillery: spirit.distillery,
          abv: spirit.abv,
          region: spirit.region,
          metadata: spirit.metadata
        })
      });

      let enrichedData: EnrichmentResult | null = null;
      if (enrichResponse.ok) {
        enrichedData = await enrichResponse.json();
        console.log('[Publish] ✓ AI enrichment successful:', enrichedData);
      } else {
        const errorData = await enrichResponse.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Publish] ✗ AI enrichment failed:', errorData);
        setErrorMessage(`AI enrichment failed: ${errorData.error || errorData.details || 'Unknown error'}. Publishing without AI content.`);
      }

      // Step 2: Update spirit with enriched data
      const updateData: SpiritUpdateData = {
        isPublished: true,
        isReviewed: true,
        reviewedBy: 'ADMIN',
        reviewedAt: new Date(),
        name_en: enrichedData?.name_en || nameEn || null
      };

      // Add description_en if generated
      if (enrichedData?.description_en) {
        updateData.description_en = enrichedData.description_en;
      }

      // Add pairing guides to metadata if generated
      if (enrichedData?.pairing_guide_en || enrichedData?.pairing_guide_ko) {
        updateData.metadata = {
          ...spirit.metadata,
          pairing_guide_en: enrichedData?.pairing_guide_en || spirit.metadata?.pairing_guide_en,
          pairing_guide_ko: enrichedData?.pairing_guide_ko || spirit.metadata?.pairing_guide_ko
        };
      }

      await db.updateSpirit(spirit.id, updateData);
      console.log('[Publish] ✓ Spirit published successfully');
      setStatus('published');
      
      // Clear error after a few seconds if publish succeeded
      if (errorMessage) {
        setTimeout(() => setErrorMessage(null), 5000);
      }
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
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">🥃</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{spirit.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{spirit.distillery}</p>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-secondary">도수 {spirit.abv}%</span>
            <span className="px-2 py-1 rounded bg-secondary">{spirit.country}</span>
            <span className="px-2 py-1 rounded bg-secondary">{spirit.category}</span>
            <span className={`px-2 py-1 rounded ${spirit.source === 'food_safety_korea' ? 'bg-green-100 dark:bg-green-900' :
              spirit.source === 'online' ? 'bg-blue-100 dark:bg-blue-900' :
                'bg-gray-100 dark:bg-gray-800'
              }`}>
              {spirit.source}
            </span>
          </div>

          {/* 영문명 편집 및 AI 번역 영역 */}
          {status === 'pending' && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="English Name (AI 번역 가능)"
                  className="flex-1 px-3 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || isLoading}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded text-xs font-bold hover:bg-blue-100 disabled:opacity-50 flex items-center gap-1"
                >
                  {isTranslating ? '...' : '🤖 AI 번역'}
                </button>
              </div>
              {/* Error message display */}
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

        <div className="flex flex-col gap-2 flex-shrink-0">
          {status === 'pending' && (
            <>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                ✓ 발행
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                ✗ 거절
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
