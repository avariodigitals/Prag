import Image from 'next/image';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';
import { formatPhone } from '@/lib/formatPhone';

const FALLBACK_PHONE = '+2348032170129';
const FALLBACK_EMAIL = 'sales@prag.global';
const FALLBACK_DESC = "Nigeria's leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.";
const FALLBACK_COLUMNS = [
  { title: 'Products', links: [
    { label: 'Batteries', link: '/products/batteries' },
    { label: 'Stabilizers', link: '/products/voltage-stabilizers' },
    { label: 'Inverter', link: '/products/inverters' },
    { label: 'Solar', link: '/products/solar' },
  ]},
  { title: 'Company', links: [
    { label: 'About us', link: '/about' },
    { label: 'PRAG Stores', link: '/stores' },
    { label: 'Knowledge Center', link: '/knowledge-center' },
    { label: 'Become a Distributor', link: '/distributor' },
  ]},
  { title: 'Support', links: [
    { label: 'Contact Us', link: '/contact' },
    { label: 'FAQ', link: '/faq' },
    { label: 'Power Calculator', link: '/power-calculator' },
    { label: 'Compare Products', link: '/compare' },
    { label: 'Technical Resources', link: '/resources' },
    { label: 'Shipping Policy', link: '/shipping-policy' },
    { label: 'Return policy', link: '/return-policy' },
  ]},
  { title: 'Socials', links: [
    { label: 'Facebook', link: 'https://www.facebook.com/pragpowersolutions' },
    { label: 'Instagram', link: 'https://www.instagram.com/prag_ng/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/prag/' },
    { label: 'Twitter / X', link: 'https://x.com/PRAG_Ng' },
  ]},
];

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const phone = settings?.contact_phone || FALLBACK_PHONE;
  const email = settings?.contact_email || FALLBACK_EMAIL;
  const desc = settings?.footer_description || FALLBACK_DESC;
  const columns = settings?.footer_columns?.length ? settings.footer_columns : FALLBACK_COLUMNS;

  return (
    <footer className="w-full px-6 md:px-28 py-12 bg-[#082F53] flex flex-col justify-center items-center gap-12 overflow-hidden"> 
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between items-start gap-12"> 
        <div className="w-full lg:w-[420px] flex flex-col justify-start items-start gap-5"> 
          <Link href="/"> 
            <Image 
              src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png" 
              alt="PRAG"
              width={140}
              height={34}
              style={{ height: 'auto', width: 'auto' }}
            /> 
          </Link> 
          <div className="w-full text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed whitespace-pre-wrap">
            {desc}
          </div> 
          <div className="w-full max-w-64 flex flex-col justify-start items-start gap-3"> 
            <div className="w-full flex justify-start items-center gap-4"> 
              <svg className="w-5 h-5 text-white/75 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <a href={`tel:${phone}`} className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 hover:text-white transition-colors">{formatPhone(phone)}</a> 
            </div> 
            <div className="flex justify-start items-center gap-4"> 
              <svg className="w-5 h-4 text-white/75 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <a href={`mailto:${email}`} className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 underline hover:text-white transition-colors">
                {email}
              </a> 
            </div> 
          </div> 
        </div> 
        <div className="w-full lg:w-[860px] grid grid-cols-2 md:grid-cols-4 gap-10 lg:flex lg:justify-between lg:items-start">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col justify-start items-start gap-5">
              <div className="text-white text-lg font-bold font-['Onest']">{col.title}</div>
              <div className="flex flex-col justify-start items-start gap-2.5">
                {col.links.map((lnk, lnkIdx) => {
                  const isExternal = /^https?:\/\//i.test(lnk.link);
                  const cls = "text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 hover:text-white transition-colors";
                  return isExternal ? (
                    <a key={lnkIdx} href={lnk.link} target="_blank" rel="noopener noreferrer" className={cls}>{lnk.label}</a>
                  ) : (
                    <Link key={lnkIdx} href={lnk.link} className={cls}>{lnk.label}</Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div> 
      <div className="w-full max-w-[1440px] flex flex-col justify-start items-start gap-5"> 
        <div className="w-full h-px bg-stone-50/40" /> 
        <div className="w-full flex flex-col justify-center items-center gap-4"> 
          <div className="text-white/75 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-6 text-center">The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.</div> 
        </div> 
        <div className="w-full flex flex-col justify-center items-center gap-3"> 
          <div className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 text-center">© Copyright {new Date().getFullYear()} PRAG. All rights reserved.</div> 
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2"> 
            <Link href="/privacy" className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 py-1.5 hover:text-white transition-colors">Privacy</Link> 
            <div className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8">|</div> 
            <Link href="/terms-of-use" className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 py-1.5 hover:text-white transition-colors">Terms of use</Link> 
            <div className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8">|</div> 
            <Link href="/sitemap" className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 py-1.5 hover:text-white transition-colors">Sitemap</Link>
            <div className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8">|</div>
            <a href="#" id="open_preferences_center" className="text-white/75 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-8 py-1.5 hover:text-white transition-colors">Update cookies preferences</a>
          </div> 
        </div> 
      </div> 
    </footer>
  );
}
