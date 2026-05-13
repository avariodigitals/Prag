'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, shopUrl } from '@/lib/woocommerce';

interface Props {
  products: Product[];
}

function ProductSelect({
  products,
  value,
  onChange,
  label,
}: {
  products: Product[];
  value: Product | null;
  onChange: (p: Product | null) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-zinc-900 text-lg font-bold font-['Montserrat']">{label}</p>
      <div className="relative">
        <select
          className="w-full h-12 px-4 pr-10 rounded-lg border border-zinc-300 bg-white text-sm font-['Montserrat'] text-zinc-700 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-600"
          value={value?.slug ?? ''}
          onChange={(e) => {
            const found = products.find((p) => p.slug === e.target.value) ?? null;
            onChange(found);
          }}
        >
          <option value=""></option>
          {products.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
}

function allAttributeNames(products: (Product | null)[]): string[] {
  const names = new Set<string>();
  for (const p of products) {
    if (!p) continue;
    for (const a of p.attributes ?? []) names.add(a.name);
  }
  return Array.from(names);
}

export default function CompareView({ products }: Props) {
  const [p1, setP1] = useState<Product | null>(null);
  const [p2, setP2] = useState<Product | null>(null);

  const selected = useMemo(() => [p1, p2] as const, [p1, p2]);
  const hasComparison = p1 && p2;
  const attrNames = useMemo(() => allAttributeNames([p1, p2]), [p1, p2]);

  function getAttr(product: Product | null, name: string) {
    return product?.attributes?.find((a) => a.name === name)?.options.join(', ') ?? '—';
  }

  function getFeatures(product: Product | null) {
    return product?.tags?.map((t) => t.name) ?? [];
  }

  function getApplications(product: Product | null) {
    return product?.categories?.map((c) => c.name) ?? [];
  }

  function getProductLandingHref(product: Product) {
    return shopUrl(product.slug);
  }

  const specRows: { label: string; values: (string | React.ReactNode)[] }[] = hasComparison
    ? [
        {
          label: 'Price',
          values: selected.map((p) => {
            const n = Number(String(p?.price ?? '').replace(/,/g, ''));
            return n > 0 ? (
              <span className="text-sky-700 font-bold text-base font-['Montserrat']">{formatPrice(p!.price)}</span>
            ) : (
              '—'
            );
          }),
        },
        ...attrNames.map((name) => ({
          label: name,
          values: selected.map((p) => getAttr(p, name)),
        })),
        {
          label: 'Features',
          values: selected.map((p) => {
            const features = getFeatures(p);
            if (!features.length) return '—';
            return (
              <ul className="flex flex-col gap-1">
                {features.map((f, idx) => (
                  <li key={`${f}-${idx}`} className="flex items-center gap-1.5 text-sm font-['Montserrat'] text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            );
          }),
        },
        {
          label: 'Applications',
          values: selected.map((p) => {
            const apps = getApplications(p);
            if (!apps.length) return '—';
            return (
              <div className="flex flex-wrap gap-1.5">
                {apps.map((a, idx) => (
                  <span
                    key={`${a}-${idx}`}
                    className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-medium font-['Montserrat']"
                  >
                    {a}
                  </span>
                ))}
              </div>
            );
          }),
        },
      ]
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-10 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-sky-700 text-3xl md:text-4xl font-bold font-['Montserrat']">Compare Up to 2 Products</h1>
        <p className="text-zinc-500 text-sm font-['Montserrat'] max-w-md">
          Select two products to compare their specifications, features, and pricing side-by-side.
        </p>
        <div className="w-full border-t border-dashed border-sky-200 mt-2" />
      </div>

      {/* Selectors */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-sky-700 rounded-sm" />
          <span className="text-zinc-500 text-xs font-semibold font-['Montserrat'] uppercase tracking-wider">
            Select Products to Compare
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductSelect products={products} value={p1} onChange={setP1} label="Product 1" />
          <ProductSelect products={products} value={p2} onChange={setP2} label="Product 2" />
        </div>
      </div>

      {/* Comparison Table */}
      {hasComparison && (
        <div className="flex flex-col gap-6">
          <div className="hidden md:block rounded-xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-800 text-white">
                  <th className="text-left px-6 py-4 font-semibold font-['Montserrat'] w-44">Specification</th>
                  {selected.map((p, idx) => (
                    <th
                      key={p!.id}
                      className={`text-left px-6 py-4 ${idx > 0 ? 'border-l border-sky-600/40' : ''}`}
                    >
                      <p className="font-bold font-['Montserrat'] text-base">{p!.name}</p>
                      <p className="text-sky-200 text-xs font-['Montserrat'] font-normal mt-0.5">
                        {p!.categories[0]?.name ?? ''}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                    <td className="px-6 py-4 text-zinc-500 font-medium font-['Montserrat'] align-top">
                      {row.label}
                    </td>
                    {row.values.map((val, j) => (
                      <td
                        key={j}
                        className={`px-6 py-4 text-zinc-800 font-['Montserrat'] align-top ${j > 0 ? 'border-l border-zinc-200' : ''}`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white border-t border-zinc-200">
                  <td className="px-6 py-4 text-zinc-500 font-medium font-['Montserrat']">Action</td>
                  {selected.map((p, idx) => (
                    <td key={p!.id} className={`px-6 py-4 ${idx > 0 ? 'border-l border-zinc-200' : ''}`}>
                      <a
                        href={getProductLandingHref(p!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Montserrat'] rounded-full transition-colors"
                      >
                        Buy Now
                      </a>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {selected.map((p) => (
                <div key={p!.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-zinc-900 text-sm font-bold font-['Montserrat'] line-clamp-2 min-h-10">{p!.name}</p>
                  <p className="text-zinc-500 text-xs font-['Montserrat'] mt-1">{p!.categories[0]?.name ?? ''}</p>
                </div>
              ))}
            </div>

            {specRows.map((row, i) => (
              <div key={row.label} className={`rounded-xl border border-zinc-200 p-3 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                <p className="text-zinc-500 text-[11px] font-semibold font-['Montserrat'] uppercase tracking-wide mb-2">{row.label}</p>
                <div className="grid grid-cols-2 gap-3">
                  {row.values.map((val, j) => (
                    <div key={j} className="text-zinc-800 text-base md:text-lg font-['Montserrat'] break-words">
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2">
              {selected.map((p) => (
                <a
                  key={p!.id}
                  href={getProductLandingHref(p!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 inline-flex items-center justify-center px-4 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold font-['Montserrat'] rounded-full transition-colors"
                >
                  Buy Now
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => { setP1(null); setP2(null); }}
              className="w-full md:w-auto h-11 md:h-auto px-8 py-3 border border-sky-700 text-sky-700 hover:bg-sky-50 text-sm font-semibold font-['Montserrat'] rounded-full transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
