'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { Product, Category } from '@/lib/types';
import { formatPrice, shopUrl } from '@/lib/woocommerce';

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

// Spec rows to display — maps WooCommerce attribute names to display labels
const SPEC_ROWS = [
  { key: 'price',        label: 'Price' },
  { key: 'pa_capacity',  label: 'Capacity' },
  { key: 'pa_voltage',   label: 'Voltage' },
  { key: 'pa_phase',     label: 'Phase' },
  { key: 'pa_efficiency',label: 'Efficiency' },
  { key: 'pa_warranty',  label: 'Warranty' },
  { key: 'pa_features',  label: 'Features' },
  { key: 'pa_applications', label: 'Applications' },
];

function getAttr(product: Product, key: string): string[] {
  if (key === 'price') return [formatPrice(product.price)];
  const attr = (product as unknown as { attributes?: { slug: string; options: string[] }[] })
    .attributes?.find((a) => a.slug === key);
  return attr?.options ?? [];
}

function FeatureList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      {values.map((v) => (
        <div key={v} className="flex items-center gap-2">
          <span className="text-sky-700 text-base font-normal font-['Space_Grotesk']">✓</span>
          <span className="text-stone-500 text-base font-normal font-['Space_Grotesk'] leading-6">{v}</span>
        </div>
      ))}
    </div>
  );
}

function TagList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <span key={v} className="px-2 py-1 bg-sky-700/10 rounded-[20px] text-sky-700 text-xs font-medium font-['Space_Grotesk'] leading-5">{v}</span>
      ))}
    </div>
  );
}

export default function CompareView({ initialProducts }: Omit<Props, 'categories'>) {
  const router = useRouter();
  const [products, setProducts] = useState<(Product | null)[]>([
    initialProducts[0] ?? null,
    initialProducts[1] ?? null,
  ]);
  const [searches, setSearches] = useState(['', '']);

  function updateUrl(p1: Product | null, p2: Product | null) {
    const params = new URLSearchParams();
    if (p1) params.set('p1', p1.slug);
    if (p2) params.set('p2', p2.slug);
    router.push(`/compare?${params.toString()}`);
  }

  async function selectProduct(idx: number, slug: string) {
    if (!slug) {
      const updated = [...products];
      updated[idx] = null;
      setProducts(updated);
      updateUrl(updated[0], updated[1]);
      return;
    }
    const res = await fetch(`/api/product?slug=${slug}`);
    if (!res.ok) return;
    const product: Product = await res.json();
    const updated = [...products];
    updated[idx] = product;
    setProducts(updated);
    updateUrl(updated[0], updated[1]);
  }

  function clear() {
    setProducts([null, null]);
    setSearches(['', '']);
    router.push('/compare');
  }

  const hasProducts = products.some(Boolean);

  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Product selectors */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-sky-700" />
          <span className="text-black text-base font-normal font-['Space_Grotesk']">SELECT PRODUCTS TO COMPARE</span>
        </div>

        <div className="flex gap-6">
          {[0, 1].map((idx) => (
            <div key={idx} className="flex-1 flex flex-col gap-5">
              <h2 className="text-black text-3xl font-bold font-['Onest'] leading-[48px]">Product {idx + 1}</h2>
              <div className="relative">
                <input
                  type="text"
                  value={searches[idx]}
                  onChange={(e) => {
                    const s = [...searches];
                    s[idx] = e.target.value;
                    setSearches(s);
                  }}
                  placeholder={products[idx]?.name ?? 'Search and select a product...'}
                  className="w-full h-16 px-6 bg-white rounded-2xl outline outline-2 outline-sky-700 text-zinc-700 text-base font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none pr-10"
                />
                <ChevronDown className="w-5 h-5 text-sky-700 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                {/* Dropdown results */}
                {searches[idx].length > 1 && (
                  <ProductDropdown
                    query={searches[idx]}
                    onSelect={(product) => {
                      const s = [...searches];
                      s[idx] = '';
                      setSearches(s);
                      selectProduct(idx, product.slug);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {hasProducts && (
        <div className="rounded-[20px] outline outline-[1.35px] outline-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="bg-sky-700 flex">
            <div className="w-96 p-8 border-r border-white/20">
              <span className="text-white text-xl font-bold font-['Onest'] leading-8">Specification</span>
            </div>
            {products.map((product, idx) => (
              <div key={idx} className="w-96 h-32 p-8 bg-sky-800 border-r border-white/20 flex flex-col justify-center gap-1">
                {product ? (
                  <>
                    <p className="text-white text-2xl font-bold font-['Onest'] leading-9 truncate">{product.name}</p>
                    <p className="text-white/80 text-sm font-normal font-['Space_Grotesk'] leading-5">
                      {product.categories[0]?.name ?? ''}
                    </p>
                  </>
                ) : (
                  <p className="text-white/50 text-base font-normal font-['Space_Grotesk']">No product selected</p>
                )}
              </div>
            ))}
          </div>

          {/* Spec rows */}
          {SPEC_ROWS.map((row) => (
            <div key={row.key} className="border-b border-neutral-200 flex">
              <div className="w-96 p-6 bg-white border-r border-neutral-200 flex items-start">
                <span className="text-black text-base font-medium font-['Space_Grotesk'] leading-6">{row.label}</span>
              </div>
              {products.map((product, idx) => {
                const values = product ? getAttr(product, row.key) : [];
                return (
                  <div key={idx} className="w-96 p-6 border-r border-neutral-200 flex items-start">
                    {values.length === 0 ? (
                      <span className="text-stone-300 text-base font-['Space_Grotesk']">—</span>
                    ) : row.key === 'pa_features' ? (
                      <FeatureList values={values} />
                    ) : row.key === 'pa_applications' ? (
                      <TagList values={values} />
                    ) : row.key === 'price' ? (
                      <span className="text-sky-700 text-3xl font-bold font-['Onest'] leading-10">{values[0]}</span>
                    ) : (
                      <span className="text-stone-500 text-base font-normal font-['Space_Grotesk'] leading-6">{values.join(', ')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {hasProducts && (
        <div className="flex justify-center items-center gap-4">
          {products.map((product, idx) =>
            product ? (
              <a
                key={idx}
                href={shopUrl(product.slug)}
                className="px-8 py-4 bg-sky-700 rounded-xl text-white text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-800 transition-colors w-72 text-center"
              >
                Buy Now
              </a>
            ) : null
          )}
          <button
            onClick={clear}
            className="w-96 px-8 py-4 rounded-xl outline outline-[1.35px] outline-sky-700 text-sky-700 text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-50 transition-colors"
          >
            Clear Comparison
          </button>
        </div>
      )}
    </div>
  );
}

// Inline search dropdown — calls the product API route
function ProductDropdown({ query, onSelect }: { query: string; onSelect: (p: Product) => void }) {
  const [results, setResults] = useState<Product[]>([]);

  useState(() => {
    fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.products ?? []))
      .catch(() => {});
  });

  if (!results.length) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-20 bg-white rounded-xl shadow-lg outline outline-1 outline-neutral-200 mt-1 max-h-60 overflow-y-auto">
      {results.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className="w-full px-4 py-3 text-left text-zinc-700 text-sm font-normal font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors border-b border-neutral-100 last:border-0"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
