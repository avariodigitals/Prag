import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const NAV_CATEGORIES = [
  { label: 'Stabilizer', slug: 'all-prag-stabilizers' },
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
              className="px-2 py-2 text-white text-sm xl:text-base font-medium font-['Space_Grotesk'] hover:text-white/80 transition-colors whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 xl:gap-5 min-w-0 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-white shrink-0" />
            <span className="text-white/70 text-xs xl:text-sm font-normal font-['Space_Grotesk'] whitespace-nowrap">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Truck className="w-5 h-5 text-white shrink-0" />
            <span className="text-white/70 text-xs xl:text-sm font-normal font-['Space_Grotesk'] whitespace-nowrap">Nationwide Delivery</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <RefreshCw className="w-5 h-5 text-white shrink-0" />
            <span className="text-white/70 text-xs xl:text-sm font-normal font-['Space_Grotesk'] whitespace-nowrap">7 Days Return Policy</span>
          </div>
        </div>
      </div>
    </>
  );
}
