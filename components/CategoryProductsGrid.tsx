'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
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

const PER_PAGE = 9;

export default function CategoryProductsGrid({
  products,
  total,
  subcategories,
  categorySlug,
  activeSub,
  activeSort,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentPage = Number(searchParams.get('page') ?? 1);
  const totalPages = Math.ceil(total / PER_PAGE);

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete('page');
    startTransition(() => router.push(`/products/${categorySlug}?${params.toString()}`));
  }

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => router.push(`/products/${categorySlug}?${params.toString()}`));
  }

  const SLUG_TO_LABEL: Record<string, string> = {
    'voltage-stabilizers': 'All Stabilizers',
    'inverters': 'All Inverters',
    'solar': 'All Solar Products',
    'batteries': 'All Batteries',
  };

  // Hardcoded subcategory tabs per section — pulled from WP category IDs
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

  const allLabel = SLUG_TO_LABEL[categorySlug] ?? `All ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`;
  const sectionSubs = SECTION_TABS[categorySlug] ?? [];
  const tabs = [
    { key: 'all', label: allLabel, slug: undefined },
    ...sectionSubs.map((s) => ({ key: s.slug, label: s.label, slug: s.slug })),
  ];

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Client-nav loading overlay */}
      {isPending && (
        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center rounded-xl">
          <svg className="w-10 h-10 text-sky-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Subcategory tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.slug ? activeSub === tab.slug : !activeSub;
            return (
              <button
                key={tab.key}
                onClick={() => navigate({ sub: tab.slug })}
                className="inline-flex flex-col items-center shrink-0"
              >
                <span className={`px-3 md:px-4 pt-3 pb-3 text-xs md:text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap transition-colors ${
                  isActive ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'
                }`}>
                  {tab.label}
                </span>
                <div className={`h-0.5 w-full rounded-full ${isActive ? 'bg-sky-700' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        {/* Sort */}
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
      {products.length === 0 ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-stone-50" />
          ))}
        </div>
      )}

      {/* Smart Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg text-sm font-medium font-['Space_Grotesk'] outline outline-1 outline-neutral-300 text-neutral-500 hover:outline-sky-700 hover:text-sky-700 disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>

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
                <span key={`e-${i}`} className="w-9 text-center text-neutral-400 text-sm">…</span>
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

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium font-['Space_Grotesk'] outline outline-1 outline-neutral-300 text-neutral-500 hover:outline-sky-700 hover:text-sky-700 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
