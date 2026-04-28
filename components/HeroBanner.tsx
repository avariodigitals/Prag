import Link from 'next/link';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="w-full px-20 py-16 flex flex-col justify-center items-center overflow-hidden relative min-h-[600px] lg:min-h-[700px]">
      {/* Background Image */}
      <Image
        src="https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
        <div className="flex-1 flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-white text-6xl lg:text-7xl font-bold font-['Onest'] leading-[1.1]">
              No Hype. Just Inverters That Deliver.
            </h1>
            <p className="max-w-[580px] text-white/90 text-lg font-normal font-['Space_Grotesk'] leading-relaxed">
              Choose inverters engineered for real-world loads. <br className="hidden md:block" />
              Shop reliable power systems today.
            </p>
            <Link
              href="/products"
              className="w-fit px-8 py-4 bg-sky-700 rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-all hover:scale-105"
            >
              <span className="text-white text-base font-medium font-['Space_Grotesk']">
                Buy Inverters Built to Last
              </span>
            </Link>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-sky-700 rounded-full" />
            <div className="w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
            <div className="w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
            <div className="w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-80 h-[450px] lg:w-[450px] lg:h-[550px]">
            <Image 
              src="https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png"
              alt="Heavy Duty Inverter"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
