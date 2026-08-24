'use client';

import { useState } from 'react';
import { trackLead } from '@/lib/metaPixel';

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

const WHATSAPP_NUMBER = '2347036463977';

export default function PowerCalculatorTool() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function update(name: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[name] ?? 0) + delta);
      return { ...prev, [name]: next };
    });
  }

  function reset() {
    setQuantities({});
  }

  const appliancesAdded = Object.values(quantities).reduce((s, q) => s + (q > 0 ? 1 : 0), 0);
  const peakWatts = APPLIANCES.reduce((s, a) => s + a.watts * (quantities[a.name] ?? 0), 0);
  const dailyKwh = (peakWatts * 8) / 1000;

  function getRecommendation() {
    if (appliancesAdded === 0) return;

    const selected = APPLIANCES
      .filter((a) => (quantities[a.name] ?? 0) > 0)
      .map((a) => `- ${a.name} x${quantities[a.name]} (${a.watts}W each)`)
      .join('\n');

    const message =
      `Hello Prag, I'd like a power system recommendation. Here is the list of things I want to power:\n\n` +
      `${selected}\n\n` +
      `Peak Load: ${peakWatts}W\n` +
      `Estimated Daily Usage: ${dailyKwh.toFixed(1)} KWh`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Fire Meta Pixel "Lead" event right before opening WhatsApp so
    // Facebook ad optimisation learns from actual high-intent actions
    // (button click) rather than passive page views.
    trackLead({ content_name: 'Power Calculator', value: 1, currency: 'NGN' });

    window.open(url, '_blank', 'noopener,noreferrer');
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
                      <span className="text-zinc-900 text-sm font-semibold font-['Montserrat']">{appliance.name}</span>
                      <span className="text-zinc-400 text-xs font-normal font-['Montserrat']">{appliance.watts}W per unit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => update(appliance.name, -1)}
                        className="w-7 h-7 bg-white rounded-full outline outline-1 outline-zinc-300 flex justify-center items-center hover:outline-sky-700 transition-colors">
                        <span className="text-zinc-500 text-sm font-bold leading-none">−</span>
                      </button>
                      <span className="text-zinc-900 text-sm font-bold font-['Montserrat'] w-4 text-center">{qty}</span>
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
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <span className="text-white text-lg font-extrabold font-['Montserrat']">{item.value}</span>
              <span className="text-white/60 text-xs font-normal font-['Montserrat']">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={reset}
            className="h-10 px-4 rounded-lg outline outline-1 outline-white text-white text-xs font-medium font-['Montserrat'] hover:bg-sky-800 transition-colors">
            Reset
          </button>
          <button
            onClick={getRecommendation}
            disabled={appliancesAdded === 0}
            className="h-10 px-5 bg-white rounded-lg text-sky-700 text-sm font-semibold font-['Montserrat'] flex items-center gap-2 hover:bg-sky-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}
