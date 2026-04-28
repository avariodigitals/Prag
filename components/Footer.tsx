import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

const LINKS = {
  Products: [
    { label: 'Batteries', href: '/products?category=batteries' },
    { label: 'Stabilizers', href: '/products?category=stabilizer' },
    { label: 'Inverter', href: '/products?category=inverter' },
    { label: 'Solar', href: '/products?category=solar' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Prag Stores', href: '/stores' },
    { label: 'Knowledge Center', href: '/knowledge-center' },
    { label: 'Become a Distributor', href: '/distributor' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Power Calculator', href: '/power-calculator' },
    { label: 'Technical Resources', href: '/resources' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Return policy', href: '/return-policy' },
  ],
  Socials: [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full px-20 py-10 bg-slate-950 flex flex-col items-center gap-10 overflow-hidden">
      <div className="w-full max-w-[1228px] flex justify-between items-start">
        {/* Brand column */}
        <div className="w-96 flex flex-col gap-4">
          <Image src="/Prag Logo.png" alt="Prag" width={150} height={34} />
          <p className="text-white/70 text-lg font-normal font-['Space_Grotesk']">
            Nigeria&apos;s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-lg font-normal font-['Space_Grotesk']">+2348032170129</span>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-white/70" />
              <a href="mailto:sales@prag.global" className="text-white/70 text-lg font-normal font-['Space_Grotesk'] underline hover:text-white transition-colors">
                sales@prag.global
              </a>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="w-[724px] flex justify-between items-start">
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-6">
              <span className="text-white text-2xl font-bold font-['Space_Grotesk']">{title}</span>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full max-w-[1216px] flex flex-col gap-4">
        <div className="w-full h-px bg-stone-50/40" />
        <p className="text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">
          The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.
        </p>
        <div className="flex flex-col items-center gap-3">
          <span className="text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">
            © Copyright 2026 Prag. All rights reserved.
          </span>
          <div className="flex items-center gap-2.5">
            {['Privacy', 'Terms of use', 'Sitemap'].map((item, i, arr) => (
              <Fragment key={item}>
                <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">
                  {item}
                </Link>
                {i < arr.length - 1 && <span className="text-white/70 text-sm">|</span>}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
