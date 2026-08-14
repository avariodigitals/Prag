import Image from 'next/image';
import type { SiteSettings } from '@/lib/woocommerce';

interface TestimonialItem {
  rating: number;
  quote: string;
  name: string;
  location: string;
  product: string;
  image: string;
}

const FALLBACK_ITEMS: TestimonialItem[] = [
  { rating: 5, quote: 'I bought a 3.5kVA inverter and two lithium batteries for my flat. From the day it was installed, I have not had a single dark night. The team came, sized everything properly, and installed it clean. Worth every naira.', name: 'Chidi', location: 'Lekki, Lagos', product: '3.5kVA Inverter + Lithium Battery', image: '' },
  { rating: 5, quote: 'The stabilizer saved my fridge and TV during the voltage spikes in our area. It has been running silently for eight months now — no issues at all. PRAG makes solid products.', name: 'Aisha', location: 'Kano', product: '5kVA Voltage Stabilizer', image: '' },
  { rating: 5, quote: 'I was tired of spending on fuel. PRAG set up a solar system for my home and I barely touch my generator now. Installation was professional and the support team answered every question.', name: 'Emeka', location: 'Port Harcourt', product: 'Solar System Installation', image: '' },
];

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < clamped ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < clamped ? 'text-amber-400' : 'text-slate-300'}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Testimonials({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.testimonial_enabled ?? true;
  if (!enabled) return null;

  const title = settings?.testimonial_title || 'Trusted in Homes Across Nigeria';
  const subtitle = settings?.testimonial_subtitle || 'Real reviews from real PRAG customers who took control of their power.';
  const items = settings?.testimonial_items && settings.testimonial_items.length > 0 ? settings.testimonial_items : FALLBACK_ITEMS;
  const reviews = items.slice(0, 3);

  if (reviews.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-slate-50">
      <div className="w-full max-w-[1228px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
            <span className="text-slate-500 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-wider">Reviews</span>
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight tracking-tight max-w-2xl">
            {title}
          </h2>
          <p className="text-slate-500 text-base font-normal font-['Space_Grotesk'] leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Optional customer/installation photo */}
              {review.image && (
                <div className="relative w-full h-44 md:h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={review.image}
                    alt={`${review.name}'s installation`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4 p-5 md:p-6 flex-1">
                <Stars rating={review.rating} />

                <blockquote className="text-slate-700 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed flex-1">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  {/* Avatar: photo or initials */}
                  {review.image ? (
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      <Image
                        src={review.image}
                        alt={review.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center shrink-0 text-sm font-bold font-['Onest']">
                      {initials(review.name)}
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-900 text-sm font-semibold font-['Space_Grotesk'] truncate">
                      {review.name}
                    </span>
                    <span className="text-slate-500 text-xs font-normal font-['Space_Grotesk'] truncate">
                      {review.location}
                    </span>
                  </div>
                </div>

                {/* Product purchased */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal font-['Space_Grotesk']">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-sky-600 shrink-0">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="truncate">{review.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
