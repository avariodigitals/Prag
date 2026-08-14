import Link from 'next/link';
import { Shield, Zap, BatteryCharging, Sun, ArrowRight } from 'lucide-react';

interface NeedCard {
  question: string;
  answer: string;
  href: string;
  icon: typeof Shield;
  gradient: string;
  iconBg: string;
  glow: string;
}

const NEEDS: NeedCard[] = [
  {
    question: 'Protect My Appliances',
    answer: 'Stabilizers',
    href: '/products/voltage-stabilizers',
    icon: Shield,
    gradient: 'from-sky-600 via-sky-700 to-blue-900',
    iconBg: 'bg-white/15',
    glow: 'group-hover:shadow-sky-500/40',
  },
  {
    question: 'Keep Power On During Outages',
    answer: 'Inverters',
    href: '/products/inverters',
    icon: Zap,
    gradient: 'from-amber-500 via-orange-600 to-red-700',
    iconBg: 'bg-white/15',
    glow: 'group-hover:shadow-orange-500/40',
  },
  {
    question: 'Get Longer Backup Time',
    answer: 'Batteries',
    href: '/products/batteries',
    icon: BatteryCharging,
    gradient: 'from-emerald-500 via-teal-600 to-cyan-800',
    iconBg: 'bg-white/15',
    glow: 'group-hover:shadow-teal-500/40',
  },
  {
    question: 'Use Solar Power at Home',
    answer: 'Solar',
    href: '/products/solar',
    icon: Sun,
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    iconBg: 'bg-white/15',
    glow: 'group-hover:shadow-amber-500/40',
  },
];

export default function ShopByNeed() {
  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-gradient-to-b from-white via-stone-50 to-white flex flex-col items-center gap-8 md:gap-12">
      <div className="w-full max-w-[1280px] flex flex-col items-center gap-3 md:gap-4 text-center">
        <span className="px-4 py-1.5 rounded-full bg-sky-700/10 text-sky-700 text-xs md:text-sm font-semibold font-['Montserrat'] tracking-wide uppercase">
          Shop by What You Need
        </span>
        <h2 className="text-black text-3xl md:text-5xl font-bold font-['Onest'] leading-tight max-w-3xl">
          What do you need help with?
        </h2>
        <p className="text-stone-500 text-base md:text-lg font-normal font-['Montserrat'] max-w-xl">
          Tell us the problem. We&apos;ll show you the right power solution.
        </p>
      </div>

      <div className="w-full max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {NEEDS.map((need) => {
          const Icon = need.icon;
          return (
            <Link
              key={need.href}
              href={need.href}
              className={`group relative h-64 md:h-72 rounded-3xl overflow-hidden bg-gradient-to-br ${need.gradient} p-6 md:p-7 flex flex-col justify-between shadow-lg ${need.glow} hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300`}
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 -left-12 w-44 h-44 rounded-full bg-black/10 blur-2xl group-hover:bg-black/5 transition-all duration-500"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between">
                <div className={`w-14 h-14 md:w-16 md:h-16 ${need.iconBg} backdrop-blur-sm rounded-2xl flex items-center justify-center ring-1 ring-white/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20 group-hover:bg-white group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-white group-hover:text-sky-700 transition-colors duration-300" />
                </div>
              </div>

              <div className="relative flex flex-col gap-1.5 md:gap-2">
                <p className="text-white/85 text-sm md:text-base font-medium font-['Montserrat'] leading-snug">
                  {need.question}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-2xl md:text-3xl font-bold font-['Onest'] leading-tight">
                    {need.answer}
                  </span>
                  <span className="text-white/70 text-sm font-normal font-['Montserrat'] group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
