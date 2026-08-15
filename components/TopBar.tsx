'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, X, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/lib/CartContext';
import { formatPhone } from '@/lib/formatPhone';
import type { SiteSettings } from '@/lib/woocommerce';

function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showTip, setShowTip] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function clear() {
    setQuery('');
    setShowTip(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      setShowTip(true);
      if (tipTimer.current) clearTimeout(tipTimer.current);
      tipTimer.current = setTimeout(() => setShowTip(false), 3000);
    } else {
      setShowTip(false);
      if (tipTimer.current) clearTimeout(tipTimer.current);
    }
  }

  useEffect(() => {
    return () => { if (tipTimer.current) clearTimeout(tipTimer.current); };
  }, []);

  return (
    <div className="hidden lg:block relative flex-1 max-w-[566px]">
      <form onSubmit={handleSubmit} className="hidden lg:flex flex-1 max-w-[566px] min-w-[240px] xl:min-w-[320px] h-12 px-3 py-2 bg-white rounded-md border border-gray-300 items-center gap-3 relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for any product..."
          className="flex-1 text-gray-600 text-base font-normal font-['Space_Grotesk'] outline-none bg-transparent"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={clear} aria-label="Clear">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <div className="relative">
          <button type="submit" aria-label="Search">
            <Search className="w-5 h-5 text-slate-500" />
          </button>
          {showTip && (
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-sky-700 text-white text-xs font-medium font-['Montserrat'] rounded-md shadow-lg whitespace-nowrap z-50 animate-bounce">
              Click here
              <div className="absolute -top-1 right-2 w-2 h-2 bg-sky-700 rotate-45" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default function TopBar({ initialUser = null, phone = '+2348032170129', whatsapp = '+2348032170129', settings }: { initialUser?: { user_display_name: string } | null; phone?: string; whatsapp?: string; settings?: SiteSettings }) {
  const router = useRouter();
  const { count } = useCart();
  const [user, setUser] = useState<{ user_display_name: string } | null>(() => initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  }

  function handleMobileSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = mobileQuery.trim();
    if (!value) return;
    setMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <>
      {/* ── Desktop top bar ── */}
      <div className="hidden lg:flex w-full px-4 xl:px-10 2xl:px-20 py-3 bg-white items-center gap-3 xl:gap-4 flex-wrap">
        <Link href="/" aria-label="PRAG home" className="shrink-0">
          <Image src="/Prag Logo.png" alt="PRAG" width={124} height={36} priority className="h-9 w-auto" style={{ width: 'auto', height: '36px' }} />
        </Link>

        <SearchBox />

        {/* Desktop Hotline & Icons */}
        <div className="ml-auto inline-flex items-center gap-2 xl:gap-4 shrink min-w-0 flex-wrap justify-end">
          <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="py-1.5 flex items-center gap-1.5 min-w-0">
            <svg className="w-8 h-8 xl:w-9 xl:h-9 text-neutral-700 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-neutral-700 text-sm xl:text-base font-bold font-['Onest']">Hotline</span>
              <span className="text-neutral-700 text-base md:text-lg xl:text-base font-medium font-['Onest'] whitespace-nowrap">{formatPhone(phone)}</span>
            </div>
          </a>

          <Link href="/wishlist" aria-label="Wishlist" className="w-9 h-9 xl:w-10 xl:h-10 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <svg className="w-7 h-7 text-neutral-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative w-9 h-9 xl:w-10 xl:h-10 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <ShoppingCart className="w-7 h-7 text-neutral-700/70" />
            <span suppressHydrationWarning className={`absolute -top-1 -right-1 bg-sky-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full transition-opacity ${count > 0 ? 'opacity-100' : 'opacity-0'}`}>
              {count || ''}
            </span>
          </Link>

          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                aria-label="Open account menu"
                className="w-9 h-9 bg-sky-700 rounded-full flex items-center justify-center text-white text-sm font-bold font-['Onest'] hover:bg-sky-800 transition-colors"
              >
                {(user.user_display_name?.[0] ?? '?').toUpperCase()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-zinc-900 text-base font-semibold font-['Onest'] truncate">{user.user_display_name}</p>
                  </div>
                  <div className="flex flex-col py-1">
                    <Link href="/account" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-base text-zinc-700 font-['Onest'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/account/profile" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-base text-zinc-700 font-['Onest'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Profile
                    </Link>
                    <Link href="/account/orders" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-base text-zinc-700 font-['Onest'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Orders
                    </Link>
                    <Link href="/wishlist" onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-base text-zinc-700 font-['Onest'] hover:bg-sky-50 hover:text-sky-700 transition-colors">
                      Wishlist
                    </Link>
                    <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="px-4 py-2.5 text-base text-red-500 font-['Onest'] hover:bg-red-50 transition-colors text-left border-t border-gray-100 mt-1">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="p-2.5 flex items-center gap-2 hover:bg-stone-50 rounded-lg transition-colors min-w-0">
              <svg className="w-7 h-7 text-neutral-700/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="8" r="3" />
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.832 2.849" />
              </svg>
              <span className="text-neutral-700/70 text-sm xl:text-lg font-medium font-['Onest'] leading-5">Login or Register</span>
            </Link>
          )}
        </div>

      </div>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(15,23,42,0.08)]">
        <div className="w-full px-4 h-[72px] bg-white flex items-center justify-between gap-3">
          <Link href="/" aria-label="PRAG home" className="shrink-0">
            <Image src="/Prag Logo.png" alt="PRAG" width={138} height={44} priority className="lg:hidden h-11 w-auto" style={{ width: 'auto', height: '44px' }} />
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-label="Open search"
              className="w-11 h-11 flex items-center justify-center rounded-full active:bg-black/5 transition-colors"
            >
              <Search className="w-6 h-6 text-neutral-700/75" />
            </button>
            <Link href="/cart" aria-label="Cart" className="relative w-12 h-12 flex items-center justify-center rounded-full active:bg-black/5 transition-colors">
              <ShoppingCart className="w-6 h-6 text-neutral-700/75" />
              <span suppressHydrationWarning className={`absolute -top-0.5 -right-0.5 bg-sky-700 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full transition-opacity ${count > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {count || ''}
              </span>
            </Link>
            <Link href={user ? '/account' : '/login'} aria-label="Account" className="w-12 h-12 flex items-center justify-center rounded-full active:bg-black/5 transition-colors">
              <svg className="w-6 h-6 text-neutral-700/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="8" r="3" />
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.832 2.849" />
              </svg>
            </Link>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="w-12 h-12 flex items-center justify-center rounded-full active:bg-black/5 transition-colors">
              <Menu className="w-8 h-8 text-neutral-700/75" strokeWidth={2.1} />
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div ref={mobileSearchRef} className="w-full px-4 pb-3 bg-white">
            <form onSubmit={handleMobileSearchSubmit} className="w-full h-14 px-4 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 shadow-sm">
              <input
                type="text"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Search for any product..."
                className="flex-1 text-gray-700 text-base font-normal font-['Space_Grotesk'] outline-none bg-transparent"
                autoComplete="off"
                autoFocus
              />
              <button type="submit" aria-label="Search" className="w-11 h-11 rounded-full bg-sky-700 flex items-center justify-center text-white hover:bg-sky-800 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} settings={settings} />
    </>
  );
}
