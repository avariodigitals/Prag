'use client';

import { useState, type TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  title: string;
  description: string;
  cta: string;
  link: string;
  productImage: string;
  productAlt: string;
}

const FALLBACK_SLIDES: Slide[] = [
  { title: 'No Hype. Just Inverters That Deliver.', description: 'Choose inverters engineered for real-world loads. Shop reliable power systems today.', cta: 'Buy Inverters Built to Last', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png', productAlt: 'Heavy Duty Inverter' },
  { title: 'Power Your Home. Power Your Business.', description: 'From residential to industrial applications. Trusted inverters for every power need.', cta: 'Explore Our Range', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png', productAlt: 'Residential Inverter' },
  { title: 'Built Tough. Tested Tougher.', description: 'Heavy-duty inverters designed to handle the toughest loads without compromise.', cta: 'Shop Heavy Duty Inverters', link: '/inverter', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png', productAlt: 'Industrial Inverter' },
  { title: 'Reliable Power. Unbeatable Performance.', description: 'Experience consistent power delivery with inverters engineered for excellence.', cta: 'Get Started Today', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png', productAlt: 'Premium Inverter' },
];

const FALLBACK_BG = 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png';

export default function HeroBanner({ slides: slidesProp, heroBg }: { slides?: Slide[]; heroBg?: string }) {
  const slides = (slidesProp && slidesProp.length > 0) ? slidesProp : FALLBACK_SLIDES;
  const bgSrc = heroBg || FALLBACK_BG;
  const defaultSlideIndex = Math.max(
    0,
    slides.findIndex((item) => item.title.toLowerCase().includes('power your home'))
  );
  const [current, setCurrent] = useState(defaultSlideIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const slide = slides[current];

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  function handleTouchStart(e: TouchEvent<HTMLElement>) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0]?.clientX ?? null);
  }

  function handleTouchMove(e: TouchEvent<HTMLElement>) {
    setTouchEndX(e.targetTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) nextSlide();
    else prevSlide();
  }

  return (
    <section
      className="w-full px-4 md:px-20 py-10 md:py-16 flex flex-col justify-center items-center overflow-hidden relative min-h-[615px] md:min-h-[600px] lg:min-h-[700px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={bgSrc}
        alt="Hero Background"
        fill
        sizes="100vw"
        quality={80}
        className="object-cover"
        priority
      />

      <div className="w-full max-w-[1280px] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6 lg:gap-8 relative z-10">
        <div className="flex justify-center w-full md:hidden">
          <div className="relative w-48 h-60">
            <Image key={`mobile-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="192px" quality={85} className="object-contain" priority />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 md:gap-10 items-center md:items-start text-center md:text-left md:pl-8 lg:pl-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] leading-[1.06] transition-opacity duration-500">
              {slide.title}
            </h1>
            <p className="max-w-[580px] text-white/85 text-lg md:text-xl font-normal font-['Montserrat'] leading-[1.45] transition-opacity duration-500">
              {slide.description}
            </p>
            <div className="flex justify-center md:justify-start">
              <Link href={slide.link} className="w-72 md:w-auto px-8 py-3.5 md:py-4 bg-sky-700 rounded-3xl md:rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-all hover:scale-105">
                <span className="text-white text-lg md:text-xl font-medium font-['Montserrat'] whitespace-nowrap">{slide.cta}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center lg:justify-end md:-ml-6 lg:-ml-10">
          <div className="relative w-80 h-[450px] lg:w-[450px] lg:h-[550px]">
            <Image key={`desktop-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="(max-width: 1024px) 320px, 450px" quality={85} className="object-contain" loading="eager" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all min-w-6 min-h-6 flex items-center justify-center ${
              i === current ? 'bg-sky-700' : 'bg-white/35 hover:bg-white/55'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
