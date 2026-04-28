'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Phone, ShoppingCart, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCart } from '@/lib/CartContext';

export default function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { count } = useCart();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <div className="w-full px-20 py-5 bg-white flex justify-between items-center">
      <Link href="/">
        <Image src="/Prag Logo.png" alt="Prag" width={110} height={33} priority />
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
          <Phone className="w-7 h-7 text-neutral-700/70" />
          <div className="flex flex-col">
            <span className="text-neutral-700/70 text-sm font-bold font-['Space_Grotesk']">Hotline</span>
            <span className="text-neutral-700/70 text-sm font-medium font-['Space_Grotesk']">+2348032170129</span>
          </div>
        </div>

        <Link href="/cart" aria-label="Cart" className="relative">
          <ShoppingCart className="w-7 h-7 text-neutral-700/70" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sky-700 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>

        <Link
          href={`${process.env.NEXT_PUBLIC_SHOP_URL}/my-account`}
          className="flex items-center gap-2 p-2.5"
        >
          <User className="w-7 h-7 text-neutral-700/70" />
          <span className="text-neutral-700/70 text-base font-medium font-['Space_Grotesk'] leading-4">
            Login or Register
          </span>
        </Link>
      </div>
    </div>
  );
}
