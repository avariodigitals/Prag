'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Category, Tag } from '@/lib/types';

interface Props {
  categories: Category[];
  tags: Tag[];
}

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Inverters', slug: 'inverter', count: 20 },
  { id: 2, name: 'Solar', slug: 'solar', count: 10 },
  { id: 3, name: 'Batteries', slug: 'batteries', count: 8 },
  { id: 4, name: 'Stabilizers', slug: 'stabilizer', count: 16 },
];

const FALLBACK_TAGS = [
  'Heavy duty inverter', 'Solar Charge Controllers', 'Tubular batteries',
  'Lithium batteries', 'Off-grid', 'Thyristor stabilizer',
  'Solar Panel', 'Relay Stabilizer', 'Servo Stabilizer',
  '3 phase Stabilizer', 'Battery Racks',
];

export default function ProductsSidebar({ categories, tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '5,000');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '100,000');

  const activeCategory = searchParams.get('category');
  const activeTag = searchParams.get('tag');

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('min_price', minPrice.replace(/,/g, ''));
    params.set('max_price', maxPrice.replace(/,/g, ''));
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;
  const displayTags = tags.length ? tags.map((t) => t.name) : FALLBACK_TAGS;

  function categoryHref(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory === slug) params.delete('category');
    else params.set('category', slug);
    params.delete('page');
    return `/products?${params.toString()}`;
  }

  function tagHref(name: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTag === name) params.delete('tag');
    else params.set('tag', name);
    params.delete('page');
    return `/products?${params.toString()}`;
  }

  return (
    <aside className="w-80 p-8 bg-white rounded-xl outline outline-[0.3px] outline-neutral-500 flex flex-col gap-6 shrink-0">
      {/* Categories */}
      <div className="flex flex-col gap-3">
        <span className="text-gray-900 text-xl font-medium font-['Space_Grotesk']">Product Categories</span>
        <div className="flex flex-col gap-3">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat.slug)}
              className="flex justify-between items-center"
            >
              <span className={`text-sm font-normal font-['Space_Grotesk'] ${activeCategory === cat.slug ? 'text-sky-700 font-medium' : 'text-gray-900'}`}>
                {cat.name}
              </span>
              <span className="text-sky-700 text-sm font-normal font-['Space_Grotesk']">({cat.count})</span>
            </Link>
          ))}
        </div>
        <div className="w-full h-px bg-stone-100" />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-4">
        <span className="text-gray-900 text-xl font-medium font-['Space_Grotesk']">Price Range</span>
        <div className="flex flex-col gap-3">
          <div className="w-full h-3 bg-stone-50 rounded-[20px]" />
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={applyPrice}
              onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
              className="w-24 h-9 px-3 py-2 bg-white rounded-md outline outline-1 outline-zinc-500 text-zinc-500 text-sm font-normal font-['Inter'] text-center"
            />
            <span className="text-zinc-500 text-base font-semibold font-['Inter']">-</span>
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={applyPrice}
              onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
              className="w-24 h-9 px-3 py-2 bg-white rounded-md outline outline-1 outline-zinc-500 text-zinc-500 text-sm font-normal font-['Inter'] text-center"
            />
          </div>
        </div>
        <div className="w-full h-px bg-stone-100" />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-4">
        <span className="text-gray-900 text-xl font-medium font-['Space_Grotesk']">Product tags</span>
        <div className="flex flex-wrap gap-3">
          {displayTags.map((name) => (
            <Link
              key={name}
              href={tagHref(name)}
              className={`p-2 rounded-3xl outline outline-1 text-sm font-normal font-['Inter'] leading-5 transition-colors ${
                activeTag === name
                  ? 'outline-sky-700 text-sky-700 bg-sky-50'
                  : 'outline-zinc-500 text-zinc-500 hover:outline-sky-700 hover:text-sky-700'
              }`}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="w-full h-px bg-stone-100" />
      </div>
    </aside>
  );
}
