'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Phone, ShoppingCart, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, startTransition } from 'react';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/lib/types';

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SearchBox({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.products?.slice(0, 6) ?? []);
        setOpen(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect(product: Product) {
    setOpen(false);
    setQuery('');
    router.push(`/products/${product.categories?.[0]?.slug ?? 'all'}/${product.slug}`);
  }

  function clear() {
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  const inputCls = mobile
    ? "flex-1 text-sky-700 text-sm font-normal font-['Inter'] leading-5 outline-none placeholder:text-sky-700/50 bg-transparent"
    : "flex-1 text-gray-600 text-sm font-normal font-['Inter'] outline-none bg-transparent";

  const wrapperCls = mobile
    ? "flex-1 h-8 pl-2.5 pr-3 py-2 bg-white rounded-[5px] flex items-center gap-3 overflow-visible relative"
    : "hidden md:flex w-[566px] h-12 px-3 py-2 bg-white rounded-md border border-gray-300 items-center gap-3 relative";

  return (
    <div ref={containerRef} className={mobile ? 'flex-1 relative' : 'hidden md:block relative'}>
      <form onSubmit={handleSubmit} className={wrapperCls}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for any product..."
          className={inputCls}
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={clear} aria-label="Clear">
            <X className={`w-4 h-4 ${mobile ? 'text-sky-700/50' : 'text-gray-400'}`} />
          </button>
        )}
        <button type="submit" aria-label="Search">
          <Search className={`w-5 h-5 ${mobile ? 'text-sky-700' : 'text-slate-500'}`} />
        </button>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400 font-['Space_Grotesk']">Searching...</div>
          )}
          {!loading && results.length === 0 && debouncedQuery.length >= 2 && (
            <div className="px-4 py-3 text-sm text-gray-400 font-['Space_Grotesk']">No products found</div>
          )}
          {!loading && results.map((product) => {
            const image = product.images?.[0];
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-sky-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {image ? (
                    <Image src={image.src} alt={product.name} width={40} height={40} className="object-contain w-full h-full" />
                  ) : (
                    <div className="w-6 h-6 bg-zinc-200 rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] truncate">{product.name}</p>
                  {product.price && (
                    <p className="text-sky-700 text-xs font-['Space_Grotesk']">
                      ₦{Number(product.price).toLocaleString('en-NG')}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
          {!loading && results.length > 0 && (
            <button
              type="button"
              onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`); }}
              className="w-full px-4 py-2.5 text-center text-sky-700 text-xs font-medium font-['Space_Grotesk'] border-t border-gray-100 hover:bg-sky-50 transition-colors"
            >
              See all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const router = useRouter();
  const { count } = useCart();
  const [user, setUser] = useState<{ user_display_name: string } | null>(null);

  useEffect(() => {
    const userInfo = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user_info='))
      ?.split('=')[1];
    if (userInfo) {
      try {
        const data = JSON.parse(decodeURIComponent(userInfo));
        startTransition(() => setUser(data));
      } catch {}
    }
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  }

  return (
    <>
      <div className="w-full px-4 md:px-20 py-5 bg-white flex justify-between items-center">
        <Link href="/">
          <Image src="/Prag Logo.png" alt="Prag" width={110} height={33} priority className="w-20 md:w-[110px]" style={{ height: 'auto' }} />
        </Link>

        <SearchBox />

        {/* Desktop Hotline & Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 py-2.5">
            <Phone className="w-9 h-9 text-neutral-700/70" />
            <div className="flex flex-col">
              <span className="text-neutral-700/70 text-sm font-bold font-['Space_Grotesk']">Hotline</span>
              <span className="text-neutral-700/70 text-sm font-medium font-['Space_Grotesk']">+2348032170129</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" aria-label="Wishlist" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
              <div className="w-7 h-7 bg-neutral-700/70 mask-heart" />
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative p-2 hover:bg-stone-50 rounded-full transition-colors">
              <ShoppingCart className="w-7 h-7 text-neutral-700/70" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2.5 ml-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-300 rounded-full flex items-center justify-center text-xs font-bold text-neutral-700">
                    {user.user_display_name[0]}
                  </div>
                  <button onClick={handleLogout} className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2.5">
                  <User className="w-7 h-7 text-neutral-700/70" />
                  <span className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] hover:text-sky-700 transition-colors">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/wishlist" aria-label="Wishlist" className="w-4 h-4 relative overflow-hidden">
            <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute bg-neutral-700/70 mask-heart" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="w-4 h-4 relative overflow-hidden">
            <ShoppingCart className="w-3.5 h-3.5 left-[0.67px] top-[1.33px] absolute text-neutral-700/70" />
          </Link>
          <Link href="/account" aria-label="Account" className="w-4 h-4 relative overflow-hidden">
            <User className="w-3.5 h-3.5 left-[1.33px] top-[2px] absolute text-neutral-700/70" />
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden self-stretch p-4 bg-sky-700 flex justify-start items-center gap-4">
        <div className="w-4 h-3 bg-white" />
        <SearchBox mobile />
      </div>
    </>
  );
}
