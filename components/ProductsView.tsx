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
}

const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

export default function ProductsView({ allProducts, productsByCategory, categories, categoryOrder, subcategoryOrder }: Props) {
  const [activeTop, setActiveTop] = useState('all');
  const [activeSub, setActiveSub] = useState<string | null>(null);

  // Build dynamic top-level tabs from categories + order
  const orderMap = new Map((categoryOrder ?? []).map((slug, i) => [slug, i]));
  const parentCats = categories
    .filter(c => c.parent === 0)
    .sort((a, b) => {
      const aIdx = orderMap.get(a.slug);
      const bIdx = orderMap.get(b.slug);
      if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
      if (aIdx !== undefined) return -1;
      if (bIdx !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });

  const TOP_CATEGORIES = [
    { label: 'All products', slug: 'all' },
    ...parentCats.map(c => ({ label: c.name, slug: c.slug })),
  ];

  const topCat = categories.find((category) => category.slug === activeTop);

  // Subcategories of the active top category, sorted by subcategoryOrder
  const activeParentSlug = activeTop;
  const subOrder = subcategoryOrder?.[activeParentSlug] ?? [];
  const subcategories = topCat
    ? categories
        .filter((category) => category.parent === topCat.id && category.count > 0)
        .sort((a, b) => {
          const aIdx = subOrder.indexOf(a.slug);
          const bIdx = subOrder.indexOf(b.slug);
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
          if (aIdx !== -1) return -1;
          if (bIdx !== -1) return 1;
          return a.name.localeCompare(b.name);
        })
    : [];

  let products: Product[];
  if (activeTop === 'all') {
    products = allProducts;
  } else if (activeSub) {
    products = productsByCategory[activeSub] ?? [];
  } else {
    products = productsByCategory[activeTop] ?? [];
  }

  products = sortProductsBySizeThenPrice(products);

  function handleTopChange(slug: string) {
    setActiveTop(slug);
    setActiveSub(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="-mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 min-w-max md:min-w-0 md:flex-wrap pb-1">
          {TOP_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleTopChange(category.slug)}
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

      {subcategories.length > 0 && (
        <div className="flex items-center gap-6 border-b border-zinc-200 overflow-x-auto pb-0">
          <button
            onClick={() => setActiveSub(null)}
            className={`pb-3 text-sm font-medium font-['Onest'] whitespace-nowrap border-b-2 transition-colors ${
              !activeSub
                ? 'border-sky-700 text-sky-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            All {topCat?.name}
          </button>
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setActiveSub(subcategory.slug)}
              className={`pb-3 text-sm font-medium font-['Onest'] whitespace-nowrap border-b-2 transition-colors ${
                activeSub === subcategory.slug
                  ? 'border-sky-700 text-sky-700'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-zinc-400 text-center py-16 font-['Onest']">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => {
            const isNew = product.tags?.some((tag) => tag.slug === 'new' || tag.name.toLowerCase().includes('new')) ?? false;
            return (
              <ProductCard
                key={product.id}
                product={product}
                isNew={isNew}
                bg="bg-white"
                priceColor={LISTING_PRICE_COLOR}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
