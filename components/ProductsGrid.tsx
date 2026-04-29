'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product, Category, Tag } from '@/lib/types';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
  categories?: Category[];
  tags?: Tag[];
}

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const PER_PAGE = 9;

export default function ProductsGrid({ products, total, categories = [], tags = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') ?? 1);
  const totalPages = Math.ceil(total / PER_PAGE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');

  const activeCategory = searchParams.get('category') ?? '';
  const activeTag = searchParams.get('tag') ?? '';

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

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
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
    <div className="flex-1 flex flex-col gap-6 md:gap-10 min-w-0">

      {/* Toolbar */}
      <div className="flex justify-between items-center gap-4">
        <span className="text-black text-base md:text-2xl font-medium font-['Space_Grotesk']">
          {total} result{total !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg outline outline-1 outline-neutral-300 text-neutral-600 text-sm font-medium font-['Space_Grotesk']"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-sky-700 rounded-full" />}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={searchParams.get('sort') ?? ''}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none px-3 py-2 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-400 text-neutral-500 text-sm md:text-base font-medium font-['Space_Grotesk'] cursor-pointer"
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
      {products.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">No products found.</p>
          {hasFilters && (
            <button onClick={clearAll} className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-white" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {/* Prev */}
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg text-sm font-medium font-['Space_Grotesk'] outline outline-1 outline-neutral-300 text-neutral-500 hover:outline-sky-700 hover:text-sky-700 disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>

          {/* Page numbers */}
          {(() => {
            const pages: (number | '...')[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              if (currentPage > 3) pages.push('...');
              for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
              }
              if (currentPage < totalPages - 2) pages.push('...');
              pages.push(totalPages);
            }
            return pages.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="w-9 text-center text-neutral-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-9 h-9 rounded-full text-sm font-medium font-['Space_Grotesk'] transition-colors ${
                    p === currentPage
                      ? 'bg-sky-700 text-white'
                      : 'bg-white text-neutral-500 outline outline-1 outline-neutral-300 hover:outline-sky-700 hover:text-sky-700'
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium font-['Space_Grotesk'] outline outline-1 outline-neutral-300 text-neutral-500 hover:outline-sky-700 hover:text-sky-700 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="text-zinc-900 text-lg font-semibold font-['Space_Grotesk']">Filters</span>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {hasFilters && (
              <button onClick={clearAll} className="text-xs text-red-500 font-medium font-['Space_Grotesk'] text-left">
                ✕ Clear all filters
              </button>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Categories</span>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.slug)}
                      className={`flex justify-between items-center w-full text-left py-2 border-b border-stone-100 transition-colors ${
                        activeCategory === cat.slug ? 'text-sky-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-['Space_Grotesk']">{cat.name}</span>
                      <span className="text-sky-700 text-xs font-['Space_Grotesk']">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Price Range</span>
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
                className="w-full py-2.5 bg-sky-700 text-white text-sm font-medium font-['Space_Grotesk'] rounded-lg hover:bg-sky-800 transition-colors"
              >
                Apply Price
              </button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-gray-900 text-base font-semibold font-['Space_Grotesk']">Tags</span>
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
