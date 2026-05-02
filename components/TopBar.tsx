'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, X, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, startTransition } from 'react';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/lib/types';
import { productUrl } from '@/lib/woocommerce';

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
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const loading = query.length >= 2 && results.length === 0 && open === false;

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      startTransition(() => {
        setResults([]);
        setOpen(false);
      });
      return;
    }
    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        startTransition(() => {
          setResults(data.products?.slice(0, 6) ?? []);
          setOpen(true);
        });
      });
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
    router.push(productUrl(product));
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
    : "hidden md:flex flex-1 max-w-[566px] h-12 px-3 py-2 bg-white rounded-md border border-gray-300 items-center gap-3 relative";

  return (
    <div ref={containerRef} className={mobile ? 'flex-1 relative' : 'hidden md:block relative flex-1 max-w-[566px]'}>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const userInfo = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user_info='))
      ?.split('=')[1];
    if (userInfo) {
      try {
        const data = JSON.parse(decodeURIComponent(userInfo));
        if (data?.user_display_name) startTransition(() => setUser(data));
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
        <Link href="/" className="shrink-0">
          <Image src="/Prag Logo.png" alt="Prag" width={140} height={40} priority className="h-8 md:h-10 w-auto" style={{ width: 'auto' }} />
        </Link>

        <SearchBox />

        {/* Desktop Hotline & Icons */}
        <div className="hidden md:inline-flex items-center gap-6">
          <a href="https://wa.me/2348032170129" target="_blank" rel="noopener noreferrer" className="py-2.5 flex items-center gap-1">
            <svg className="w-9 h-9 text-neutral-700/70" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div className="w-28 flex flex-col">
              <span className="text-neutral-700/70 text-sm font-bold font-['Space_Grotesk']">Hotline</span>
              <span className="text-neutral-700/70 text-sm font-medium font-['Space_Grotesk']">+2348032170129</span>
            </div>
          </a>

          <Link href="/wishlist" aria-label="Wishlist" className="w-9 h-9 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <svg className="w-7 h-7 text-neutral-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative w-9 h-9 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <ShoppingCart className="w-7 h-7 text-neutral-700/70" />
            {count > 0 && (
              <span suppressHydrationWarning className="absolute -top-1 -right-1 bg-sky-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="w-9 h-9 bg-sky-700 rounded-full flex items-center justify-center text-white text-sm font-bold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
              >
                {(user.user_display_name?.[0] ?? '?').toUpperCase()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-zinc-900 text-sm font-semibold font-['Space_Grotesk'] truncate">{user.user_display_name}</p>
                  </div>
                  <div className="flex flex-col py-1">
                    <Link href="/account" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/account/profile" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Profile
                    </Link>
                    <Link href="/account/orders" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Orders
                    </Link>
                    <Link href="/wishlist" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Wishlist
                    </Link>
                    <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="px-4 py-2.5 text-sm text-red-500 font-['Space_Grotesk'] hover:bg-red-50 transition-colors text-left border-t border-gray-100 mt-1">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="p-2.5 flex items-center gap-2.5 hover:bg-stone-50 rounded-lg transition-colors">
              <svg className="w-7 h-7 text-neutral-700/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="8" r="3" />
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.832 2.849" />
              </svg>
              <span className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] leading-4">Login or Register</span>
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/wishlist" aria-label="Wishlist" className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4 text-neutral-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative w-5 h-5 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-neutral-700/70" />
            {count > 0 && (
              <span suppressHydrationWarning className="absolute -top-1 -right-1 bg-sky-700 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>
          <Link href={user ? '/account' : '/login'} aria-label="Account" className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4 text-neutral-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="8" r="3" />
              <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.832 2.849" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden self-stretch p-4 bg-sky-700 flex justify-start items-center gap-4">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="shrink-0">
          <Menu className="w-5 h-5 text-white" />
        </button>
        <SearchBox mobile />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
