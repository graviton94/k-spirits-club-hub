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
  forceRefresh: () => Promise<void>;
  searchSpirits: (query: string) => SpiritSearchIndex[];
  getSpiritById: (id: string) => Spirit | undefined;
  debugInfo: {
    lastLoadSource: 'cache' | 'api' | 'none';
    lastLoadTime: number | null;
    cacheErrors: string[];
  };
}

const SpiritsCacheContext = createContext<SpiritsCacheContextType | undefined>(undefined);

export function SpiritsCacheProvider({ children }: { children: ReactNode }) {
  const [publishedSpirits, setPublishedSpirits] = useState<Spirit[]>([]);
  const [searchIndex, setSearchIndex] = useState<SpiritSearchIndex[]>([]);
  const [fuseInstance, setFuseInstance] = useState<Fuse<SpiritSearchIndex> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    lastLoadSource: 'cache' | 'api' | 'none';
    lastLoadTime: number | null;
    cacheErrors: string[];
  }>({
    lastLoadSource: 'none',
    lastLoadTime: null,
    cacheErrors: []
  });

  // Helper function to safely access localStorage
  const safeLocalStorage = {
    getItem: (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        const errorMsg = `localStorage.getItem failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
        console.warn(`[SpiritsCacheContext] ${errorMsg}`);
        setDebugInfo(prev => ({
          ...prev,
          cacheErrors: [...prev.cacheErrors, errorMsg]
        }));
        return null;
      }
    },
    setItem: (key: string, value: string): boolean => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        const errorMsg = `localStorage.setItem failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
        console.warn(`[SpiritsCacheContext] ${errorMsg}`);
        setDebugInfo(prev => ({
          ...prev,
          cacheErrors: [...prev.cacheErrors, errorMsg]
        }));
        return false;
      }
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`[SpiritsCacheContext] localStorage.removeItem failed:`, e);
      }
    }
  };

  const fetchPublishedSpirits = async (forceRefetch = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const loadStartTime = Date.now();

      // 1. Check LocalStorage Cache for search index
      if (!forceRefetch) {
        const cachedIndex = safeLocalStorage.getItem('spirits_search_index');
        const cachedSpirits = safeLocalStorage.getItem('spirits_master_cache');
        
        if (cachedIndex && cachedSpirits) {
          try {
            const parsedIndex = JSON.parse(cachedIndex);
            const parsedSpirits = JSON.parse(cachedSpirits);
            const now = Date.now();
            const ageHours = (now - (parsedIndex.timestamp || 0)) / (1000 * 60 * 60);

            if (ageHours < 24 && Array.isArray(parsedIndex.data) && Array.isArray(parsedSpirits.data)) {
              const indexData = parsedIndex.data as SpiritSearchIndex[];
              const spiritsData = parsedSpirits.data as Spirit[];
              
              console.log(`[SpiritsCacheContext] ✅ Loaded from CACHE: ${indexData.length} spirits (Age: ${ageHours.toFixed(1)}h)`);
              
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
              
              setDebugInfo({
                lastLoadSource: 'cache',
                lastLoadTime: loadStartTime,
                cacheErrors: []
              });
              
              setIsLoading(false);
              return;
            } else {
              console.log('[SpiritsCacheContext] ⚠️ Cache expired or invalid, refetching...');
            }
          } catch (e) {
            const parseError = `JSON.parse failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
            console.warn(`[SpiritsCacheContext] ⚠️ ${parseError}`);
            setDebugInfo(prev => ({
              ...prev,
              cacheErrors: [...prev.cacheErrors, parseError]
            }));
          }
        }
      } else {
        console.log('[SpiritsCacheContext] 🔄 Force refresh requested, clearing cache...');
      }

      console.log('[SpiritsCacheContext] 📡 Fetching data from Firestore...');

      // Fetch both the minimized search index and full spirits data
      const [index, spiritsResult] = await Promise.all([
        getSpiritsSearchIndex(),
        getSpiritsAction(
          { isPublished: true, status: 'PUBLISHED' },
          { page: 1, pageSize: 15000 }
        )
      ]);

      console.log(`[SpiritsCacheContext] ✅ Fetched from API: ${index.length} spirits, ${spiritsResult.data.length} full records`);

      // 2. Save to LocalStorage (with safety wrapper)
      const indexPayload = JSON.stringify({
        data: index,
        timestamp: Date.now()
      });
      const spiritsPayload = JSON.stringify({
        data: spiritsResult.data,
        timestamp: Date.now()
      });
      
      const indexSaved = safeLocalStorage.setItem('spirits_search_index', indexPayload);
      const spiritsSaved = safeLocalStorage.setItem('spirits_master_cache', spiritsPayload);
      
      if (!indexSaved || !spiritsSaved) {
        console.warn('[SpiritsCacheContext] ⚠️ Could not save to localStorage (quota/private mode). Using memory-only cache.');
      }

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

      setDebugInfo({
        lastLoadSource: 'api',
        lastLoadTime: loadStartTime,
        cacheErrors: []
      });

    } catch (err) {
      console.error('[SpiritsCacheContext] ❌ Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setDebugInfo(prev => ({
        ...prev,
        cacheErrors: [...prev.cacheErrors, err instanceof Error ? err.message : 'Failed to fetch data']
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedSpirits();
  }, []);

  const forceRefresh = async () => {
    console.log('[SpiritsCacheContext] 🔄 Force refresh initiated...');
    // Clear localStorage cache
    safeLocalStorage.removeItem('spirits_search_index');
    safeLocalStorage.removeItem('spirits_master_cache');
    // Re-fetch from server
    await fetchPublishedSpirits(true);
  };

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
    forceRefresh,
    searchSpirits,
    getSpiritById,
    debugInfo
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
