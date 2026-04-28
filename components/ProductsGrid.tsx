'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface Props {
  products: Product[];
  total: number;
}

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'date' },
];

const PER_PAGE = 9;

export default function ProductsGrid({ products, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') ?? 1);
  const totalPages = Math.ceil(total / PER_PAGE);

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

  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <span className="text-black text-2xl font-medium font-['Space_Grotesk']">
          Showing all {total} results
        </span>
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
      {products.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-gray-400 text-lg font-['Space_Grotesk']">No products found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {[0, 3, 6].map((start) => {
            const row = products.slice(start, start + 3);
            if (!row.length) return null;
            return (
              <div key={start} className="flex gap-6">
                {row.map((product) => (
                  <ProductCard key={product.id} product={product} bg="bg-white" />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`w-9 h-9 rounded-full text-sm font-medium font-['Space_Grotesk'] transition-colors ${
                page === currentPage
                  ? 'bg-sky-700 text-white'
                  : 'bg-white text-neutral-500 outline outline-1 outline-neutral-300 hover:outline-sky-700 hover:text-sky-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
