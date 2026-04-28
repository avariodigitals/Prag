import Link from 'next/link';
import Image from 'next/image';

export default function BrandBanner() {
  const shopUrl = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

  return (
    <section className="w-full px-4 md:px-20 py-10 flex flex-col justify-center items-center gap-10 overflow-hidden">
      <div className="w-full max-w-[1229px] p-6 md:p-10 bg-slate-100 rounded-3xl flex flex-col md:flex-row justify-start items-center gap-10 md:gap-24">
        <Image 
          className="w-48 h-56 md:w-72 md:h-80 object-contain" 
          src="https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png" 
          alt="Inverter"
          width={280}
          height={330}
        />
        <div className="flex-1 flex flex-col justify-start items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-full text-black text-3xl md:text-6xl font-bold font-['Onest'] leading-tight md:leading-[65px]">
            No Hype. Just Inverters That Deliver.
          </div>
          <div className="w-full max-w-[631px] text-black text-base md:text-lg font-normal font-['Space_Grotesk']">
            Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.
          </div>
          <Link 
            href={`${shopUrl}/product-category/inverter`}
            className="w-full md:w-64 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <div className="text-white text-base font-medium font-['Space_Grotesk']">
              Buy Inverters Built to Last
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
