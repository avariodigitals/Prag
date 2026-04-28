import Link from 'next/link';
import Image from 'next/image';

export default function BrandBanner() {
  const shopUrl = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

  return (
    <section className="self-stretch p-20 inline-flex flex-col justify-center items-center gap-10 overflow-hidden">
      <div className="w-[1229px] p-10 bg-slate-100 rounded-3xl inline-flex justify-start items-center gap-24">
        <Image 
          className="w-72 h-80 object-contain" 
          src="https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png" 
          alt="Inverter"
          width={280}
          height={330}
        />
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch justify-start text-black text-6xl font-bold font-['Onest'] leading-[65px]">
            No Hype. Just Inverters That Deliver.
          </div>
          <div className="w-[631px] justify-start text-black text-lg font-normal font-['Space_Grotesk']">
            Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.
          </div>
          <Link 
            href={`${shopUrl}/product-category/inverter`}
            className="w-64 p-4 bg-sky-700 rounded-3xl inline-flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <div className="justify-start text-white text-base font-medium font-['Space_Grotesk']">
              Buy Inverters Built to Last
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
