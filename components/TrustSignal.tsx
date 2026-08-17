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
];

const FALLBACK_BADGES: TrustBadge[] = [
  { label: 'Product Warranty' },
  { label: 'Nationwide Delivery' },
  { label: 'Expert Support' },
  { label: 'Secure Checkout' },
];

// Inline check icon for the badges row.
function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-sky-700 shrink-0"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

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

  if (stats.length === 0 && badges.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-20 py-14 md:py-20 bg-gradient-to-b from-white via-stone-50 to-white">
      <div className="w-full max-w-[1280px] mx-auto rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 px-6 py-10 md:px-12 md:py-14 flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
            <span className="text-slate-500 text-sm md:text-base font-semibold font-['Space_Grotesk'] uppercase tracking-wider">
              {kicker}
            </span>
          </div>
          <h2 className="text-slate-900 text-4xl md:text-5xl font-bold font-['Onest'] leading-tight tracking-tight">
            {title}
          </h2>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
            {stats.map((stat, i) => (
              <div
                key={`${stat.value}-${stat.label}-${i}`}
                className="flex flex-col items-center text-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-8 md:py-10 shadow-sm"
              >
                <span className="text-sky-700 text-4xl md:text-5xl font-bold font-['Onest'] leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="text-slate-600 text-sm md:text-lg font-medium font-['Space_Grotesk']">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
            {badges.map((badge, i) => (
              <div
                key={`${badge.label}-${i}`}
                className="flex items-center gap-2 text-slate-700 text-sm md:text-base font-medium font-['Space_Grotesk']"
              >
                <CheckIcon />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
