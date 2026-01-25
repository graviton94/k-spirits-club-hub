'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Spirit } from '@/lib/db/schema';
import { getSpiritsAction } from '@/app/actions/spirits';

interface SpiritsCacheContextType {
  publishedSpirits: Spirit[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchSpirits: (query: string) => Spirit[];
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export function SpiritsCacheProvider({ children }: { children: ReactNode }) {
  const [publishedSpirits, setPublishedSpirits] = useState<Spirit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedSpirits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[SpiritsCacheContext] Fetching all published spirits for cache...');
      
      // Fetch all published spirits with a large page size
      const result = await getSpiritsAction(
        { 
          isPublished: true, 
          status: 'PUBLISHED' 
        },
        { page: 1, pageSize: 5000 } // Large page size to get all published spirits
      );
      
      console.log(`[SpiritsCacheContext] Cached ${result.data.length} published spirits`);
      setPublishedSpirits(result.data);
    } catch (err) {
      console.error('[SpiritsCacheContext] Failed to fetch published spirits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch spirits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedSpirits();
  }, []);

  const searchSpirits = (query: string): Spirit[] => {
    if (!query.trim()) {
      return publishedSpirits;
    }

    const lowerQuery = query.toLowerCase();
    return publishedSpirits.filter(spirit => 
      spirit.name.toLowerCase().includes(lowerQuery) ||
      spirit.distillery?.toLowerCase().includes(lowerQuery) ||
      spirit.category?.toLowerCase().includes(lowerQuery) ||
      spirit.subcategory?.toLowerCase().includes(lowerQuery) ||
      spirit.country?.toLowerCase().includes(lowerQuery) ||
      spirit.metadata?.name_en?.toLowerCase().includes(lowerQuery)
    );
  };

  const value: SpiritsCacheContextType = {
    publishedSpirits,
    isLoading,
    error,
    refetch: fetchPublishedSpirits,
    searchSpirits
  };

  return (
    <SpiritsCacheContext.Provider value={value}>
      {children}
    </SpiritsCacheContext.Provider>
  );
}

export function useSpiritsCache() {
  const context = useContext(SpiritsCacheContext);
  if (context === undefined) {
    throw new Error('useSpiritsCache must be used within a SpiritsCacheProvider');
  }
  return context;
}
