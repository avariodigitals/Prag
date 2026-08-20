import type { SiteSettings } from '@/lib/woocommerce';

interface TrustStat {
  value: string;
  label: string;
}

const FALLBACK_STATS: TrustStat[] = [
  { value: '36', label: 'States Covered' },
  { value: '15+', label: 'Years of Power Industry Experience' },
  { value: '50K+', label: 'Systems Installed' },
];

/**
 * Stats Bar — horizontal banner with vertical dividers, matching the
 * prag-b2b ProblemsSection stats bar. Editable from admin via
 * settings.trust_signal_stats ({ value, label }[]).
 */
export default function BuyConfidence({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.trust_signal_enabled ?? true;
  if (!enabled) return null;

  const stats =
    settings?.trust_signal_stats && settings.trust_signal_stats.length > 0
      ? settings.trust_signal_stats
      : FALLBACK_STATS;

  if (stats.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 pt-6 pb-6 md:pt-[39px] md:pb-[39px] bg-white">
        <div
          className="max-w-[1280px] mx-auto grid grid-cols-3 divide-x divide-[#0166A5] text-center gap-0 w-full"
        >
          {stats.map((stat, i) => (
            <div
              key={`${stat.value}-${stat.label}-${i}`}
              className="flex items-center justify-center px-2 md:px-4 py-3 md:py-5"
            >
              <span className="text-[#0166A5] text-[18px] sm:text-[20px] md:text-[34px] leading-[1.2] md:leading-[1.08] tracking-[0] text-center font-['Onest'] font-medium whitespace-pre-line max-w-full">
                {stat.value}
                {'\n'}
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
