import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="self-stretch px-20 py-10 bg-slate-950 inline-flex flex-col justify-center items-center gap-10 overflow-hidden"> 
      <div className="w-[1228px] inline-flex justify-between items-start"> 
        <div className="w-96 inline-flex flex-col justify-start items-start gap-4"> 
          <Image 
            className="w-36 h-8" 
            src="/Prag Logo.png" 
            alt="Prag"
            width={150}
            height={34}
          /> 
          <div className="self-stretch justify-start text-white/70 text-lg font-normal font-['Space_Grotesk']">
            Nigeria&apos;s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.
          </div> 
          <div className="w-52 flex flex-col justify-start items-start gap-2"> 
            <div className="self-stretch inline-flex justify-start items-center gap-4"> 
              <div className="w-6 h-6 relative overflow-hidden"> 
                <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-white/70 rounded-full" /> 
              </div> 
              <div className="justify-start text-white/70 text-lg font-normal font-['Space_Grotesk']">+2348032170129</div> 
            </div> 
            <div className="inline-flex justify-end items-center gap-4"> 
              <div className="w-6 h-6 relative overflow-hidden"> 
                <div className="w-5 h-4 left-[2px] top-[4px] absolute bg-white/70" /> 
              </div> 
              <a href="mailto:sales@prag.global" className="justify-start text-white/70 text-lg font-normal font-['Space_Grotesk'] underline">
                sales@prag.global
              </a> 
            </div> 
          </div> 
        </div> 
        <div className="w-[724px] flex justify-between items-start"> 
          <div className="w-28 inline-flex flex-col justify-start items-start gap-6"> 
            <div className="self-stretch justify-start text-white text-2xl font-bold font-['Space_Grotesk']">Products</div> 
            <div className="self-stretch flex flex-col justify-start items-start gap-2"> 
              <Link href="/products?category=batteries" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Batteries</Link> 
              <Link href="/products?category=stabilizer" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Stabilizers</Link> 
              <Link href="/products?category=inverter" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Inverter</Link> 
              <Link href="/products?category=solar" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Solar</Link> 
            </div> 
          </div> 
          <div className="inline-flex flex-col justify-start items-start gap-6"> 
            <div className="self-stretch justify-start text-white text-2xl font-bold font-['Space_Grotesk']">Company</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <Link href="/about" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">About us</Link> 
              <Link href="/stores" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">PRAG Stores</Link> 
              <Link href="/knowledge-center" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Knowlegde Center</Link> 
              <Link href="/distributor" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Become a Distributor</Link> 
            </div> 
          </div> 
          <div className="inline-flex flex-col justify-start items-start gap-6"> 
            <div className="self-stretch justify-start text-white text-2xl font-bold font-['Space_Grotesk']">Support</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <Link href="/contact" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Contact Us</Link> 
              <Link href="/power-calculator" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Power Calculator</Link> 
              <Link href="/resources" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Technical Resources</Link> 
              <Link href="/shipping-policy" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Shipping Policy</Link> 
              <Link href="/return-policy" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Return policy</Link> 
            </div> 
          </div> 
          <div className="inline-flex flex-col justify-start items-start gap-6"> 
            <div className="self-stretch justify-start text-white text-2xl font-bold font-['Space_Grotesk']">Socials</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <a href="https://facebook.com" className="self-stretch justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Facebook</a> 
              <a href="https://linkedin.com" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Linkedin</a> 
              <a href="https://instagram.com" className="justify-start text-white/70 text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Instagram</a> 
            </div> 
          </div> 
        </div> 
      </div> 
      <div className="w-[1216px] flex flex-col justify-start items-start gap-4"> 
        <div className="self-stretch h-[0.30px] bg-stone-50/40" /> 
        <div className="self-stretch inline-flex justify-between items-center"> 
          <div className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.</div> 
        </div> 
        <div className="self-stretch flex flex-col justify-center items-center gap-3"> 
          <div className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">© Copyright 2026 PRAG. All rights reserved.</div> 
          <div className="inline-flex justify-center items-center gap-2.5"> 
            <Link href="/privacy" className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Privacy</Link> 
            <div className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">|</div> 
            <Link href="/terms-of-use" className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Terms of use</Link> 
            <div className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5">|</div> 
            <Link href="/sitemap" className="justify-start text-white/70 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-white transition-colors">Sitemap</Link> 
          </div> 
        </div> 
      </div> 
    </div>
  );
}
