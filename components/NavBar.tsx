import Link from 'next/link';
import { ShieldCheck, Truck } from 'lucide-react';
import type { SiteSettings } from '@/lib/woocommerce';

const FALLBACK_MENU = [
  { label: 'Stabilizer', link: '/products/voltage-stabilizers' },
  { label: 'Inverter', link: '/products/inverters' },
  { label: 'Solar', link: '/products/solar' },
  { label: 'Batteries', link: '/products/batteries' },
];

export default function NavBar({ settings }: { settings?: SiteSettings }) {
  const menu = settings?.header_menu?.length ? settings.header_menu : FALLBACK_MENU;

  return (
    <>
      {/* Desktop nav + trust bar */}
      <div className="hidden lg:flex w-full px-4 xl:px-10 2xl:px-20 py-2 bg-sky-700 justify-between items-center gap-3 flex-wrap">
        <nav className="flex items-start gap-2 xl:gap-4 2xl:gap-6 shrink-0 flex-wrap">
          {menu.map((item) => {
            const isExternal = /^https?:\/\//i.test(item.link);
            const cls = "px-2 py-2 text-white text-base xl:text-lg font-medium font-['Onest'] hover:text-white/80 transition-colors whitespace-nowrap";
            return isExternal ? (
              <a key={item.link} href={item.link} target="_blank" rel="noopener noreferrer" className={cls}>{item.label}</a>
            ) : (
              <Link key={item.link} href={item.link} className={cls}>{item.label}</Link>
            );
          })}
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
