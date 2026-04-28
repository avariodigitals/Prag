'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const BACKUP_HOURS = 8; // assumed backup hours for battery sizing

export default function PowerCalculatorTool() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function update(name: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[name] ?? 0) + delta);
      return { ...prev, [name]: next };
    });
  }

  function reset() { setQuantities({}); }

  const appliancesAdded = Object.values(quantities).reduce((s, q) => s + (q > 0 ? 1 : 0), 0);
  const peakWatts = APPLIANCES.reduce((s, a) => s + a.watts * (quantities[a.name] ?? 0), 0);
  const dailyKwh = (peakWatts * BACKUP_HOURS) / 1000;
  const recommendedKva = (peakWatts / 1000 / 0.8).toFixed(1); // 80% power factor

  const rows = [];
  for (let i = 0; i < APPLIANCES.length; i += 3) rows.push(APPLIANCES.slice(i, i + 3));

  return (
    <div className="w-full px-20 py-24 flex flex-col gap-10">
      {/* Appliance grid */}
      <div className="flex flex-col gap-6">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-6">
            {row.map((appliance) => {
              const qty = quantities[appliance.name] ?? 0;
              return (
                <div key={appliance.name} className="flex-1 p-6 bg-white rounded outline outline-1 outline-zinc-500/40 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-4">
                      <span className="text-zinc-900 text-2xl font-bold font-['Onest'] leading-7">{appliance.name}</span>
                      <span className="text-zinc-500 text-base font-normal font-['Onest'] leading-4">{appliance.watts}W per unit</span>
                    </div>
                    <div className="w-24 h-7 flex justify-between items-center">
                      <button onClick={() => update(appliance.name, -1)}
                        className="w-7 h-7 px-2 bg-white rounded-2xl outline outline-1 outline-zinc-500 flex justify-center items-center hover:outline-sky-700 transition-colors">
                        <span className="text-zinc-500 text-sm font-bold leading-none">−</span>
                      </button>
                      <span className="text-zinc-900 text-base font-bold font-['Onest'] leading-6">{qty}</span>
                      <button onClick={() => update(appliance.name, 1)}
                        className="h-7 px-2 bg-sky-700 rounded-[100px] flex justify-center items-center hover:bg-sky-800 transition-colors">
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
      <div className="w-full px-7 py-6 bg-sky-700 flex justify-between items-start rounded-lg">
        <div className="flex gap-8">
          {[
            { label: 'Appliances Added', value: String(appliancesAdded) },
            { label: 'Peak Load', value: `${peakWatts}W` },
            { label: 'Daily Usage', value: `${dailyKwh.toFixed(1)} KWh` },
            { label: 'Recommended Inverter Capacity', value: `${recommendedKva} KVA` },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <span className="text-white text-xl font-extrabold font-['Onest'] leading-5">{item.value}</span>
              <span className="text-white/50 text-xs font-normal font-['DM_Sans'] leading-4">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={reset}
            className="w-24 h-10 rounded-lg outline outline-1 outline-white text-white text-xs font-medium font-['DM_Sans'] leading-5 hover:bg-sky-800 transition-colors">
            Reset
          </button>
          <Link href={`/products?min_price=0&recommended_kva=${recommendedKva}`}
            className="flex-1 h-10 px-4 bg-white rounded-lg text-sky-700 text-sm font-semibold font-['DM_Sans'] leading-5 flex items-center gap-1 hover:bg-sky-50 transition-colors whitespace-nowrap">
            Get Recommendation →
          </Link>
        </div>
      </div>
    </div>
  );
}
