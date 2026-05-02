'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, productUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

const APPLIANCES = [
  { name: 'Ceiling Fan', watts: 60 },
  { name: 'Standing Fan', watts: 60 },
  { name: 'Pressing Iron', watts: 1000 },
  { name: 'Air Conditioner (1HP)', watts: 746 },
  { name: 'LED Bulb (12W)', watts: 12 },
  { name: 'Washing Machine', watts: 1200 },
  { name: 'TV 32" LED', watts: 50 },
  { name: 'TV 55" Smart', watts: 100 },
  { name: 'DSTV / Decoder', watts: 30 },
  { name: 'Refrigerator (Medium)', watts: 150 },
  { name: 'Deep Freezer', watts: 200 },
  { name: 'Microwave Oven', watts: 1200 },
  { name: 'Electric Kettle', watts: 1500 },
  { name: 'Blender', watts: 400 },
  { name: 'Laptop', watts: 65 },
  { name: 'Desktop Computer', watts: 300 },
  { name: 'Phone Charger', watts: 20 },
  { name: 'WiFi Router', watts: 15 },
  { name: 'Water Pump (0.5HP)', watts: 373 },
  { name: 'Air Conditioner (1.5HP)', watts: 1119 },
  { name: 'Fluorescent Light (40W)', watts: 40 },
];

// Standard KVA sizes — round up to nearest standard size
const KVA_SIZES = [0.6, 1, 1.5, 2, 2.5, 3.5, 5, 7.5, 10, 15, 20];

function nearestKva(kva: number): number {
  return KVA_SIZES.find((k) => k >= kva) ?? KVA_SIZES[KVA_SIZES.length - 1];
}

export default function PowerCalculatorTool() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [recommendations, setRecommendations] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  function update(name: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[name] ?? 0) + delta);
      return { ...prev, [name]: next };
    });
    setRecommendations(null); // reset results when selection changes
  }

  function reset() {
    setQuantities({});
    setRecommendations(null);
  }

  const appliancesAdded = Object.values(quantities).reduce((s, q) => s + (q > 0 ? 1 : 0), 0);
  const peakWatts = APPLIANCES.reduce((s, a) => s + a.watts * (quantities[a.name] ?? 0), 0);
  const dailyKwh = (peakWatts * 8) / 1000;
  const rawKva = peakWatts / 1000 / 0.8;
  const recommendedKva = nearestKva(rawKva);

  async function getRecommendations() {
    setLoading(true);
    setRecommendations(null);
    try {
      // Search for inverters matching the KVA size
      const res = await fetch(`/api/products/search?q=${recommendedKva}KVA`);
      const data = await res.json();
      let products: Product[] = data.products ?? [];

      // Filter to only inverter category products that mention the KVA in name
      products = products.filter((p) =>
        p.name.toLowerCase().includes(`${recommendedKva}kva`) ||
        p.name.toLowerCase().includes(`${recommendedKva} kva`)
      );

      // If no exact match, fall back to all inverters
      if (products.length === 0) {
        const fallback = await fetch(`/api/products/search?q=inverter`);
        const fallbackData = await fallback.json();
        products = (fallbackData.products ?? []).slice(0, 6);
      }

      setRecommendations(products.slice(0, 6));
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }

  const rows: typeof APPLIANCES[] = [];
  for (let i = 0; i < APPLIANCES.length; i += 3) rows.push(APPLIANCES.slice(i, i + 3));

  return (
    <div className="w-full px-4 md:px-20 py-8 flex flex-col gap-8">
      {/* Appliance grid */}
      <div className="flex flex-col gap-4">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {row.map((appliance) => {
              const qty = quantities[appliance.name] ?? 0;
              return (
                <div key={appliance.name} className={`p-4 bg-white rounded-xl outline outline-1 flex flex-col gap-2 transition-colors ${qty > 0 ? 'outline-sky-700 bg-sky-50/30' : 'outline-zinc-200'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-900 text-sm font-semibold font-['Onest']">{appliance.name}</span>
                      <span className="text-zinc-400 text-xs font-normal font-['Onest']">{appliance.watts}W per unit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => update(appliance.name, -1)}
                        className="w-7 h-7 bg-white rounded-full outline outline-1 outline-zinc-300 flex justify-center items-center hover:outline-sky-700 transition-colors">
                        <span className="text-zinc-500 text-sm font-bold leading-none">−</span>
                      </button>
                      <span className="text-zinc-900 text-sm font-bold font-['Onest'] w-4 text-center">{qty}</span>
                      <button onClick={() => update(appliance.name, 1)}
                        className="w-7 h-7 bg-sky-700 rounded-full flex justify-center items-center hover:bg-sky-800 transition-colors">
                        <span className="text-white text-sm font-bold leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Results bar */}
      <div className="w-full px-5 py-5 bg-sky-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl">
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Appliances Added', value: String(appliancesAdded) },
            { label: 'Peak Load', value: `${peakWatts}W` },
            { label: 'Daily Usage', value: `${dailyKwh.toFixed(1)} KWh` },
            { label: 'Recommended Inverter', value: appliancesAdded > 0 ? `${recommendedKva} KVA` : '—' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <span className="text-white text-lg font-extrabold font-['Onest']">{item.value}</span>
              <span className="text-white/60 text-xs font-normal font-['Space_Grotesk']">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={reset}
            className="h-10 px-4 rounded-lg outline outline-1 outline-white text-white text-xs font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
            Reset
          </button>
          <button
            onClick={getRecommendations}
            disabled={appliancesAdded === 0 || loading}
            className="h-10 px-5 bg-white rounded-lg text-sky-700 text-sm font-semibold font-['Space_Grotesk'] flex items-center gap-2 hover:bg-sky-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Finding...
              </>
            ) : 'Get Recommendation →'}
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations !== null && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-zinc-900 text-xl font-bold font-['Onest']">
              {recommendations.length > 0
                ? `Recommended ${recommendedKva} KVA Inverters for Your Load`
                : 'No exact matches found'}
            </h2>
            <p className="text-zinc-500 text-sm font-['Space_Grotesk']">
              Based on your {peakWatts}W peak load, you need at least a {recommendedKva} KVA inverter.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <p className="text-zinc-400 font-['Space_Grotesk']">No products matched. Browse our full inverter range.</p>
              <Link href="/products/inverters" className="px-6 py-3 bg-sky-700 rounded-full text-white text-sm font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
                Browse Inverters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((product) => {
                const img = product.images?.[0];
                return (
                  <div key={product.id} className="bg-white rounded-xl outline outline-1 outline-zinc-100 flex flex-col overflow-hidden group">
                    <div className="h-48 bg-stone-50 flex items-center justify-center p-4 relative">
                      {img ? (
                        <Image src={img.src} alt={img.alt || product.name} fill sizes="300px"
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-20 h-20 bg-zinc-100 rounded-full" />
                      )}
                      {product.on_sale && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded-full text-white text-xs font-bold font-['Space_Grotesk']">SALE</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <p className="text-zinc-900 text-sm font-semibold font-['Onest'] line-clamp-2 group-hover:text-sky-700 transition-colors">{product.name}</p>
                      <div className="flex items-center gap-2">
                        {product.on_sale && product.regular_price && (
                          <span className="text-zinc-400 text-xs line-through font-['Onest']">{formatPrice(product.regular_price)}</span>
                        )}
                        <span className="text-sky-700 text-base font-bold font-['Onest']">{formatPrice(product.price)}</span>
                      </div>
                      <Link href={productUrl(product)}
                        className="w-full py-2.5 bg-sky-700 rounded-full text-white text-sm font-medium font-['Space_Grotesk'] text-center hover:bg-sky-800 transition-colors">
                        View Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
