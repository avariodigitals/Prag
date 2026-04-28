import Link from 'next/link';

export default function BrandBanner() {
  return (
    <section className="w-full p-20 flex flex-col items-center gap-10 overflow-hidden">
      <div className="w-full max-w-[1229px] p-10 bg-slate-100 rounded-3xl flex items-center gap-24">
        <div className="w-72 h-80 bg-sky-700/5 rounded-2xl flex items-center justify-center border border-sky-700/10 shrink-0">
          <span className="text-sky-700/30 text-sm font-['Space_Grotesk']">Brand Banner Image</span>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-black text-6xl font-bold font-['Onest'] leading-[65px]">
            No Hype. Just Inverters That Deliver.
          </h2>
          <p className="w-[631px] text-black text-lg font-normal font-['Space_Grotesk']">
            Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.
          </p>
          <Link
            href={`${process.env.NEXT_PUBLIC_SHOP_URL}/product-category/inverter`}
            className="w-64 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <span className="text-white text-base font-medium font-['Space_Grotesk']">Buy Inverters Built to Last</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
