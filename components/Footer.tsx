import Image from 'next/image';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';

const FALLBACK_PHONE = '+2348032170129';
const FALLBACK_EMAIL = 'sales@prag.global';
const FALLBACK_DESC = "Nigeria's leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.";
const FALLBACK_SOCIALS = {
  facebook: 'https://www.facebook.com/pragpowersolutions',
  instagram: 'https://www.instagram.com/prag_ng/',
  linkedin: 'https://www.linkedin.com/company/prag/',
  twitter: '',
  whatsapp: '',
};

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const phone = settings?.contact_phone || FALLBACK_PHONE;
  const email = settings?.contact_email || FALLBACK_EMAIL;
  const desc = settings?.footer_description || FALLBACK_DESC;
  const socials = settings?.socials ?? FALLBACK_SOCIALS;

  return (
    <footer className="w-full px-4 md:px-20 py-10 bg-slate-950 flex flex-col justify-center items-center gap-10 overflow-hidden"> 
      <div className="w-full max-w-[1228px] flex flex-col lg:flex-row justify-between items-start gap-10"> 
        <div className="w-full lg:w-96 flex flex-col justify-start items-start gap-4"> 
          <Link href="/"> 
            <Image 
              src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png" 
              alt="Prag"
              width={110}
              height={26}
              style={{ height: 'auto', width: 'auto' }}
            /> 
          </Link> 
          <div className="w-full text-white/70 text-sm font-normal font-['Space_Grotesk']">
            {desc}
          </div> 
          <div className="w-full max-w-52 flex flex-col justify-start items-start gap-2"> 
            <div className="w-full flex justify-start items-center gap-4"> 
              <svg className="w-5 h-5 text-white/70 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <a href={`tel:${phone}`} className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">{phone}</a> 
            </div> 
            <div className="flex justify-start items-center gap-4"> 
              <svg className="w-5 h-4 text-white/70 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <a href={`mailto:${email}`} className="text-white/70 text-sm font-normal font-['Space_Grotesk'] underline hover:text-white transition-colors">
                {email}
              </a> 
            </div> 
          </div> 
        </div> 
        <div className="w-full lg:w-[724px] grid grid-cols-2 md:grid-cols-4 gap-8 lg:flex lg:justify-between lg:items-start"> 
          <div className="flex flex-col justify-start items-start gap-4"> 
            <div className="text-white text-sm font-bold font-['Space_Grotesk']">Products</div> 
            <div className="flex flex-col justify-start items-start gap-1.5"> 
              <Link href="/products/batteries" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Batteries</Link> 
              <Link href="/products/voltage-stabilizers" className="text-white/70 text-xs font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Stabilizers</Link> 
              <Link href="/products/inverters" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Inverter</Link> 
              <Link href="/products/solar" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Solar</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-4"> 
            <div className="text-white text-sm font-bold font-['Space_Grotesk']">Company</div> 
            <div className="flex flex-col justify-start items-start gap-1.5"> 
              <Link href="/about" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">About us</Link> 
              <Link href="/stores" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">PRAG Stores</Link> 
              <Link href="/knowledge-center" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Knowledge Center</Link> 
              <Link href="/distributor" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Become a Distributor</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-4"> 
            <div className="text-white text-sm font-bold font-['Space_Grotesk']">Support</div> 
            <div className="flex flex-col justify-start items-start gap-1.5"> 
              <Link href="/contact" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Contact Us</Link> 
              <Link href="/power-calculator" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Power Calculator</Link> 
              <Link href="/resources" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Technical Resources</Link> 
              <Link href="/shipping-policy" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Shipping Policy</Link> 
              <Link href="/return-policy" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Return policy</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-4"> 
            <div className="text-white text-sm font-bold font-['Space_Grotesk']">Socials</div> 
            <div className="flex flex-col justify-start items-start gap-1.5"> 
              {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Facebook</a>}
              {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Instagram</a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">LinkedIn</a>}
              {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Twitter / X</a>}
            </div> 
          </div> 
        </div> 
      </div> 
      <div className="w-full max-w-[1228px] flex flex-col justify-start items-start gap-4"> 
        <div className="w-full h-[0.30px] bg-stone-50/40" /> 
        <div className="w-full flex flex-col justify-center items-center gap-4"> 
          <div className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 text-center">The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.</div> 
        </div> 
        <div className="w-full flex flex-col justify-center items-center gap-3"> 
          <div className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 text-center">© Copyright {new Date().getFullYear()} PRAG. All rights reserved.</div> 
          <div className="flex justify-center items-center gap-2.5"> 
            <Link href="/privacy" className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Privacy</Link> 
            <div className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5">|</div> 
            <Link href="/terms-of-use" className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Terms of use</Link> 
            <div className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5">|</div> 
            <Link href="/sitemap" className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Sitemap</Link> 
          </div> 
        </div> 
      </div> 
    </footer>
  );
}
