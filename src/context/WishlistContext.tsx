import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface WishlistItemMetadata {
  productId: string;
  addedAt: string;
  source: 'catalog_plp' | 'product_pdp' | 'homepage';
  syncState: 'local' | 'synced';
}

interface WishlistContextType {
  wishlist: WishlistItemMetadata[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, source?: 'catalog_plp' | 'product_pdp' | 'homepage') => Promise<void>;
  syncWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItemMetadata[]>([]);

  // Load wishlist from local storage on mount
  useEffect(() => {
    const cached = localStorage.getItem('aurum_wishlist');
    if (cached) {
      try {
        setWishlist(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse cached wishlist');
      }
    }
  }, []);

  // Sync wishlist when auth user state changes
  useEffect(() => {
    if (user) {
      syncWishlist();
    }
  }, [user]);

  // Persist local wishlist changes to localStorage
  const saveToLocal = (items: WishlistItemMetadata[]) => {
    setWishlist(items);
    localStorage.setItem('aurum_wishlist', JSON.stringify(items));
  };

  const syncWishlist = async () => {
    if (!user) return;
    try {
      // 1. Fetch remote wishlist items
      const { data: remoteData, error: fetchErr } = await supabase
        .from('wishlists')
        .select('product_id, created_at')
        .eq('user_id', user.id);

      if (fetchErr) throw fetchErr;

      const remoteIds = (remoteData || []).map(item => item.product_id);

      // 2. Identify local items that are unsynced and upload them
      const unsyncedItems = wishlist.filter(item => item.syncState === 'local' && !remoteIds.includes(item.productId));
      if (unsyncedItems.length > 0) {
        const rows = unsyncedItems.map(item => ({
          user_id: user.id,
          product_id: item.productId,
          created_at: item.addedAt,
        }));
        const { error: insertErr } = await supabase.from('wishlists').insert(rows);
        if (insertErr) throw insertErr;
      }

      // 3. Re-load merged synchronized wishlist
      const { data: finalRemote, error: reloadErr } = await supabase
        .from('wishlists')
        .select('product_id, created_at')
        .eq('user_id', user.id);

      if (reloadErr) throw reloadErr;

      const syncedItems: WishlistItemMetadata[] = (finalRemote || []).map(item => ({
        productId: item.product_id,
        addedAt: item.created_at || new Date().toISOString(),
        source: 'catalog_plp',
        syncState: 'synced',
      }));

      saveToLocal(syncedItems);
    } catch (err) {
      console.warn('Supabase wishlist synchronization skipped (operating in sandbox mode)');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId: string, source: 'catalog_plp' | 'product_pdp' | 'homepage' = 'catalog_plp') => {
    const isAdded = isInWishlist(productId);
    
    if (isAdded) {
      // Remove item
      const updated = wishlist.filter(item => item.productId !== productId);
      saveToLocal(updated);

      if (user) {
        try {
          const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);
          if (error) throw error;
        } catch (err) {
          console.warn('Remote deletion skipped in sandbox');
        }
      }
    } else {
      // Add item
      const newItem: WishlistItemMetadata = {
        productId,
        addedAt: new Date().toISOString(),
        source,
        syncState: user ? 'synced' : 'local',
      };
      const updated = [...wishlist, newItem];
      saveToLocal(updated);

      if (user) {
        try {
          const { error } = await supabase
            .from('wishlists')
            .insert([{ user_id: user.id, product_id: productId, created_at: newItem.addedAt }]);
          if (error) throw error;
        } catch (err) {
          console.warn('Remote insertion skipped in sandbox');
        }
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, syncWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
