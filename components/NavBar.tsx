import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const NAV_CATEGORIES = [
  { label: 'Stabilizer', slug: 'stabilizer' },
  { label: 'Inverter', slug: 'inverter' },
  { label: 'Solar', slug: 'solar' },
  { label: 'Batteries', slug: 'batteries' },
];

export default function NavBar() {
  return (
    <div className="hidden md:flex w-full px-20 py-2 bg-sky-700 justify-between items-center">
      <nav className="flex items-start gap-6">
        {NAV_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products/${cat.slug}`}
            className="p-2.5 text-white text-base font-medium font-['Space_Grotesk'] hover:text-white/80 transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-white" />
          <span className="text-white/70 text-base font-normal font-['Space_Grotesk']">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-white" />
          <span className="text-white/70 text-base font-normal font-['Space_Grotesk']">Nationwide Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-white" />
          <span className="text-white/70 text-base font-normal font-['Space_Grotesk']">7 Days Return Policy</span>
        </div>
      </div>
    </div>
  );
}
