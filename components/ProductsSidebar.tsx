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
  { id: 1, name: 'Inverters', slug: 'inverter', count: 20, image: null, description: '' },
  { id: 2, name: 'Solar', slug: 'solar', count: 10, image: null, description: '' },
  { id: 3, name: 'Batteries', slug: 'batteries', count: 8, image: null, description: '' },
  { id: 4, name: 'Stabilizers', slug: 'stabilizer', count: 16, image: null, description: '' },
];

export default function ProductsSidebar({ categories, tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeTag = searchParams.get('tag') ?? '';

  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');

  const displayCategories = categories.length ? categories : FALLBACK_CATEGORIES;

  function buildParams(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    params.delete('page');
    return params.toString();
  }

  function toggleCategory(slug: string) {
    router.push(`/products?${buildParams({ category: activeCategory === slug ? null : slug })}`);
  }

  function toggleTag(slug: string) {
    router.push(`/products?${buildParams({ tag: activeTag === slug ? null : slug })}`);
  }

  function applyPrice() {
    const min = minPrice.replace(/[^0-9]/g, '');
    const max = maxPrice.replace(/[^0-9]/g, '');
    router.push(`/products?${buildParams({
      min_price: min || null,
      max_price: max || null,
    })}`);
  }

  function clearAll() {
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  }

  const hasFilters = activeCategory || activeTag || searchParams.get('min_price') || searchParams.get('max_price');

  return (
    <aside className="w-72 shrink-0 p-6 bg-white rounded-xl outline outline-[0.3px] outline-neutral-300 flex flex-col gap-6">

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-red-500 font-medium font-['Space_Grotesk'] hover:text-red-700 text-left"
        >
          ✕ Clear all filters
        </button>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Product Categories</span>
        <div className="flex flex-col gap-2">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.slug)}
              className={`flex justify-between items-center w-full text-left py-1 transition-colors ${
                activeCategory === cat.slug ? 'text-sky-700 font-semibold' : 'text-gray-700 hover:text-sky-700'
              }`}
            >
              <span className="text-sm font-['Space_Grotesk']">{cat.name}</span>
              <span className="text-sky-700 text-xs font-['Space_Grotesk']">({cat.count})</span>
            </button>
          ))}
        </div>
        <div className="w-full h-px bg-stone-100" />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-4">
        <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Price Range</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full h-9 px-3 py-2 bg-white rounded-md outline outline-1 outline-zinc-300 text-zinc-600 text-sm font-['Inter'] focus:outline-sky-700 transition-colors"
          />
          <span className="text-zinc-400 font-semibold shrink-0">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full h-9 px-3 py-2 bg-white rounded-md outline outline-1 outline-zinc-300 text-zinc-600 text-sm font-['Inter'] focus:outline-sky-700 transition-colors"
          />
        </div>
        <button
          onClick={applyPrice}
          className="w-full py-2 bg-sky-700 text-white text-sm font-medium font-['Space_Grotesk'] rounded-lg hover:bg-sky-800 transition-colors"
        >
          Apply Price
        </button>
        <div className="w-full h-px bg-stone-100" />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Product Tags</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-normal font-['Inter'] outline outline-1 transition-colors ${
                  activeTag === tag.slug
                    ? 'outline-sky-700 text-sky-700 bg-sky-50'
                    : 'outline-zinc-300 text-zinc-500 hover:outline-sky-700 hover:text-sky-700'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
