'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Spirit, SpiritSearchIndex } from '@/lib/db/schema';
import { getSpiritsAction, getSpiritsSearchIndex } from '@/app/actions/spirits';
import Fuse from 'fuse.js';

interface SpiritsCacheContextType {
  publishedSpirits: Spirit[];
  searchIndex: SpiritSearchIndex[];
  fuseInstance: Fuse<SpiritSearchIndex> | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchSpirits: (query: string) => SpiritSearchIndex[];
  getSpiritById: (id: string) => Spirit | undefined;
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export function SpiritsCacheProvider({ children }: { children: ReactNode }) {
  const [publishedSpirits, setPublishedSpirits] = useState<Spirit[]>([]);
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [fuseInstance, setFuseInstance] = useState<Fuse<SpiritSearchIndex> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedSpirits = async (forceRefetch = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Check LocalStorage Cache for search index
      if (!forceRefetch) {
        const cachedIndex = localStorage.getItem('spirits_search_index');
        const cachedSpirits = localStorage.getItem('spirits_master_cache');
        
        if (cachedIndex && cachedSpirits) {
          try {
            const parsedIndex = JSON.parse(cachedIndex);
            const parsedSpirits = JSON.parse(cachedSpirits);
            const now = Date.now();
            const ageHours = (now - (parsedIndex.timestamp || 0)) / (1000 * 60 * 60);

            if (ageHours < 24 && Array.isArray(parsedIndex.data) && Array.isArray(parsedSpirits.data)) {
              console.log(`[SpiritsCacheContext] Loaded ${parsedIndex.data.length} spirits from cache (Age: ${ageHours.toFixed(1)}h)`);
              
              const indexData = parsedIndex.data as SpiritSearchIndex[];
              const spiritsData = parsedSpirits.data as Spirit[];
              
              setSearchIndex(indexData);
              setPublishedSpirits(spiritsData);
              
              // Initialize Fuse.js with the cached index
              const fuse = new Fuse<SpiritSearchIndex>(indexData, {
                keys: ['n', 'en', 'c'],
                threshold: 0.3,
                includeScore: true,
                minMatchCharLength: 1
              });
              setFuseInstance(fuse);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.warn('[SpiritsCacheContext] Cache parsing failed, refetching...');
          }
        }
      }

      console.log('[SpiritsCacheContext] Fetching data from Firestore...');

      // Fetch both the minimized search index and full spirits data
      const [index, spiritsResult] = await Promise.all([
        getSpiritsSearchIndex(),
        getSpiritsAction(
          { isPublished: true, status: 'PUBLISHED' },
          { page: 1, pageSize: 15000 }
        )
      ]);

      console.log(`[SpiritsCacheContext] Cached ${index.length} spirits to search index`);

      // 2. Save to LocalStorage
      localStorage.setItem('spirits_search_index', JSON.stringify({
        data: index,
        timestamp: Date.now()
      }));
      
      localStorage.setItem('spirits_master_cache', JSON.stringify({
        data: spiritsResult.data,
        timestamp: Date.now()
      }));

      setSearchIndex(index);
      setPublishedSpirits(spiritsResult.data);

      // 3. Initialize Fuse.js with the search index
      const fuse = new Fuse<SpiritSearchIndex>(index, {
        keys: ['n', 'en', 'c'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1
      });
      setFuseInstance(fuse);

    } catch (err) {
      console.error('[SpiritsCacheContext] Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedSpirits();
  }, []);

  const searchSpirits = (query: string): SpiritSearchIndex[] => {
    if (!query.trim() || !fuseInstance) {
      return searchIndex;
    }

    // Use Fuse.js for fuzzy search
    const results = fuseInstance.search(query);
    return results.map(result => result.item);
  };

  const getSpiritById = (id: string): Spirit | undefined => {
    return publishedSpirits.find(spirit => spirit.id === id);
  };

  const value: SpiritsCacheContextType = {
    publishedSpirits,
    searchIndex,
    fuseInstance,
    isLoading,
    error,
    refetch: fetchPublishedSpirits,
    searchSpirits,
    getSpiritById
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
