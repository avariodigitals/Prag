'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronDown } from 'lucide-react';
import { formatPrice, productUrl, shopUrl } from '@/lib/woocommerce';
import { useWishlist } from '@/lib/WishlistContext';

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  image: string;
  categories: { id: number; name: string; slug: string }[];
}

export default function WishlistView() {
  const { items, remove, loading } = useWishlist();
  const [sort, setSort] = useState('');

  if (loading) {
    return (
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-white flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div className="h-7 w-40 bg-stone-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-stone-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full h-72 bg-stone-100 rounded-2xl animate-pulse" />
              <div className="flex flex-col items-center gap-3">
                <div className="h-5 w-3/4 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-stone-100 rounded animate-pulse" />
                <div className="flex gap-3 mt-2">
                  <div className="h-10 w-28 bg-stone-100 rounded-full animate-pulse" />
                  <div className="h-10 w-20 bg-stone-100 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    if (sort === 'price') return Number(a.price) - Number(b.price);
    if (sort === 'price-desc') return Number(b.price) - Number(a.price);
    return 0;
  });

  return (
    <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-white flex flex-col gap-10">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <span className="text-black text-base md:text-2xl font-medium font-['Space_Grotesk']">
          {items.length} item{items.length !== 1 ? 's' : ''} saved for Later
        </span>
        <div className="relative">
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="appearance-none p-2.5 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-500 text-neutral-500 text-sm md:text-base font-medium font-['Space_Grotesk'] cursor-pointer">
            <option value="">Sort by</option>
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">No saved items yet.</p>
          <Link href="/products" className="px-8 py-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {sorted.map((item) => (
            <div key={item.id} className="relative flex flex-col gap-4 group">
              <div className="w-full h-72 px-7 relative bg-white flex justify-center items-center overflow-hidden rounded-2xl">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                )}
                {item.on_sale && (
                  <div className="absolute left-5 top-5 w-16 px-2.5 py-5 bg-red-600 rounded-[100px] flex flex-col justify-center items-center overflow-hidden">
                    <span className="text-white text-base font-medium font-['Space_Grotesk']">SALE</span>
                  </div>
                )}
                <button onClick={() => remove(item.id)} aria-label="Remove from wishlist"
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-sky-700 fill-sky-700" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full flex flex-col gap-2">
                  <p className="text-center text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">{item.name}</p>
                  <div className="flex justify-center items-center gap-2">
                    {item.on_sale && item.regular_price && (
                      <span className="text-zinc-400 text-base font-light font-['Onest'] line-through">{formatPrice(item.regular_price)}</span>
                    )}
                    <span className="text-zinc-900 text-base font-light font-['Onest']">{formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <Link href={productUrl({ slug: item.slug, categories: item.categories ?? [] })}
                    className="w-32 p-3 bg-sky-700 rounded-[30px] flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors">
                    <span className="text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</span>
                  </Link>
                  <a href={shopUrl(item.slug)} className="w-28 p-3 rounded-3xl flex justify-center items-center gap-2.5 hover:underline">
                    <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">Buy &gt;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
