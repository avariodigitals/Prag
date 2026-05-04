import Link from 'next/link';
import Image from 'next/image';

export default function BrandBanner() {
  return (
    <section className="w-full px-4 md:px-20 py-8 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="w-full max-w-[1229px] p-6 md:p-8 bg-slate-100 rounded-3xl flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
        <Image 
          className="w-40 h-48 md:w-56 md:h-64 object-contain" 
          src="https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png" 
          alt="Inverter"
          width={224}
          height={256}
        />
        <div className="flex-1 flex flex-col justify-start items-center md:items-start gap-4 text-center md:text-left">
          <div className="w-full text-black text-xl md:text-2xl font-bold font-['Onest'] leading-tight">
            No Hype. Just Inverters That Deliver.
          </div>
          <div className="w-full max-w-[631px] text-zinc-600 text-sm font-normal font-['Space_Grotesk'] leading-relaxed">
            Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.
          </div>
          <Link 
            href="/products/inverters"
            className="w-full md:w-auto py-2.5 px-5 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <div className="text-white text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap">
              Buy Inverters Built to Last
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
