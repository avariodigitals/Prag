import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="w-full px-20 py-8 bg-black/20 flex flex-col gap-2.5 overflow-hidden" style={{ backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="flex justify-start items-center gap-28">
        <div className="w-[724px] flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-white text-6xl font-bold font-['Onest']">
              No Hype. Just Inverters That Deliver.
            </h1>
            <p className="w-[686px] text-white text-lg font-normal font-['Space_Grotesk']">
              Choose inverters engineered for real-world loads. Shop reliable power systems today.
            </p>
            <Link
              href={`${process.env.NEXT_PUBLIC_SHOP_URL}/product-category/inverter`}
              className="w-64 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
            >
              <span className="text-white text-base font-medium font-['Space_Grotesk']">
                Buy Inverters Built to Last
              </span>
            </Link>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-700 rounded-full" />
            <div className="w-2 h-2 bg-zinc-300 rounded-full" />
            <div className="w-2 h-2 bg-zinc-300 rounded-full" />
            <div className="w-2 h-2 bg-zinc-300 rounded-full" />
          </div>
        </div>

        <Image
          src="/hero-product.png"
          alt="Featured Inverter"
          width={349}
          height={436}
          className="w-80 h-96 object-contain"
          priority
        />
      </div>
    </div>
  );
}
