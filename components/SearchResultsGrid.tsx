'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
  query: string;
}

const SORT_OPTIONS = [
  { label: 'Default: Size + Price (Low to High)', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const PER_PAGE = 16;

export default function SearchResultsGrid({ products, total, query }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Product[]>(products);
  const [page, setPage] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(products);
    setPage(2);
    setHasMore(products.length < total);
  }, [products, total]);

  useEffect(() => {
    if (!hasMore || loadingMore || !query) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '220px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, page, query, searchParams.toString()]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query);
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      const res = await fetch(`/api/products/search?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      const newProducts: Product[] = data.products ?? [];

      setItems((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newProducts.filter((p) => !ids.has(p.id))];
      });
      setPage((p) => p + 1);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoadingMore(false);
    }
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('sort', value);
    else params.delete('sort');
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <p className="text-sm md:text-2xl font-medium font-['Space_Grotesk']">
          <span className="text-zinc-500">Found</span>
          <span className="text-black"> {total} </span>
          <span className="text-zinc-500">results for</span>
          <span className="text-black"> &quot;{query}&quot;</span>
        </p>

        <div className="relative">
          <select
            defaultValue={searchParams.get('sort') ?? ''}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none p-2.5 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-500 text-neutral-500 text-base font-medium font-['Space_Grotesk'] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">
            {query ? `No results found for "${query}".` : 'Enter a search term above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-white" />
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-stone-50 mt-2" />

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-4">
          <svg className="w-6 h-6 text-sky-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-zinc-400 text-xs font-['Space_Grotesk'] py-2">All products loaded</p>
      )}
    </div>
  );
}
