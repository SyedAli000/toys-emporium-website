'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { wishlistService } from '@/lib/services';

interface WishlistContextValue {
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  loadingId: string | null;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await wishlistService.get();
      const productIds = res.products?.map((p) => p._id).filter(Boolean) ?? [];
      setIds(new Set(productIds));
    } catch {
      setIds(new Set());
    }
  }, []);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => ids.has(productId),
    [ids],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      setLoadingId(productId);
      try {
        const wasSaved = ids.has(productId);
        if (wasSaved) {
          await wishlistService.remove(productId);
        } else {
          await wishlistService.add(productId);
        }
        await refreshWishlist();
        return !wasSaved;
      } finally {
        setLoadingId(null);
      }
    },
    [ids, refreshWishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: ids.size,
        isInWishlist,
        refreshWishlist,
        toggleWishlist,
        loadingId,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}
