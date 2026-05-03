'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SLIDES = [
  {
    title: 'No Hype. Just Inverters That Deliver.',
    description: 'Choose inverters engineered for real-world loads. Shop reliable power systems today.',
    cta: 'Buy Inverters Built to Last',
    link: '/products',
    productImage: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
    productAlt: 'Heavy Duty Inverter',
  },
  {
    title: 'Power Your Home. Power Your Business.',
    description: 'From residential to industrial applications. Trusted inverters for every power need.',
    cta: 'Explore Our Range',
    link: '/products',
    productImage: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
    productAlt: 'Residential Inverter',
  },
  {
    title: 'Built Tough. Tested Tougher.',
    description: 'Heavy-duty inverters designed to handle the toughest loads without compromise.',
    cta: 'Shop Heavy Duty Inverters',
    link: '/inverter',
    productImage: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
    productAlt: 'Industrial Inverter',
  },
  {
    title: 'Reliable Power. Unbeatable Performance.',
    description: 'Experience consistent power delivery with inverters engineered for excellence.',
    cta: 'Get Started Today',
    link: '/products',
    productImage: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
    productAlt: 'Premium Inverter',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];
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
        {/* Product Image — top on mobile, right on desktop */}
        <div className="flex justify-center w-full md:hidden">
          <div className="relative w-48 h-60">
            <Image 
              key={`mobile-${current}`}
              src={slide.productImage}
              alt={slide.productAlt}
              fill
              sizes="192px"
              className="object-contain transition-opacity duration-500"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 md:gap-10 items-center md:items-start text-center md:text-left">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-white text-3xl md:text-6xl lg:text-7xl font-bold font-['Onest'] leading-[1.1] transition-opacity duration-500">
              {slide.title}
            </h1>
            <p className="max-w-[580px] text-white/90 text-lg font-normal font-['Space_Grotesk'] leading-relaxed transition-opacity duration-500">
              {slide.description}
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                href={slide.link}
                className="w-64 md:w-fit px-8 py-4 bg-sky-700 rounded-3xl md:rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-all hover:scale-105"
              >
                <span className="text-white text-base font-medium font-['Space_Grotesk']">
                  {slide.cta}
                </span>
              </Link>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-sky-700' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Product Image (Right) */}
        <div className="hidden md:flex flex-1 justify-center lg:justify-end">
          <div className="relative w-80 h-[450px] lg:w-[450px] lg:h-[550px]">
            <Image 
              key={`desktop-${current}`}
              src={slide.productImage}
              alt={slide.productAlt}
              fill
              sizes="(max-width: 1024px) 320px, 450px"
              className="object-contain transition-opacity duration-500"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
