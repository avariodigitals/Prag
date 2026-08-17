import Image from 'next/image';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';

interface TrustStat {
  value: string;
  label: string;
}

interface TrustBadge {
  label: string;
}

const FALLBACK_STATS: TrustStat[] = [
  { value: '36', label: 'States Covered' },
  { value: '15+', label: 'Years Power Expertise' },
  { value: '50K+', label: 'Installations' },
  { value: '6', label: 'Showrooms' },
];

const FALLBACK_BADGES: TrustBadge[] = [
  { label: 'Product Warranty' },
  { label: 'Nationwide Delivery' },
  { label: 'Expert Support' },
  { label: 'Secure Checkout' },
];

// PRAG hero product image — shown floating on the portrait panel.
const PRODUCT_IMAGE =
  'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png';

// Portrait background — solar technician working on a panel (powered home feel).
const PORTRAIT_BG =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80';

export default function TrustSignal({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.trust_signal_enabled ?? true;
  if (!enabled) return null;

  const kicker = settings?.trust_signal_kicker || 'Why People Buy PRAG';
  const title = settings?.trust_signal_title || 'Buy With Confidence';
  const stats =
    settings?.trust_signal_stats && settings.trust_signal_stats.length > 0
      ? settings.trust_signal_stats
      : FALLBACK_STATS;
  const badges =
    settings?.trust_signal_badges && settings.trust_signal_badges.length > 0
      ? settings.trust_signal_badges
      : FALLBACK_BADGES;

  // Pad stats to exactly 4 for the bento layout.
  const displayStats = [...stats];
  while (displayStats.length < 4) {
    displayStats.push({ value: '', label: '' });
  }

  return (
    <section className="w-full px-4 md:px-20 py-14 md:py-20 bg-stone-50">
      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* ── Left: Portrait panel — "Trusted by thousands" + product image ── */}
        <div className="lg:row-span-2 relative overflow-hidden rounded-2xl min-h-[420px] lg:min-h-[560px] flex flex-col">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={PORTRAIT_BG}
              alt="PRAG solar installation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority
            />
          </div>
          {/* Dark gradient overlay — heavier at top for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(7,14,28,0.72) 0%, rgba(7,14,28,0.35) 40%, rgba(7,14,28,0.15) 60%, rgba(7,14,28,0.45) 100%)',
            }}
          />

          {/* Top text */}
          <div className="relative z-10 p-6 md:p-7">
            <h3 className="text-white text-2xl md:text-3xl font-bold font-['Onest'] leading-tight tracking-tight">
              Trusted by thousands
            </h3>
            <p className="mt-1.5 text-slate-200 text-sm md:text-base font-medium font-['Space_Grotesk']">
              of homes & businesses across Nigeria
            </p>
          </div>

          {/* Product image — bottom, centered */}
          <div className="relative z-10 flex-1 flex items-end justify-center pb-4">
            <div className="relative w-[55%] aspect-square">
              {/* Glow behind product */}
              <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />
              <Image
                src={PRODUCT_IMAGE}
                alt="PRAG product"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 50vw, 18vw"
              />
            </div>
          </div>
        </div>

        {/* ── Top-right: Legacy + stats panel ── */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-center gap-5">
          {/* Header */}
          <div>
            <p className="text-sky-700 text-xs md:text-sm font-semibold font-['Space_Grotesk'] uppercase tracking-[0.15em]">
              {kicker}
            </p>
            <h2 className="mt-2 text-slate-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-tight tracking-tight">
              {title}
            </h2>
            <p className="mt-2.5 text-slate-500 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed max-w-xl">
              With over 15 years of experience, we&apos;ve powered thousands of homes and businesses across Nigeria. Our long-standing history is your guarantee that we understand the local energy landscape and provide solutions that actually work.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
            {displayStats.slice(0, 4).map((stat, i) => (
              <div
                key={`${stat.value}-${stat.label}-${i}`}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="text-slate-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="text-slate-500 text-xs md:text-sm font-medium font-['Space_Grotesk']">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/about"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-white text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-sky-800 transition-all hover:scale-[1.02]"
          >
            Learn More About Us
          </Link>
        </div>

        {/* ── Bottom-middle: Built for Nigerian energy needs ── */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 flex flex-col justify-center gap-4">
          <h3 className="text-slate-900 text-xl md:text-2xl font-bold font-['Onest'] leading-tight tracking-tight">
            Built For Nigerian Energy Needs
          </h3>
          <p className="text-slate-500 text-sm font-normal font-['Space_Grotesk'] leading-relaxed">
            PRAG products are specifically designed to withstand the local climate and unique power grid challenges. Every component from our LiFePo4 batteries to our hybrid inverters is optimized for maximum efficiency and durability in Nigerian conditions.
          </p>
          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white text-sm font-semibold font-['Montserrat'] hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            Explore Our Products
          </Link>
        </div>

        {/* ── Bottom-right: Nationwide support — highlighted in PRAG blue ── */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-6 md:p-8 flex flex-col justify-center gap-4">
          <h3 className="text-white text-xl md:text-2xl font-bold font-['Onest'] leading-tight tracking-tight">
            Nationwide Support &amp; Specialized Service Centers
          </h3>
          <p className="text-sky-100 text-sm font-normal font-['Space_Grotesk'] leading-relaxed">
            We don&apos;t just install and disappear; our dedicated service centers across Lagos, Abuja, and beyond provide expert technical support and repairs. Our repair-first philosophy ensures your investment is protected by the best after-sales service in the country.
          </p>
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sky-800 text-sm font-semibold font-['Montserrat'] hover:bg-sky-50 transition-all hover:scale-[1.02]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
