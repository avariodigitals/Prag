import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-4 md:px-20 py-10 bg-slate-950 flex flex-col justify-center items-center gap-10 overflow-hidden"> 
      <div className="w-full max-w-[1228px] flex flex-col lg:flex-row justify-between items-start gap-10"> 
        <div className="w-full lg:w-96 flex flex-col justify-start items-start gap-4"> 
          <Image 
            className="w-36 h-8" 
            src="/Prag Logo.png" 
            alt="Prag"
            width={150}
            height={34}
          /> 
          <div className="w-full text-white/70 text-base md:text-lg font-normal font-['Space_Grotesk']">
            Nigeria&apos;s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.
          </div> 
          <div className="w-full max-w-52 flex flex-col justify-start items-start gap-2"> 
            <div className="w-full flex justify-start items-center gap-4"> 
              <div className="w-6 h-6 relative overflow-hidden"> 
                <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-white/70 rounded-full" /> 
              </div> 
              <div className="text-white/70 text-base md:text-lg font-normal font-['Space_Grotesk']">+2348032170129</div> 
            </div> 
            <div className="flex justify-start items-center gap-4"> 
              <div className="w-6 h-6 relative overflow-hidden"> 
                <div className="w-5 h-4 left-[2px] top-[4px] absolute bg-white/70" /> 
              </div> 
              <a href="mailto:sales@prag.global" className="text-white/70 text-base md:text-lg font-normal font-['Space_Grotesk'] underline">
                sales@prag.global
              </a> 
            </div> 
          </div> 
        </div> 
        <div className="w-full lg:w-[724px] grid grid-cols-2 md:grid-cols-4 gap-8 lg:flex lg:justify-between lg:items-start"> 
          <div className="flex flex-col justify-start items-start gap-6"> 
            <div className="text-white text-xl md:text-2xl font-bold font-['Space_Grotesk']">Products</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <Link href="/products?category=batteries" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Batteries</Link> 
              <Link href="/products?category=stabilizer" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Stabilizers</Link> 
              <Link href="/products?category=inverter" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Inverter</Link> 
              <Link href="/products?category=solar" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Solar</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-6"> 
            <div className="text-white text-xl md:text-2xl font-bold font-['Space_Grotesk']">Company</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <Link href="/about" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">About us</Link> 
              <Link href="/stores" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">PRAG Stores</Link> 
              <Link href="/knowledge-center" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Knowledge Center</Link> 
              <Link href="/distributor" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Become a Distributor</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-6"> 
            <div className="text-white text-xl md:text-2xl font-bold font-['Space_Grotesk']">Support</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <Link href="/contact" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Contact Us</Link> 
              <Link href="/power-calculator" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Power Calculator</Link> 
              <Link href="/resources" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Technical Resources</Link> 
              <Link href="/shipping-policy" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Shipping Policy</Link> 
              <Link href="/return-policy" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Return policy</Link> 
            </div> 
          </div> 
          <div className="flex flex-col justify-start items-start gap-6"> 
            <div className="text-white text-xl md:text-2xl font-bold font-['Space_Grotesk']">Socials</div> 
            <div className="flex flex-col justify-start items-start gap-2"> 
              <a href="https://facebook.com" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Facebook</a> 
              <a href="https://linkedin.com" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Linkedin</a> 
              <a href="https://instagram.com" className="text-white/70 text-lg md:text-xl font-normal font-['Space_Grotesk'] hover:text-white transition-colors">Instagram</a> 
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
          <div className="text-white/70 text-xs md:text-sm font-normal font-['Space_Grotesk'] leading-5 text-center">© Copyright 2026 PRAG. All rights reserved.</div> 
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
