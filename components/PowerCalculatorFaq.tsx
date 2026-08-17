'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';

interface QaItem {
  question: string;
  answer: string;
}

const FALLBACK_ITEMS: QaItem[] = [
  { question: 'How does the Power Calculator work?', answer: 'Tell us which appliances you want to run and for how long. The calculator adds up your total wattage, factors in surge power and backup runtime, then recommends a PRAG inverter and battery combination sized to your actual load — no guesswork.' },
  { question: 'What do I need to know before I start?', answer: 'Have a rough list of the appliances you want to power (fridge, lights, TV, fans) and an idea of how many hours of backup you need. You don’t need exact wattage — our calculator uses typical values and lets you adjust.' },
  { question: 'Will it recommend the right battery too?', answer: 'Yes. Based on your inverter size and desired runtime, the calculator suggests a battery capacity (Ah) and chemistry — lithium or lead-acid — so your backup lasts as long as you need it to.' },
  { question: 'Can it size a solar setup?', answer: 'Yes. If you want to reduce your grid or generator use, the calculator can recommend solar panels and a hybrid inverter sized to your daily energy usage and location.' },
  { question: 'What if I’m not sure about my load?', answer: 'No problem. Start with your essentials — lights, fans, TV, and a fridge — and add from there. You can also chat with our team on WhatsApp and a PRAG engineer will help you build your load list.' },
  { question: 'Is the recommendation a quote?', answer: 'It’s a sizing guide. Once you have your recommendation, you can shop the suggested products directly, request a formal quote, or schedule a free consultation with our team.' },
];

export default function PowerCalculatorFaq({ settings }: { settings?: SiteSettings }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const enabled = settings?.power_calculator_enabled ?? true;
  if (!enabled) return null;

  const kicker = settings?.power_calculator_kicker || 'POWER CALCULATOR';
  const title = settings?.power_calculator_title || 'Not sure what size you need? Let’s work it out.';
  const subtitle = settings?.power_calculator_subtitle || 'Answer a few quick questions about what you want to power and we’ll recommend the right inverter, battery, and solar setup in seconds — no guesswork.';
  const linkText = settings?.power_calculator_link_text || 'Open the Power Calculator';
  const linkUrl = settings?.power_calculator_link_url || '/power-calculator';
  const items = settings?.power_calculator_items && settings.power_calculator_items.length > 0 ? settings.power_calculator_items : FALLBACK_ITEMS;
  const whatsappLink = settings?.socials?.whatsapp;

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-gradient-to-b from-sky-50/60 to-white">
      <div className="w-full max-w-[1228px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left: heading + calculator CTA */}
        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
            <span className="text-slate-500 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-wider">{kicker}</span>
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-base font-normal font-['Space_Grotesk'] leading-relaxed">
            {subtitle}
          </p>

          <Link
            href={linkUrl}
            className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-3.5 bg-sky-700 text-white rounded-2xl text-sm md:text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
          >
            {linkText}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sky-700 text-sm font-semibold font-['Space_Grotesk'] hover:text-sky-800 transition-colors"
            >
              Or chat with our team on WhatsApp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>

        {/* Right: Q&A accordion */}
        <div className="w-full flex flex-col gap-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${item.question}-${index}`}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'border-sky-200 bg-sky-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`power-calc-answer-${index}`}
                >
                  <span className="text-slate-900 text-base md:text-lg font-semibold font-['Space_Grotesk'] leading-snug flex-1">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-sky-700 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`power-calc-answer-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-slate-600 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
