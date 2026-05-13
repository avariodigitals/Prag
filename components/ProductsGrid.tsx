'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import type { Product, Category, Tag } from '@/lib/types';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
  categories?: Category[];
  tags?: Tag[];
}

function dedupeCategories(input: Category[]): Category[] {
  const bySlug = new Map<string, Category>();

  for (const cat of input) {
    const slug = (cat.slug ?? '').trim();
    if (!slug) continue;

    const existing = bySlug.get(slug);
    if (!existing) {
      bySlug.set(slug, { ...cat, count: Number(cat.count ?? 0) });
      continue;
    }

    bySlug.set(slug, {
      ...existing,
      count: Number(existing.count ?? 0) + Number(cat.count ?? 0),
    });
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}

const SORT_OPTIONS = [
  { label: 'Default: Size + Price (Low to High)', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const PER_PAGE = 16;

export default function ProductsGrid({ products, total, categories = [], tags = [] }: Props) {
  const searchParams = useSearchParams();
  const resetKey = [
    String(total),
    products.map((product) => product.id).join(','),
    searchParams.toString(),
  ].join('::');

  return <ProductsGridContent key={resetKey} products={products} total={total} categories={categories} tags={tags} />;
}

function ProductsGridContent({ products, total, categories = [], tags = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');
  const [items, setItems] = useState<Product[]>(products);
  const [page, setPage] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const activeCategory = searchParams.get('category') ?? '';
  const activeTag = searchParams.get('tag') ?? '';
  const displayCategories = dedupeCategories(categories);

  const loadMore = useEffectEvent(async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      const res = await fetch(`/api/products/list?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      const newProducts: Product[] = data.products ?? [];

      setItems((prev) => {
        const ids = new Set(prev.map((product) => product.id));
        return [...prev, ...newProducts.filter((product) => !ids.has(product.id))];
      });
      setPage((currentPage) => currentPage + 1);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoadingMore(false);
    }
  });

  useEffect(() => {
    if (!hasMore || loadingMore) return;
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
  }, [hasMore, loadingMore, page, searchKey]);

  function buildParams(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    params.delete('page');
    return params.toString();
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('sort', value);
    else params.delete('sort');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  function toggleCategory(slug: string) {
    router.push(`/products?${buildParams({ category: activeCategory === slug ? null : slug })}`);
    setDrawerOpen(false);
  }

  function toggleTag(slug: string) {
    router.push(`/products?${buildParams({ tag: activeTag === slug ? null : slug })}`);
    setDrawerOpen(false);
  }

  function applyPrice() {
    router.push(`/products?${buildParams({
      min_price: minPrice || null,
      max_price: maxPrice || null,
    })}`);
    setDrawerOpen(false);
  }

  function clearAll() {
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
    setDrawerOpen(false);
  }

  const hasFilters = activeCategory || activeTag || searchParams.get('min_price') || searchParams.get('max_price');

  return (
    <div className="flex-1 flex flex-col gap-5 min-w-0">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <span className="text-black text-base md:text-2xl font-medium font-['Montserrat']">
          {total} result{total !== 1 ? 's' : ''}
        </span>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          {/* Mobile filter button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg outline outline-1 outline-neutral-300 text-neutral-600 text-sm font-medium font-['Montserrat']"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-sky-700 rounded-full" />}
          </button>

          {/* Sort */}
          <div className="relative flex-1 sm:flex-none min-w-0">
            <select
              value={searchParams.get('sort') ?? ''}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full sm:w-auto px-3 py-2 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-400 text-neutral-500 text-sm md:text-base font-medium font-['Montserrat'] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
          <p className="text-gray-400 text-lg font-['Montserrat']">No products found.</p>
          {hasFilters && (
            <button onClick={clearAll} className="text-sky-700 text-sm font-medium font-['Montserrat'] underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-white" />
          ))}
        </div>
      )}

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
        <p className="text-center text-zinc-400 text-xs font-['Montserrat'] py-2">All products loaded</p>
      )}

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="text-zinc-900 text-lg font-semibold font-['Montserrat']">Filters</span>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {hasFilters && (
              <button onClick={clearAll} className="text-xs text-red-500 font-medium font-['Montserrat'] text-left">
                ✕ Clear all filters
              </button>
            )}

            {/* Categories */}
            {displayCategories.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-gray-900 text-base font-semibold font-['Montserrat']">Categories</span>
                <div className="flex flex-col gap-2">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.slug)}
                      className={`flex justify-between items-center w-full text-left py-2 border-b border-stone-100 transition-colors ${
                        activeCategory === cat.slug ? 'text-sky-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-base md:text-lg font-['Montserrat']">{cat.name}</span>
                      <span className="text-sky-700 text-xs font-['Montserrat']">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-900 text-base font-semibold font-['Montserrat']">Price Range</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full h-10 px-3 bg-white rounded-md outline outline-1 outline-zinc-300 text-zinc-600 text-sm font-['Inter'] focus:outline-sky-700"
                />
                <span className="text-zinc-400 font-semibold shrink-0">—</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full h-10 px-3 bg-white rounded-md outline outline-1 outline-zinc-300 text-zinc-600 text-sm font-['Inter'] focus:outline-sky-700"
                />
              </div>
              <button
                onClick={applyPrice}
                className="w-full py-2.5 bg-sky-700 text-white text-sm font-medium font-['Montserrat'] rounded-lg hover:bg-sky-800 transition-colors"
              >
                Apply Price
              </button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-gray-900 text-base font-semibold font-['Montserrat']">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-['Inter'] outline outline-1 transition-colors ${
                        activeTag === tag.slug
                          ? 'outline-sky-700 text-sky-700 bg-sky-50'
                          : 'outline-zinc-300 text-zinc-500'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
