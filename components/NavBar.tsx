import Link from 'next/link';
import { ShieldCheck, Truck } from 'lucide-react';

const NAV_CATEGORIES = [
  { label: 'Stabilizer', slug: 'voltage-stabilizers' },
  { label: 'Inverter', slug: 'inverters' },
  { label: 'Solar', slug: 'solar' },
  { label: 'Batteries', slug: 'batteries' },
];

export default function NavBar() {
  return (
    <>
      {/* Desktop nav + trust bar */}
      <div className="hidden lg:flex w-full px-4 xl:px-10 2xl:px-20 py-2 bg-sky-700 justify-between items-center gap-3 flex-wrap">
        <nav className="flex items-start gap-2 xl:gap-4 2xl:gap-6 shrink-0 flex-wrap">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="px-2 py-2 text-white text-base xl:text-lg font-medium font-['Onest'] hover:text-white/80 transition-colors whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 xl:gap-5 min-w-0 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-white shrink-0" />
            <span className="text-white/80 text-sm xl:text-base font-normal font-['Onest'] whitespace-nowrap">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Truck className="w-5 h-5 text-white shrink-0" />
            <span className="text-white/80 text-sm xl:text-base font-normal font-['Onest'] whitespace-nowrap">Nationwide Delivery</span>
          </div>
        </div>
      </div>
    </>
  );
}
