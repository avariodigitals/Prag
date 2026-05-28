'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is the warranty period on PRAG products?',
    answer:
      'All PRAG products come with a standard 5-year warranty covering manufacturing defects and component failures under normal use conditions.',
  },
  {
    question: 'Do you offer installation services?',
    answer:
      'Yes, PRAG offers professional installation services through our certified engineers and authorized partner network across Nigeria. Contact us or visit a PRAG store to schedule an installation.',
  },
  {
    question: 'Can I get bulk pricing for large orders?',
    answer:
      'Yes, we offer competitive bulk pricing for businesses, contractors, and distributors. Please reach out to our sales team via the enquiry form or email sales@prag.global for a custom quote.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently, PRAG primarily serves customers within Nigeria. For international inquiries, please contact us directly and our team will assess feasibility and provide shipping options.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bank transfers, card payments (Visa/Mastercard), and USSD payments. For large corporate orders, we also support purchase orders and invoice-based payments.',
  },
  {
    question: 'How do I request technical support?',
    answer:
      'You can request technical support by calling our support line at +2348032170129, emailing sales@prag.global, or submitting a request through the contact form.',
  },
];

function ChevronUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 12.5L10 7.5L5 12.5" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FAQSectionContent({
  kicker,
  title,
  items,
  openIndex,
  onToggle,
  hideHeader,
}: {
  kicker: string;
  title: string;
  items: FAQItem[];
  openIndex: number;
  onToggle: (index: number) => void;
  hideHeader?: boolean;
}) {
  return (
    <section className="w-full px-6 md:px-20 py-20">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-10">
        {!hideHeader && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#0166a5] rounded-sm flex-shrink-0" aria-hidden="true" />
              <span className="text-[#1a1a1a] text-base font-normal font-['Space_Grotesk']">{kicker}</span>
            </div>
            <h2 className="text-[#1a1a1a] text-4xl md:text-[48px] font-bold font-['Onest'] leading-tight tracking-[-2px]">
              {title}
            </h2>
          </div>
        )}

        <div className="w-full max-w-[904px] mx-auto flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${item.question}-${index}`}
                className="rounded-[14px] border border-[#eeeeee] transition-all duration-200 bg-white"
              >
                <button
                  onClick={() => onToggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-[#1a1a1a] text-lg font-medium font-['Space_Grotesk'] leading-6 flex-1">
                    {item.question}
                  </span>
                  <span className="shrink-0 flex items-center justify-center">
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-answer-${index}`} className="px-6 pb-5">
                    <p className="text-[#6b6b6b] text-base font-normal font-['Space_Grotesk'] leading-[23.8px]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ManagedFAQSection({
  kicker,
  title,
  items,
  hideHeader,
}: {
  kicker?: string;
  title?: string;
  items?: FAQItem[];
  hideHeader?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <FAQSectionContent
      kicker={kicker?.trim() || 'FAQ'}
      title={title?.trim() || 'Frequently asked questions'}
      items={items && items.length > 0 ? items : FAQ_ITEMS}
      openIndex={openIndex}
      onToggle={toggle}
      hideHeader={hideHeader}
    />
  );
}
