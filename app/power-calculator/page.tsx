export const dynamic = 'force-dynamic';

import PowerCalculatorTool from '@/components/PowerCalculatorTool';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata = {
  title: 'Power Calculator',
  alternates: { canonical: 'https://shop.prag.global/power-calculator' },
};

export default async function PowerCalculatorPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/power-calculator');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = heroSection?.summary || 'What Size System Do You Actually Need?';
  const heroDesc = heroSection?.content || 'Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.';

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>
      <PowerCalculatorTool />
    </main>
  );
}
