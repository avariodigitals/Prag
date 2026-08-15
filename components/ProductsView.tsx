'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product, Category } from '@/lib/types';
import { sortProductsBySizeThenPrice } from '@/lib/productSort';

interface Props {
  allProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  categories: Category[];
  categoryOrder?: string[];
  subcategoryOrder?: Record<string, string[]>;
  onSaleProducts?: Product[];
}

export default function ProductsView({ allProducts, productsByCategory, categories, categoryOrder, onSaleProducts = [] }: Props) {
  const [activeTop, setActiveTop] = useState('all');

  // Build top-level tabs from categoryOrder (explicit list of top-level slugs)
  // Falls back to parent===0 categories if no order is provided
  const orderedSlugs = (categoryOrder ?? []).filter((slug) => categories.some((c) => c.slug === slug));
  const parentCats = orderedSlugs.length > 0
    ? orderedSlugs
        .map((slug) => categories.find((c) => c.slug === slug))
        .filter((c): c is Category => Boolean(c))
    : categories
        .filter((c) => c.parent === 0)
        .sort((a, b) => a.name.localeCompare(b.name));

  const TOP_CATEGORIES = [
    { label: 'All products', slug: 'all' },
    ...parentCats.map(c => ({ label: c.name, slug: c.slug })),
    ...(onSaleProducts.length > 0 ? [{ label: 'Sales', slug: '__sales__' }] : []),
  ];

  let products: Product[];
  if (activeTop === 'all') {
    products = allProducts;
  } else if (activeTop === '__sales__') {
    products = onSaleProducts;
  } else {
    products = productsByCategory[activeTop] ?? [];
  }

  products = sortProductsBySizeThenPrice(products);
  const total = products.length;

  const activeLabel = TOP_CATEGORIES.find((c) => c.slug === activeTop)?.label ?? 'All products';

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="-mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 min-w-max md:min-w-0 md:flex-wrap pb-1">
          {TOP_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveTop(category.slug)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium font-['Onest'] border transition-colors ${
                activeTop === category.slug
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-sky-700 hover:text-sky-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-[22px] md:text-2xl font-medium font-['Montserrat'] leading-relaxed">
          <span className="text-zinc-500">{total}</span>
          <span className="text-zinc-500"> {total === 1 ? 'product' : 'products'}</span>
          {activeTop !== 'all' && <span className="text-zinc-500"> in </span>}
          {activeTop !== 'all' && <span className="text-black">{activeLabel}</span>}
        </p>
      </div>

      {/* Grid — same layout as search results */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-400 text-lg font-['Montserrat']">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-white" />
          ))}
        </div>
      )}
    </div>
  );
}
