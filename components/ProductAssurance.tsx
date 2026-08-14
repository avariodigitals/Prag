import Link from 'next/link';
import { ShieldCheck, Truck, LifeBuoy, MapPin, ArrowRight } from 'lucide-react';
import { getStores } from '@/lib/woocommerce';
import type { Store } from '@/lib/types';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Genuine products',
    description: 'Configured for Nigerian conditions.',
  },
  {
    icon: Truck,
    title: 'Nationwide delivery',
    description: 'Fast fulfilment from Lagos.',
  },
  {
    icon: LifeBuoy,
    title: 'After-sales support',
    description: 'Setup guidance and maintenance.',
  },
];

// Order Lagos offices before Abuja, then by name.
function pickLagosAbujaOffices(stores: Store[]): Store[] {
  const prag = stores.filter((s) => s.type === 'prag');
  const matches = prag.filter((s) => {
    const hay = `${s.name} ${s.city}`.toLowerCase();
    return hay.includes('lagos') || hay.includes('abuja') ||
      hay.includes('obanikoro') || hay.includes('alaba') || hay.includes('lagos island');
  });
  return matches.sort((a, b) => {
    const aLagos = `${a.name} ${a.city}`.toLowerCase().includes('lagos') ||
      a.name.toLowerCase().includes('obanikoro') || a.name.toLowerCase().includes('alaba');
    const bLagos = `${b.name} ${b.city}`.toLowerCase().includes('lagos') ||
      b.name.toLowerCase().includes('obanikoro') || b.name.toLowerCase().includes('alaba');
    if (aLagos && !bLagos) return -1;
    if (!aLagos && bLagos) return 1;
    return a.name.localeCompare(b.name);
  });
}

export default async function ProductAssurance() {
  const stores = await getStores();
  const offices = pickLagosAbujaOffices(stores);

  return (
    <section className="w-full px-4 md:px-20 py-16 md:py-24 bg-stone-50">
      <div className="w-full max-w-[1228px] mx-auto flex flex-col gap-12 md:gap-16">
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-7 md:px-7 md:py-8"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-700/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-sky-700" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-zinc-900 text-lg md:text-xl font-semibold font-['Montserrat'] leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visit + Contact row */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sky-700">
              <MapPin className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium font-['Onest'] uppercase tracking-wider">
                Showrooms
              </span>
            </div>
            <p className="text-zinc-900 text-base md:text-lg font-normal font-['Montserrat'] leading-relaxed max-w-[640px]">
              Visit us at our{' '}
              {offices.length > 0 ? (
                offices.map((office, i) => (
                  <span key={office.id}>
                    {office.map_url ? (
                      <a
                        href={office.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-700 font-medium underline underline-offset-4 decoration-sky-300 hover:decoration-sky-700 transition-colors"
                      >
                        {office.name}
                      </a>
                    ) : (
                      <Link
                        href="/stores"
                        className="text-sky-700 font-medium underline underline-offset-4 decoration-sky-300 hover:decoration-sky-700 transition-colors"
                      >
                        {office.name}
                      </Link>
                    )}
                    {i < offices.length - 1 && <span className="text-zinc-900"> · </span>}
                  </span>
                ))
              ) : (
                <Link
                  href="/stores"
                  className="text-sky-700 font-medium underline underline-offset-4 decoration-sky-300 hover:decoration-sky-700 transition-colors"
                >
                  Lagos &amp; Abuja offices
                </Link>
              )}{' '}
              offices.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-white text-sm md:text-base font-medium font-['Onest'] hover:bg-sky-800 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
