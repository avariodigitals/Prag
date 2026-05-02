'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { WishlistItem } from '@/components/WishlistView';

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggle: (product: WishlistItem) => Promise<void>;
  remove: (id: number) => Promise<void>;
  setItems: (items: WishlistItem[]) => void;
  authed: boolean | null;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wishlist')
      .then((r) => {
        setAuthed(r.status !== 401);
        if (r.status === 401) return null;
        return r.json().catch(() => null);
      })
      .then((data) => {
        if (data && Array.isArray(data.items)) setItems(data.items);
      })
      .catch(() => { setAuthed(false); })
      .finally(() => setLoading(false));
  }, []);

const isWishlisted = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback(async (product: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      const updated = exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updated }),
      });
      return updated;
    });
  }, []);

  const remove = useCallback(async (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updated }),
      });
      return updated;
    });
  }, []);

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, remove, setItems, authed, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
