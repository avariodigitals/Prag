'use client';

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import type { CartItem } from './cart';

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  update: (id: number, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function subscribeToHydration() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);

  if (!hydrated) {
    return (
      <CartContext.Provider value={{ items: [], add: () => {}, remove: () => {}, update: () => {}, clear: () => {}, total: 0, count: 0 }}>
        {children}
      </CartContext.Provider>
    );
  }

  return <HydratedCartProvider>{children}</HydratedCartProvider>;
}

function HydratedCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('prag_cart');
      if (stored) {
        return JSON.parse(stored) as CartItem[];
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('prag_cart', JSON.stringify(items));
  }, [items]);

  const add = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const update = useCallback((id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
