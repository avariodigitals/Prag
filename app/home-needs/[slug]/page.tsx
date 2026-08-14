export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteSettings } from '@/lib/woocommerce';

interface PageData {
  slug: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  introHeading: string;
  introBody: string[];
  faqs: { question: string; answer: string }[];
  canonical: string;
}

const PAGES: Record<string, PageData> = {
  'apartments': {
    slug: 'apartments',
    title: 'Power Solutions for Apartments',
    heroTitle: 'Compact Power Backup for Apartments',
    heroSubtitle: 'Keep your lights, TV, fridge and fans running through every outage — without sacrificing space.',
    seoTitle: 'Inverter & Battery Solutions for Apartments in Nigeria | PRAG',
    seoDescription: 'Shop compact inverter and battery backup solutions sized for apartments in Nigeria. Keep your essentials running through every power outage with PRAG.',
    introHeading: 'Reliable backup power that fits your flat',
    introBody: [
      'Apartment living means limited space, but that does not mean you have to sit in the dark when the grid fails. PRAG apartment power solutions are designed around compact footprints — small inverters and slim lithium batteries that tuck into a closet, balcony, or utility corner without disrupting your home.',
      'A typical apartment setup pairs a 1.5kVA to 3.5kVA inverter with one or two lithium batteries. That is enough to run your lights, television, fridge, fans, and internet router for hours — silently and cleanly, with no fuel, no fumes, and no noise.',
      'Every PRAG inverter is pure sine wave, so your sensitive electronics are safe. And because lithium batteries charge fast and last up to 10 years, you spend less on replacements and more time enjoying uninterrupted power.',
    ],
    faqs: [
      { question: 'What size inverter do I need for my apartment?', answer: 'For a typical 1–2 bedroom apartment, a 1.5kVA to 3.5kVA inverter is usually sufficient. This covers lights, TV, fans, fridge, and internet router. Use our Power Calculator for a precise recommendation based on your actual appliances.' },
      { question: 'How much space does an apartment inverter system take?', answer: 'A compact inverter and one lithium battery can fit in a space as small as 60cm x 40cm. Wall-mounted options are also available to save floor space.' },
      { question: 'How long will the battery last during an outage?', answer: 'With a 2.4kWh lithium battery and a 1.5kVA inverter running essential loads (lights, TV, fan, router), you can expect 4–7 hours of backup. Adding a second battery doubles your runtime.' },
    ],
    canonical: 'https://www.prag.global/home-needs/apartments',
  },
  'family-homes': {
    slug: 'family-homes',
    title: 'Power Solutions for Family Homes',
    heroTitle: 'Whole-Home Power Backup for Families',
    heroSubtitle: 'More capacity, longer runtime, and peace of mind for every room in the house.',
    seoTitle: 'Inverter & Battery Solutions for Family Homes in Nigeria | PRAG',
    seoDescription: 'Power your entire family home with PRAG high-capacity inverters and lithium batteries. Longer runtime, more rooms covered, and professional installation across Nigeria.',
    introHeading: 'Power every room, not just the essentials',
    introBody: [
      'When you have a family to keep comfortable, a small backup system is not enough. You need enough capacity to run the fridge, freezer, multiple rooms of lights, TVs, fans, washing machine, and even a water pump — sometimes all at once.',
      'PRAG family home solutions start at 3.5kVA and scale up to 10kVA and beyond, paired with high-capacity lithium battery banks. These systems are built to handle real household loads for extended periods, so your family barely notices when the grid drops.',
      'With options for automatic transfer switches, you can set your system to switch on the moment power goes out — no manual intervention, no scrambling in the dark. And with lithium batteries rated for thousands of cycles, your investment lasts for years.',
    ],
    faqs: [
      { question: 'What size inverter do I need for a family home?', answer: 'A 3.5kVA to 7.5kVA inverter is typical for a 3–4 bedroom family home, depending on how many appliances you run simultaneously. For whole-home coverage including water pumps and ACs, consider 10kVA or higher.' },
      { question: 'How many batteries do I need?', answer: 'For a family home, we recommend a minimum of two 48V lithium batteries (approx. 5kWh total). This gives 6–10 hours of backup for essential household loads. More batteries extend runtime proportionally.' },
      { question: 'Can I run my freezer and water pump on the inverter?', answer: 'Yes. PRAG inverters handle motor loads like freezers and water pumps. Just account for the surge power (2–3x running wattage) when sizing your system. Our team can help you calculate this.' },
    ],
    canonical: 'https://www.prag.global/home-needs/family-homes',
  },
  'home-offices': {
    slug: 'home-offices',
    title: 'Power Solutions for Home Offices',
    heroTitle: 'Uninterrupted Power for Your Home Office',
    heroSubtitle: 'Keep your laptop, internet, and essential devices online — never lose work to a power cut again.',
    seoTitle: 'Inverter & Stabilizer Solutions for Home Offices in Nigeria | PRAG',
    seoDescription: 'Protect your home office with PRAG inverters and voltage stabilizers. Keep your laptop, internet, and devices running through outages and voltage fluctuations.',
    introHeading: 'Work without interruptions',
    introBody: [
      'A power cut during a video call, a voltage spike that fries your router, a sudden outage that loses an hour of unsaved work — these are not just annoyances, they cost you money. PRAG home office solutions are designed to keep your work flowing no matter what the grid does.',
      'For most home offices, a compact 1kVA to 2.4kVA inverter with a single battery is enough to keep your laptop, monitor, internet router, and desk lamp running for hours. Add a voltage stabilizer to protect your equipment from the surges and dips that are common in Nigerian power supply.',
      'The result: clean, quiet, uninterrupted power that lets you focus on your work — not on when the light will go off.',
    ],
    faqs: [
      { question: 'What do I need to power my home office?', answer: 'A 1kVA to 2.4kVA inverter with one battery covers a laptop, monitor, internet router, and desk lamp for 3–5 hours. Add a voltage stabilizer if your area experiences frequent voltage fluctuations.' },
      { question: 'Do I need a stabilizer if I have an inverter?', answer: 'Yes, in many areas. Inverters provide backup power but do not always regulate voltage from the grid. A stabilizer protects your devices from surges and dips when running on grid power. Some PRAG inverters have built-in AVR — check the specs or ask our team.' },
      { question: 'Will an inverter damage my laptop or router?', answer: 'No. PRAG inverters produce pure sine wave output, which is the cleanest form of AC power and safe for all electronics, including laptops, routers, and monitors.' },
    ],
    canonical: 'https://www.prag.global/home-needs/home-offices',
  },
  'solar-homes': {
    slug: 'solar-homes',
    title: 'Solar Power Solutions for Homes',
    heroTitle: 'Cut Your Fuel Bill with Solar',
    heroSubtitle: 'Reduce your reliance on grid and generator power with solar panels and hybrid inverters.',
    seoTitle: 'Solar Power Solutions for Homes in Nigeria | PRAG',
    seoDescription: 'Go solar with PRAG. Solar panels, hybrid inverters, and lithium batteries that cut your grid and generator dependence. Professional installation across Nigeria.',
    introHeading: 'Stop buying fuel, start harvesting sunlight',
    introBody: [
      'Nigeria gets abundant sunlight year-round — yet most homes still burn fuel in generators when the grid fails. A PRAG solar system turns that sunlight into free, clean electricity that powers your home day and night.',
      'A typical solar setup includes solar panels, a hybrid inverter, and a lithium battery bank. During the day, panels generate power to run your home and charge your batteries. At night or during outages, the batteries take over seamlessly. Your generator sits idle.',
      'Solar is not just for off-grid homes. Even with grid connection, a solar system slashes your electricity bills and gives you energy independence. With PRAG professional installation and warranty backing, going solar has never been safer or simpler.',
    ],
    faqs: [
      { question: 'How many solar panels do I need for my home?', answer: 'A typical Nigerian home needs 4–8 solar panels (3kW–6kW) to cover daytime loads and charge batteries. The exact number depends on your daily energy consumption and available roof space. Use our Power Calculator or talk to our team for a custom estimate.' },
      { question: 'Can solar power my home at night?', answer: 'Yes. Solar panels generate power during the day and charge your lithium batteries. At night, the batteries supply your home. A properly sized battery bank ensures you have power through the night.' },
      { question: 'How much can I save on fuel with solar?', answer: 'Most Nigerian homes with a properly sized solar system reduce generator usage by 80–100%. Depending on your fuel consumption, the system typically pays for itself in 2–4 years, then continues saving for the 25+ year lifespan of the panels.' },
    ],
    canonical: 'https://www.prag.global/home-needs/solar-homes',
  },
};

export async function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: page.canonical,
      type: 'website',
    },
  };
}

export default async function HomeNeedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const settings = await getSiteSettings();

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero — text only, centered */}
      <section className="w-full px-4 md:px-20 pt-12 md:pt-20 pb-10 md:pb-14 bg-gradient-to-b from-sky-50 to-white flex flex-col items-center gap-4 text-center">
        <h1 className="text-slate-900 text-3xl md:text-5xl font-bold font-['Onest'] leading-tight tracking-tight max-w-2xl">
          {page.heroTitle}
        </h1>
        <p className="text-slate-600 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed max-w-2xl">
          {page.heroSubtitle}
        </p>
      </section>

      {/* Intro / SEO content — left-aligned */}
      <section className="w-full px-4 md:px-20 py-10 md:py-16">
        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-4">
          <h2 className="text-slate-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-tight">
            {page.introHeading}
          </h2>
          {page.introBody.map((paragraph, i) => (
            <p key={i} className="text-slate-600 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* CTA — centered, before FAQ */}
      <section className="w-full px-4 md:px-20 py-8 md:py-10">
        <div className="w-full max-w-[800px] mx-auto flex flex-col sm:flex-row justify-center items-center gap-3">
          <Link
            href="/power-calculator"
            className="w-full sm:w-auto py-3 px-8 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <span className="text-white text-base font-semibold font-['Montserrat'] whitespace-nowrap">Get Recommendations</span>
          </Link>
          <Link
            href={settings.socials?.whatsapp || 'https://wa.me/2348032170129'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-8 bg-white border border-slate-200 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0 text-sky-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-sky-700 text-base font-semibold font-['Montserrat'] whitespace-nowrap">Chat on WhatsApp</span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-4 md:px-20 py-10 md:py-16">
        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
          <h2 className="text-slate-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-3">
            {page.faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 cursor-pointer list-none">
                  <span className="text-slate-900 text-base md:text-lg font-semibold font-['Space_Grotesk'] leading-snug flex-1">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-open:bg-sky-700 group-open:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 md:px-6 pb-5">
                  <p className="text-slate-600 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
