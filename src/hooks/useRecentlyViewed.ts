import { useState, useEffect, useCallback } from 'react';

/**
 * Reusable hook to manage recently viewed product tracking in localStorage.
 * Handles deduplication and limits history depth to 8 items.
 */
export const useRecentlyViewed = () => {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const cacheKey = 'aurum_recently_viewed';

  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setRecentlyViewedIds(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse recently viewed history');
      }
    }
  }, []);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      // Remove if already exists (deduplication) and prepend to make it latest
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, 8); // Bound depth to 8
      localStorage.setItem(cacheKey, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(cacheKey);
    setRecentlyViewedIds([]);
  }, []);

  return {
    recentlyViewedIds,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
};
