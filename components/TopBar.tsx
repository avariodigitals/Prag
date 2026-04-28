'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Phone, ShoppingCart, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, startTransition } from 'react';

import { useCart } from '@/lib/CartContext';

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
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
        startTransition(() => {
          setUser(data);
        });
      } catch (e) {
        console.error('Failed to parse user info', e);
      }
    }
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="w-full px-20 py-5 bg-white flex justify-between items-center">
      <Link href="/">
        <Image src="/Prag Logo.png" alt="Prag" width={110} height={33} priority style={{ height: 'auto' }} />
      </Link>

      <form onSubmit={handleSearch} className="w-[566px] h-12 px-3 py-2 bg-white rounded-md border border-gray-300 flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for any product..."
          className="flex-1 text-gray-400 text-sm font-normal font-['Inter'] outline-none"
        />
        <button type="submit" aria-label="Search">
          <Search className="w-5 h-5 text-slate-500" />
        </button>
      </form>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 py-2.5">
          <Phone className="w-9 h-9 text-neutral-700/70" />
          <div className="flex flex-col">
            <span className="text-neutral-700/70 text-sm font-bold font-['Space_Grotesk']">Hotline</span>
            <span className="text-neutral-700/70 text-sm font-medium font-['Space_Grotesk']">+2348032170129</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist" aria-label="Wishlist" className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <div className="w-7 h-7 bg-neutral-700/70 mask-heart" /> {/* Placeholder for heart icon if lucide doesn't match perfectly */}
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
                <button 
                  onClick={handleLogout}
                  className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] hover:text-sky-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2.5">
                <User className="w-7 h-7 text-neutral-700/70" />
                <span className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] leading-4">Login or Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
