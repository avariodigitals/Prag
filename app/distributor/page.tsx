export const dynamic = 'force-dynamic';

import DistributorForm from '@/components/DistributorForm';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata = {
  title: 'Become a Distributor',
  alternates: { canonical: 'https://www.prag.global/distributor' },
};

const BENEFITS = [
  { title: 'High-Margin Products', body: 'PRAG distributors earn industry-leading margins on our full product range — stabilizers, inverters, batteries, and solar.' },
  { title: 'Exclusive Territories', body: "We offer protected territories so you're not competing with other PRAG distributors in your area." },
  { title: 'Technical Training', body: 'Comprehensive product training and certification so your team can advise customers with authority.' },
  { title: 'Sales & Marketing Support', body: 'Co-branded marketing materials, digital assets, and dedicated account management from our team.' },
  { title: 'PRAG Certification', body: 'Carry the PRAG Certified Partner badge — a mark of quality that builds customer trust in your market.' },
  { title: 'Nationwide Network', body: 'Join a growing network of distributors across all 36 states and leverage shared referrals and leads.' },
];

const TIERS = [
  { title: 'Become an Authorized Dealer', body: "As a dealer, you'll be equipped with the tools, pricing, and support needed to sell confidently and grow your business in a rapidly expanding market." },
  { title: 'Partner as a Certified Installer', body: "As a certified installer, you'll handle system setup while we ensure you have access to the right equipment, and ongoing support to execute projects seamlessly." },
  { title: 'Join as a Product Reseller', body: 'Expand your offerings by reselling PRAG solar solutions to your network. With flexible purchasing options and competitive margins.' },
];

function parseCards(content: string): { title: string; body: string }[] {
  return content
    .split('\n\n')
    .map((block) => {
      const parts = block.split(':');
      if (parts.length >= 2) {
        return { title: parts[0].trim(), body: parts.slice(1).join(':').trim() };
      }
      return null;
    })
    .filter((item): item is { title: string; body: string } => item !== null);
}

export default async function DistributorPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/distributor');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const cardSections = findVisibleSectionsByType(page, 'cards');
  const benefitsSection = cardSections[0];
  const tiersSection = cardSections[1];

  const heroTitle = heroSection?.summary || 'Sell the Solutions Nigeria Needs.';
  const heroDesc = heroSection?.content || "Partner with PRAG and build a profitable business distributing Nigeria's most trusted power engineering products.";
  const benefitsKicker = benefitsSection?.kicker || 'PARTNER BENEFITS';
  const benefitsTitle = benefitsSection?.summary || 'Everything You Need to Build a Thriving Power Business';
  const benefits = benefitsSection?.content ? parseCards(benefitsSection.content) : BENEFITS;
  const tiersKicker = tiersSection?.kicker || 'PARTNERSHIP TYPE';
  const tiersTitle = tiersSection?.summary || 'Choose the Type That Fits Your Business';
  const tiers = tiersSection?.content ? parseCards(tiersSection.content) : TIERS;

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>

      {/* Benefits */}
      <section className="w-full px-4 md:px-20 py-8 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Montserrat']">{benefitsKicker}</span>
          </div>
          <h2 className="max-w-[631px] text-zinc-900 text-2xl md:text-4xl font-bold font-['Montserrat']">
            {benefitsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="p-5 rounded-2xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-4">
              <div className="w-7 h-7 bg-sky-700 rounded-full" />
              <h3 className="text-zinc-900 text-lg font-medium font-['Montserrat']">{b.title}</h3>
              <p className="text-neutral-700 text-base md:text-lg font-normal font-['Montserrat']">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership tiers */}
      <section className="w-full px-4 md:px-20 py-8 md:py-10 flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Montserrat']">{tiersKicker}</span>
          </div>
          <h2 className="max-w-[631px] text-center text-zinc-900 text-2xl md:text-4xl font-bold font-['Montserrat']">
            {tiersTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div key={tier.title} className="p-5 bg-white rounded-2xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-4">
              <div className="p-2.5 bg-sky-700 rounded-full w-fit">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <h3 className="text-zinc-900 text-lg font-medium font-['Montserrat']">{tier.title}</h3>
              <p className="text-neutral-700 text-base md:text-lg font-normal font-['Montserrat']">{tier.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section className="w-full px-4 md:px-20 py-8 md:py-10 bg-neutral-50 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Montserrat']">APPLICATION FORM</span>
          </div>
          <h2 className="max-w-[631px] text-center text-zinc-900 text-2xl md:text-4xl font-bold font-['Montserrat']">
            Start Your PRAG Partnership
          </h2>
          <p className="max-w-[631px] text-center text-neutral-700 text-sm md:text-base font-normal font-['Montserrat']">
            Fill in the form below and our partnership team will contact you within 2 business days.
          </p>
        </div>
        <DistributorForm />
      </section>
    </main>
  );
}
