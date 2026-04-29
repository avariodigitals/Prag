import Link from 'next/link';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="w-full px-4 md:px-20 py-10 md:py-16 flex flex-col justify-center items-center overflow-hidden relative min-h-[615px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Background Image */}
      <Image
        src="https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/60" />

      <div className="w-full max-w-[1280px] flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 relative z-10">
        {/* Mobile Product Image (Top) */}
        <div className="md:hidden flex justify-center w-full mb-4">
          <div className="relative w-48 h-60">
            <Image 
              src="https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png"
              alt="Heavy Duty Inverter"
              fill
              sizes="192px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 md:gap-10 items-center md:items-start text-center md:text-left">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-white text-3xl md:text-6xl lg:text-7xl font-bold font-['Onest'] leading-[1.1]">
              No Hype. Just Inverters That Deliver.
            </h1>
            <p className="max-w-[580px] text-white/90 text-lg font-normal font-['Space_Grotesk'] leading-relaxed">
              Choose inverters engineered for real-world loads. <br className="hidden md:block" />
              Shop reliable power systems today.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                href="/products"
                className="w-64 md:w-fit px-8 py-4 bg-sky-700 rounded-3xl md:rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-all hover:scale-105"
              >
                <span className="text-white text-base font-medium font-['Space_Grotesk']">
                  Buy Inverters Built to Last
                </span>
              </Link>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="hidden md:block w-2.5 h-2.5 bg-sky-700 rounded-full" />
            <div className="hidden md:block w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
            <div className="hidden md:block w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
            <div className="hidden md:block w-2.5 h-2.5 bg-white/20 rounded-full cursor-pointer hover:bg-white/40 transition-colors" />
            
            {/* Mobile indicator */}
            <div className="md:hidden w-14 h-2.5 bg-white" />
          </div>
        </div>

        {/* Desktop Product Image (Right) */}
        <div className="hidden md:flex flex-1 justify-center lg:justify-end">
          <div className="relative w-80 h-[450px] lg:w-[450px] lg:h-[550px]">
            <Image 
              src="https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png"
              alt="Heavy Duty Inverter"
              fill
              sizes="(max-width: 1024px) 320px, 450px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
