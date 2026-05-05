'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import type { Product, Category } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
  subcategories: Category[];
  categorySlug: string;
  activeSub?: string;
  activeSort?: string;
}

const SORT_OPTIONS = [
  { label: 'Sort by', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const PER_PAGE = 24;

const SLUG_TO_LABEL: Record<string, string> = {
  'voltage-stabilizers': 'All Stabilizers',
  'inverters': 'All Inverters',
  'solar': 'All Solar Products',
  'batteries': 'All Batteries',
};

const SECTION_TABS: Record<string, { label: string; slug: string }[]> = {
  'voltage-stabilizers': [
    { label: 'Thyristor Stabilizers', slug: 'thyristor-stabilizers' },
    { label: 'Relay Stabilizers',     slug: 'relay-voltage-stabilizers' },
    { label: 'Servo Stabilizers',     slug: 'servo-voltage-stabilizers' },
    { label: '3 Phase Stabilizers',   slug: 'advanced-stabilizers' },
  ],
  'inverters': [
    { label: 'Hybrid Inverters',      slug: 'hybrid-inverters' },
    { label: 'Heavy-Duty Inverters',  slug: 'heavy-duty-inverters' },
    { label: 'Pure Sine Wave',        slug: 'pure-sine-inverters' },
  ],
  'solar': [
    { label: 'Solar Panels',          slug: 'solar-panels' },
    { label: 'Solar Charge Controllers', slug: 'solar-charge-controllers' },
    { label: 'Protective Devices',    slug: 'protective-device' },
  ],
  'batteries': [
    { label: 'Tubular Batteries',     slug: 'tubular-batteries' },
    { label: 'Lithium Batteries',     slug: 'lithium-battery' },
    { label: 'Battery Racks',         slug: 'battery-rack' },
  ],
};

export default function CategoryProductsGrid({
  products: initialProducts,
  total,
  categorySlug,
  activeSub,
  activeSort,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < total);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when tab/sort changes
  useEffect(() => {
    setProducts(initialProducts);
    setPage(2);
    setHasMore(initialProducts.length < total);
  }, [initialProducts, total]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, page, activeSub, activeSort]);

  async function loadMore() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', categorySlug);
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      if (activeSub) params.set('sub', activeSub);
      if (activeSort) params.set('sort', activeSort);

      const res = await fetch(`/api/products/category?${params.toString()}`, {
        priority: 'high',
      });
      if (!res.ok) return;
      const data = await res.json();
      const newProducts: Product[] = data.products ?? [];

      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newProducts.filter((p) => !ids.has(p.id))];
      });
      setPage((p) => p + 1);
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }

  const [pendingTab, setPendingTab] = useState<string | null>(null);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete('page');
    // track which tab was clicked
    if ('sub' in updates) setPendingTab(updates.sub ?? 'all');
    startTransition(() => {
      router.push(`/products/${categorySlug}?${params.toString()}`);
    });
  }

  // clear pending tab once transition completes
  useEffect(() => {
    if (!isPending) setPendingTab(null);
  }, [isPending]);

  const allLabel = SLUG_TO_LABEL[categorySlug] ?? `All ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`;
  const sectionSubs = SECTION_TABS[categorySlug] ?? [];
  const tabs = [
    { key: 'all', label: allLabel, slug: undefined },
    ...sectionSubs.map((s) => ({ key: s.slug, label: s.label, slug: s.slug })),
  ];

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex border-b border-gray-200 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
            const tabKey = tab.slug ?? 'all';
            const isTabPending = isPending && pendingTab === tabKey;
            return (
              <button
                key={tab.key}
                onClick={() => navigate({ sub: tab.slug })}
                className="inline-flex flex-col items-center shrink-0"
              >
                <span className={`px-3 md:px-4 pt-3 pb-3 text-xs md:text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'
                }`}>
                  {tab.label}
                  {isTabPending && (
                    <svg className="w-3 h-3 text-sky-700 animate-spin shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                </span>
                <div className={`h-0.5 w-full rounded-full ${isActive ? 'bg-sky-700' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0">
          <select
            value={activeSort ?? ''}
            onChange={(e) => navigate({ sort: e.target.value || undefined })}
            className="appearance-none p-2.5 pr-8 bg-white rounded-lg outline outline-[0.3px] outline-neutral-500 text-neutral-500 text-sm font-medium font-['Space_Grotesk'] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
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
          <p className="text-gray-400 text-sm font-['Space_Grotesk']">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-stone-50" />
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

      {!hasMore && products.length > 0 && (
        <p className="text-center text-zinc-400 text-xs font-['Space_Grotesk'] py-4">All products loaded</p>
      )}
    </div>
  );
}
