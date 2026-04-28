'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronDown } from 'lucide-react';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  image: string;
}

export default function WishlistView() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prag_wishlist');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  function remove(id: number) {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem('prag_wishlist', JSON.stringify(updated));
  }

  const rows = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));

  return (
    <div className="w-full px-20 py-10 bg-white flex flex-col gap-10">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <span className="text-black text-2xl font-medium font-['Space_Grotesk']">
          {items.length} items saved for Later
        </span>
        <div className="relative">
          <select className="appearance-none p-2.5 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-500 text-neutral-500 text-base font-medium font-['Space_Grotesk'] cursor-pointer">
            <option>Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">No saved items yet.</p>
          <Link href="/products" className="px-8 py-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-6">
              {row.map((item) => (
                <div key={item.id} className="flex-1 relative inline-flex flex-col gap-4">
                  <div className="w-full h-72 px-7 relative bg-white flex justify-center items-center overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={220} height={275} className="object-contain h-full w-auto" />
                    )}
                    {item.on_sale && (
                      <div className="absolute left-[87px] top-[49px] w-16 px-2.5 py-5 bg-red-600 rounded-[100px] flex flex-col justify-center items-center overflow-hidden">
                        <span className="text-white text-base font-medium font-['Space_Grotesk']">SALE</span>
                      </div>
                    )}
                    <button onClick={() => remove(item.id)} aria-label="Remove from wishlist"
                      className="absolute top-[20px] right-[20px]">
                      <Heart className="w-5 h-5 text-sky-700 fill-sky-700" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full flex flex-col gap-2">
                      <p className="text-center text-zinc-900 text-lg font-medium font-['Onest']">{item.name}</p>
                      <div className="flex justify-center items-center">
                        {item.on_sale && item.regular_price && (
                          <span className="w-20 text-center text-zinc-900 text-base font-light font-['Onest'] line-through">
                            {formatPrice(item.regular_price)}
                          </span>
                        )}
                        <span className="w-28 text-center text-zinc-900 text-base font-light font-['Onest']">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <Link href={`/products/${item.slug}`}
                        className="w-32 p-3 bg-sky-700 rounded-[30px] flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors">
                        <span className="text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</span>
                      </Link>
                      <a href={shopUrl(item.slug)}
                        className="w-28 p-3 rounded-3xl flex justify-center items-center gap-2.5 hover:underline">
                        <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">Buy &gt;</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
