'use client';

import { useEffect, useEffectEvent, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { sortProductsBySizeThenPrice } from '@/lib/productSort';

interface Subcategory {
  label: string;
  slug: string;
}

interface Props {
  products: Product[];
  total: number;
  categorySlug: string;
  activeSub?: string;
  subcategories?: Subcategory[];
}

const PER_PAGE = 16;

const SLUG_TO_LABEL: Record<string, string> = {
  'voltage-stabilizers': 'All Stabilizers',
  'all-prag-stabilizers': 'All Stabilizers',
  'inverters': 'All Inverters',
  'solar': 'All Solar Products',
  'batteries': 'All Batteries',
};
const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

export default function CategoryProductsGrid({
  products: initialProducts,
  total,
  categorySlug,
  activeSub,
  subcategories,
}: Props) {
  const searchParams = useSearchParams();
  const resetKey = [
    categorySlug,
    activeSub ?? '',
    String(total),
    initialProducts.map((product) => product.id).join(','),
    searchParams.toString(),
  ].join('::');

  return (
    <CategoryProductsGridContent
      key={resetKey}
      products={initialProducts}
      total={total}
      categorySlug={categorySlug}
      activeSub={activeSub}
      subcategories={subcategories}
    />
  );
}

function CategoryProductsGridContent({
  products: initialProducts,
  total,
  categorySlug,
  activeSub,
  subcategories,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>(sortProductsBySizeThenPrice(initialProducts));
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const loadMore = useEffectEvent(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', categorySlug);
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      if (activeSub) params.set('sub', activeSub);

      const res = await fetch(`/api/products/category?${params.toString()}`, {
        priority: 'high',
      });
      if (!res.ok) return;
      const data = await res.json();
      const newProducts: Product[] = data.products ?? [];

      setProducts((prev) => {
        const ids = new Set(prev.map((product) => product.id));
        const merged = [...prev, ...newProducts.filter((product) => !ids.has(product.id))];
        return sortProductsBySizeThenPrice(merged);
      });
      setPage((currentPage) => currentPage + 1);
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  });

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, page, activeSub]);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete('page');
    params.delete('sort');
    // track which tab was clicked
    if ('sub' in updates) setPendingTab(updates.sub ?? 'all');
    startTransition(() => {
      router.push(`/products/${categorySlug}?${params.toString()}`);
    });
  }

  const activePendingTab = isPending ? pendingTab : null;

  const allLabel = SLUG_TO_LABEL[categorySlug] ?? `All ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`;
  const sectionSubs = subcategories ?? [];
  const tabs = [
    { key: 'all', label: allLabel, slug: undefined },
    ...sectionSubs.map((s) => ({ key: s.slug, label: s.label, slug: s.slug })),
  ];

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="md:hidden -mx-4 px-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-3 pr-6">
            {tabs.map((tab) => {
              const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => navigate({ sub: tab.slug })}
                  className={`shrink-0 rounded-full px-6 py-3.5 text-lg font-semibold font-['Onest'] leading-none whitespace-nowrap transition-colors ${isActive ? 'bg-sky-700 text-white' : 'bg-sky-50 text-[#1a1a1a] hover:bg-sky-100'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-start gap-4 overflow-x-auto">
          <div className="flex items-stretch gap-0 border-b border-[#e4e7ec] flex-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
              const tabKey = tab.slug ?? 'all';
              const isTabPending = activePendingTab === tabKey;
              return (
                <button key={tab.key} onClick={() => navigate({ sub: tab.slug })} className="inline-flex flex-col items-center shrink-0">
                  <span className={`px-4 py-3 text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${isActive ? 'text-[#0166a5]' : 'text-[#1a1a1a] hover:text-[#0166a5]'}`}>
                    {tab.label}
                    {isTabPending && (
                      <svg className="ml-1 inline w-3 h-3 text-[#0166a5] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    )}
                  </span>
                  <div className={`h-[2px] w-full ${isActive ? 'bg-[#0166a5]' : 'bg-[#e4e7ec]'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="h-56 md:h-64 bg-stone-100 rounded-xl" />
              <div className="h-3 w-3/4 bg-stone-200 rounded" />
              <div className="h-3 w-1/2 bg-stone-200 rounded" />
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-stone-200 rounded-full" />
                <div className="flex-1 h-8 bg-stone-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-400 text-base md:text-lg font-['Montserrat']">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-stone-50" priceColor={LISTING_PRICE_COLOR} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center py-6">
          <svg className="w-7 h-7 text-sky-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

    </div>
  );
}
