'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/woocommerce';

interface FaqItem {
  question: string;
  answer: string;
}

const FALLBACK_ITEMS: FaqItem[] = [
  { question: 'Which inverter size should I buy?', answer: 'The right inverter size depends on the total wattage of the appliances you want to power and how long you need them running. Add up the wattage of your essential loads (fridge, lights, TV, fans) and add a 20–30% buffer for surge power. Use our Power Calculator for an instant recommendation, or chat with our team for a tailored sizing.' },
  { question: 'How do I know what battery I need?', answer: 'Battery sizing depends on your inverter size, how long you want backup power, and your daily energy usage. A 12V system works for small setups, while 48V is better for larger loads. Lithium batteries last longer and charge faster than lead-acid. Use our Power Calculator or talk to our team to match the right battery capacity (Ah) to your inverter and runtime needs.' },
  { question: 'How long will my battery last?', answer: 'Battery runtime depends on capacity (kWh), the load you are running, and battery chemistry. A 2.4kWh lithium battery powering a 300W load gives roughly 6–7 hours of backup. Lithium batteries typically last 5–10 years with proper use, while lead-acid batteries last 2–4 years. Our team can help you estimate runtime for your specific setup.' },
  { question: 'Do PRAG products come with warranty?', answer: 'Yes. All PRAG products come with a manufacturer\'s warranty — typically 5 years for inverters and stabilizers, and up to 10 years for lithium batteries. Warranty covers manufacturing defects and component failures under normal use. Your warranty is activated automatically at purchase.' },
  { question: 'Do you deliver nationwide?', answer: 'Yes, we deliver to all 36 states in Nigeria. Orders within Lagos arrive within 1–2 business days, while other states typically take 2–5 business days. Shipping is free on orders over ₦500,000. You will receive tracking details once your order is dispatched.' },
  { question: 'Can I get help choosing the right product?', answer: 'Absolutely. You can use our Power Calculator for an instant recommendation, chat with us on WhatsApp, call our support line, or visit any PRAG store. Our team will guide you to the right inverter, battery, or solar setup based on your budget and power needs.' },
  { question: 'Can PRAG help with installation?', answer: 'Yes. PRAG offers professional installation through our certified engineers and authorized partner network across Nigeria. We handle everything from residential inverter setups to full solar installations. Schedule an installation by contacting us or visiting a PRAG store after your purchase.' },
];

export default function CheckoutFaq({ settings }: { settings?: SiteSettings }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const enabled = settings?.checkout_faq_enabled ?? true;
  if (!enabled) return null;

  const kicker = settings?.checkout_faq_kicker || 'FAQ';
  const title = settings?.checkout_faq_title || 'Still deciding? Here\'s what you need to know before you buy.';
  const subtitle = settings?.checkout_faq_subtitle || 'Straight answers on sizing, warranty, delivery and installation — so you can shop with confidence and never second-guess your power setup.';
  const linkText = settings?.checkout_faq_link_text || 'Find your perfect inverter size';
  const linkUrl = settings?.checkout_faq_link_url || '/power-calculator';
  const items = settings?.checkout_faq_items && settings.checkout_faq_items.length > 0 ? settings.checkout_faq_items : FALLBACK_ITEMS;
  const bannerEnabled = settings?.checkout_faq_banner_enabled ?? true;
  const bannerImage = settings?.checkout_faq_banner_image || '';
  const bannerLink = settings?.checkout_faq_banner_link || '/products';

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-white">
      <div className="w-full max-w-[1228px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left: heading + CTA + desktop banner */}
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
            className="inline-flex items-center gap-2 text-sky-700 text-sm font-semibold font-['Space_Grotesk'] hover:text-sky-800 transition-colors mt-1"
          >
            {linkText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Desktop-only product banner */}
          {bannerEnabled && bannerImage && (
            <Link
              href={bannerLink}
              className="hidden lg:block relative mt-4 rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-50 via-sky-100 to-sky-50 overflow-hidden">
                <Image
                  src={bannerImage}
                  alt="PRAG product"
                  fill
                  sizes="340px"
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 animate-[float_4s_ease-in-out_infinite]"
                />
                {/* Animated glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent">
                <span className="text-white text-sm font-semibold font-['Space_Grotesk'] flex items-center gap-1.5">
                  Shop now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Right: accordion */}
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
                  aria-controls={`checkout-faq-answer-${index}`}
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
                  id={`checkout-faq-answer-${index}`}
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
