import type { Metadata } from 'next';
import { ManagedFAQSection } from '@/components/FAQ';

export const metadata: Metadata = { title: 'FAQ' };

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

export default function FAQPage() {
  return (
    <main className="w-full flex flex-col">
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-sky-700 text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          FAQ
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">{DESCRIPTION}</p>
      </div>

      <ManagedFAQSection
        kicker="FAQ"
        title="FAQ"
        items={FAQ_ITEMS}
        hideHeader
      />
    </main>
  );
}
