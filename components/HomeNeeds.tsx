import Link from 'next/link';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/woocommerce';

interface HomeNeedItem {
  title: string;
  description: string;
  cta: string;
  link: string;
  icon: string;
  image: string;
}

const FALLBACK_ITEMS: HomeNeedItem[] = [
  { title: 'For Apartments', description: 'Compact inverter and battery combos that fit tight spaces and keep your essentials running through every outage.', cta: 'Get Recommendations', link: '/home-needs/apartments', icon: '', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
  { title: 'For Family Homes', description: 'Higher-capacity inverters with extended-life lithium batteries for longer runtime across more rooms and appliances.', cta: 'Get Recommendations', link: '/home-needs/family-homes', icon: '', image: 'https://images.unsplash.com/photo-1568605114967-8130f81a6e54?w=800&q=80' },
  { title: 'For Home Offices', description: 'Quiet, clean power that keeps your laptop, internet router, and essential devices online without missing a beat.', cta: 'Get Recommendations', link: '/home-needs/home-offices', icon: '', image: 'https://images.unsplash.com/photo-1593696954577-ab3d39817b21?w=800&q=80' },
  { title: 'For Solar Homes', description: 'Solar panels and hybrid inverters that cut your grid and generator dependence — and your fuel bill.', cta: 'Get Recommendations', link: '/home-needs/solar-homes', icon: '', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80' },
];

export default function HomeNeeds({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.home_need_enabled ?? true;
  if (!enabled) return null;

  const title = settings?.home_need_title || 'Power Your Home Your Way';
  const subtitle = settings?.home_need_subtitle || 'Whatever your setup, PRAG has a reliable power solution sized for how you actually live.';
  const items = settings?.home_need_items && settings.home_need_items.length > 0 ? settings.home_need_items : FALLBACK_ITEMS;

  if (items.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-white">
      <div className="w-full max-w-[1228px] mx-auto flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
            <span className="text-slate-500 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-wider">Shop by Home Need</span>
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-tight tracking-tight max-w-2xl">
            {title}
          </h2>
          <p className="text-slate-500 text-base font-normal font-['Space_Grotesk'] leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((item, i) => (
            <Link
              key={`${item.title}-${i}`}
              href={item.link}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image header */}
              <div className="relative h-52 md:h-56 overflow-hidden">
                {item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-bold font-['Onest'] leading-snug drop-shadow-md">
                        {item.title}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-sky-50 to-slate-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                      <path d="M3 10.5L12 3l9 7.5V21H3z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <p className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-relaxed flex-1">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sky-700 text-sm font-semibold font-['Space_Grotesk'] group-hover:gap-2.5 transition-all">
                  {item.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
