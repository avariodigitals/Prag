import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';

export default function PowerCalculatorFaq({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.power_calculator_enabled ?? true;
  if (!enabled) return null;

  const title = settings?.power_calculator_title || 'Not sure what size you need? Let’s work it out.';
  const subtitle = settings?.power_calculator_subtitle || 'Answer a few quick questions about what you want to power and we’ll recommend the right inverter, battery, and solar setup in seconds — no guesswork.';
  const linkText = settings?.power_calculator_link_text || 'Open the Power Calculator';
  const linkUrl = settings?.power_calculator_link_url || '/power-calculator';

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-gradient-to-b from-sky-50/60 to-white">
      <div className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-4 text-center">
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

      </div>
    </section>
  );
}
