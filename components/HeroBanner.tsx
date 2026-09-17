'use client';

import { useState, useEffect, type TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  title: string;
  description: string;
  cta: string;
  link: string;
  productImage: string;
  productAlt: string;
  backgroundImage?: string;
  showProductImage?: boolean;
  enabled?: boolean;
}

const FALLBACK_SLIDES: Slide[] = [
  { title: 'Low, High, or Unstable Voltage?', description: 'Stable Power & Protection for your Appliances and Equipment.', cta: 'Explore PRAG Stabilizers', link: '/products/voltage-stabilizers', productImage: 'https://central.prag.global/wp-content/uploads/2026/08/image-removebg-preview-1.png', productAlt: 'Residential Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/08/stabforprag-2.webp', showProductImage: false },
  { title: 'Frequent Power Outages?', description: 'Keep Your Home or Business Powered Without Interruption.', cta: 'Explore PRAG Inverters', link: '/products/inverters', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png', productAlt: 'Heavy Duty Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/08/inverter-banner.webp', showProductImage: false },
  { title: 'Reliable Energy Storage', description: 'Ensure Dependable Backup Power With High-Performance Battery Systems.', cta: 'Explore PRAG Batteries', link: '/products/batteries', productImage: 'https://central.prag.global/wp-content/uploads/2026/07/image-removebg-preview-1-1.png', productAlt: 'Premium Batteries', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/08/battriesprag.webp', showProductImage: false },
  { title: 'Grid or Generator Dependence?', description: 'Generate Your Own Power and Achieve Energy Independence.', cta: 'Explore PRAG Solar', link: '/products/solar', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png', productAlt: 'Premium Solar', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/08/thesolarbannerr.webp', showProductImage: false },
];

const FALLBACK_BG = 'https://central.prag.global/wp-content/uploads/2026/08/themage.jpeg';

type TransitionType = 'fade' | 'slide' | 'zoom' | 'flip' | 'slide-up' | 'blur' | 'skew' | 'rotate-zoom';

const TRANSITION_CLASSES: Record<TransitionType, { active: string; inactive: string }> = {
  fade:        { active: 'opacity-100',                        inactive: 'opacity-0' },
  slide:       { active: 'opacity-100 translate-x-0',          inactive: 'opacity-0 translate-x-12' },
  zoom:        { active: 'opacity-100 scale-100',              inactive: 'opacity-0 scale-95' },
  flip:        { active: 'opacity-100 rotate-0',               inactive: 'opacity-0 rotate-3' },
  'slide-up':  { active: 'opacity-100 translate-y-0',          inactive: 'opacity-0 translate-y-8' },
  blur:        { active: 'opacity-100 blur-0',                 inactive: 'opacity-0 blur-md' },
  skew:        { active: 'opacity-100 skew-x-0',               inactive: 'opacity-0 skew-x-6' },
  'rotate-zoom': { active: 'opacity-100 rotate-0 scale-100',   inactive: 'opacity-0 rotate-6 scale-90' },
};

const VALID_TRANSITIONS = ['fade', 'slide', 'zoom', 'flip', 'slide-up', 'blur', 'skew', 'rotate-zoom'];

export default function HeroBanner({ slides: slidesProp, heroBg, slideTransition }: { slides?: Slide[]; heroBg?: string; whatsappLink?: string; slideTransition?: string }) {
  const allSlides = (slidesProp && slidesProp.length > 0) ? slidesProp : FALLBACK_SLIDES;
  const slides = allSlides.filter((s) => s.enabled !== false);
  const bgSrc = heroBg || FALLBACK_BG;
  const transitionType = (VALID_TRANSITIONS.includes(slideTransition || '') ? slideTransition : 'fade') as TransitionType;
  const transition = TRANSITION_CLASSES[transitionType];
  const defaultSlideIndex = Math.max(
    0,
    slides.findIndex((item) => item.title.toLowerCase().includes('power your home'))
  );
  const [current, setCurrent] = useState(defaultSlideIndex);
  // Only mount <Image> for slides that have been shown — avoids downloading
  // every full-bleed background upfront while keeping cross-fades smooth for
  // slides already seen (they stay mounted/cached).
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([defaultSlideIndex]));
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const slide = slides[current];

  function goTo(index: number) {
    setLoadedSlides((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
    setCurrent(index);
  }

  function prevSlide() {
    goTo((current - 1 + slides.length) % slides.length);
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
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

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  return (
    <section
      className="w-full px-0 sm:px-0 md:px-0 lg:px-0 pt-0 md:pt-0 lg:pt-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full mx-auto overflow-hidden min-h-[560px] md:min-h-[560px] lg:min-h-[620px] shadow-sm md:bg-transparent">
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          <Image
            src={bgSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center top', filter: 'brightness(0.55) contrast(1.05)' }}
          />
        </div>
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.22) 0%,
                rgba(0, 0, 0, 0.30) 30%,
                rgba(0, 0, 0, 0.48) 60%,
                rgba(0, 0, 0, 0.78) 100%
              )
            `,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 hidden md:block bg-slate-900" aria-hidden="true">
          {slides.map((s, i) => {
            const slideBg = s.backgroundImage || bgSrc;
            return (
              <div
                key={`bg-${i}`}
                className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              >
                {loadedSlides.has(i) && (
                  <Image
                    src={slideBg}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={80}
                    priority={i === defaultSlideIndex}
                    className="object-cover object-center"
                    style={{ filter: 'brightness(0.95) contrast(1.05)', backgroundColor: 'lightgray' }}
                  />
                )}
                <div
                  className={`absolute inset-0 transition-all duration-700 ${i === current ? transition.active : transition.inactive}`}
                  style={{
                    background: `linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.30) 30%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.00) 70%)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 w-full h-full px-5 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 md:py-10 lg:py-12 flex flex-col justify-center min-h-[560px] md:min-h-[560px] lg:min-h-[620px]">
          <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 md:gap-4 lg:gap-6">
            <div className="flex justify-center w-full md:hidden">
              <div className="relative w-60 h-72">
                <Image key={`mobile-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="240px" quality={85} className="object-contain" priority />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-5 md:gap-6 items-center md:items-start text-center md:text-left">
              <div className="flex flex-col gap-3 md:gap-5">
                <h1 key={`title-${current}`} className={`max-w-[620px] text-white text-4xl md:text-[64px] font-bold font-['Onest'] leading-[1.06] transition-all duration-500 ${transition.active}`}>
                  {slide.title}
                </h1>
                <p key={`desc-${current}`} className={`max-w-[540px] text-white/85 text-lg md:text-xl font-normal font-['Montserrat'] leading-[1.45] transition-all duration-500 whitespace-pre-wrap ${transition.active}`}>
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-2.5 md:gap-4 w-full md:w-auto mt-4 md:mt-0">
                  <Link href={slide.link} className="md:flex-none md:w-auto min-w-[240px] sm:min-w-[280px] px-5 sm:px-8 py-3 md:py-4 bg-sky-700 rounded-3xl md:rounded-full flex justify-center items-center gap-2 hover:bg-sky-800 transition-all hover:scale-105">
                    <span className="text-white text-base sm:text-lg md:text-xl font-medium font-['Montserrat'] whitespace-nowrap">{slide.cta}</span>
                  </Link>
                </div>
                <div className="h-6 md:h-0" aria-hidden="true" />
              </div>
            </div>

            <div className="hidden md:flex flex-1 justify-center lg:justify-end md:-ml-4 lg:-ml-6">
              {slide.showProductImage !== false && (
                <div className="relative w-56 h-[300px] lg:w-[300px] lg:h-[360px]">
                  <Image key={`desktop-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="(max-width: 1024px) 224px, 300px" quality={85} className="object-contain" loading="eager" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
