export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import TechnicalSupportForm from '@/components/TechnicalSupportForm';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata: Metadata = { title: 'Technical Support' };

export default async function TechnicalSupportPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/technical-support');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = heroSection?.summary || 'Technical Support';
  const heroDesc = heroSection?.content || 'Need help with a product or installation? Submit a ticket and our team will assist you.';

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-semibold font-['Montserrat'] text-center">{heroTitle}</h1>
        <p className="max-w-[531px] text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>

      {/* Form */}
      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <TechnicalSupportForm />
        </div>
      </section>
    </main>
  );
}
