export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Zap, Gauge, Sun, BatteryFull } from 'lucide-react';
import WarrantyCard from '@/components/WarrantyCard';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'Product Warranty',
  alternates: { canonical: 'https://shop.prag.global/warranty' },
};

const CATEGORIES = [
  { title: 'Inverter Warranty', href: '/warranty/inverter', icon: <Zap className="w-7 h-7" aria-hidden="true" /> },
  { title: 'Stabilizer Warranty', href: '/warranty/stabilizer', icon: <Gauge className="w-7 h-7" aria-hidden="true" /> },
  { title: 'Solar Warranty', href: '/warranty/solar', icon: <Sun className="w-7 h-7" aria-hidden="true" /> },
  { title: 'Lithium Battery Warranty', href: '/warranty/battery', icon: <BatteryFull className="w-7 h-7" aria-hidden="true" /> },
];

export default async function WarrantyPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/warranty');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = heroSection?.summary || 'Product Warranty';
  const heroDesc = heroSection?.content || 'Find warranty details for PRAG inverters, stabilizers, solar products and batteries.';

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat'] text-center">{heroTitle}</h1>
        <p className="max-w-2xl text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>

      {/* Cards */}
      <section className="w-full px-4 md:px-20 py-8 md:py-20">
        <div className="max-w-[997px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((category) => (
            <WarrantyCard key={category.href} {...category} />
          ))}
        </div>
      </section>
    </main>
  );
}
