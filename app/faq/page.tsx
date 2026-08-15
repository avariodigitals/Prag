export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ManagedFAQSection } from '@/components/FAQ';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'FAQ',
  alternates: { canonical: 'https://www.prag.global/faq' },
};

const DESCRIPTION = 'Answers to common questions about PRAG products, warranty, installation, and support.';
const FAQ_ITEMS = [
  {
    question: 'What is the warranty period on PRAG products?',
    answer: 'All PRAG products come with a standard 5-year warranty covering manufacturing defects and component failures under normal use conditions.',
  },
  {
    question: 'Do you offer installation services?',
    answer: 'Yes, PRAG offers professional installation services through our certified engineers and authorized partner network across Nigeria. Contact us or visit a PRAG store to schedule an installation.',
  },
  {
    question: 'Can I get bulk pricing for large orders?',
    answer: 'Yes, we offer competitive bulk pricing for businesses, contractors, and distributors. Please reach out to our sales team via the enquiry form or email sales@prag.global for a custom quote.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, PRAG primarily serves customers within Nigeria. For international inquiries, please contact us directly and our team will assess feasibility and provide shipping options.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, card payments (Visa/Mastercard), and USSD payments. For large corporate orders, we also support purchase orders and invoice-based payments.',
  },
  {
    question: 'How do I request technical support?',
    answer: 'You can request technical support by calling our support line at +2348032170129, emailing sales@prag.global, or submitting a request through the contact form.',
  },
];

export default async function FAQPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/faq');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const faqSection = findVisibleSectionsByType(page, 'faq')[0];

  const heroTitle = heroSection?.summary || 'FAQ';
  const heroDesc = heroSection?.content || DESCRIPTION;

  // Parse FAQ items from admin content (format: "question|answer\n\nquestion|answer")
  let items = FAQ_ITEMS;
  if (faqSection?.content) {
    const parsed = faqSection.content
      .split('\n\n')
      .map((block) => {
        const parts = block.split('|');
        if (parts.length >= 2) {
          return { question: parts[0].trim(), answer: parts.slice(1).join('|').trim() };
        }
        return null;
      })
      .filter((item): item is { question: string; answer: string } => item !== null);
    if (parsed.length > 0) items = parsed;
  }

  return (
    <main className="w-full flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">{heroDesc}</p>
      </div>

      <ManagedFAQSection
        kicker="FAQ"
        title="FAQ"
        items={items}
        hideHeader
      />
    </main>
  );
}
