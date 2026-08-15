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
  { title: 'No Hype. Just Inverters That Deliver.', description: 'Choose inverters engineered for real-world loads. Shop reliable power systems today.', cta: 'Buy Inverters Built to Last', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png', productAlt: 'Heavy Duty Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png' },
  { title: 'Power Your Home. Power Your Business.', description: 'From residential to industrial applications. Trusted inverters for every power need.', cta: 'Explore Our Range', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png', productAlt: 'Residential Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png' },
  { title: 'Built Tough. Tested Tougher.', description: 'Heavy-duty inverters designed to handle the toughest loads without compromise.', cta: 'Shop Heavy Duty Inverters', link: '/inverter', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png', productAlt: 'Industrial Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png' },
  { title: 'Reliable Power. Unbeatable Performance.', description: 'Experience consistent power delivery with inverters engineered for excellence.', cta: 'Get Started Today', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png', productAlt: 'Premium Inverter', backgroundImage: 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png' },
];

const FALLBACK_BG = 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png';
const FALLBACK_WHATSAPP = 'https://wa.me/2348032170129';
const HELP_ME_CHOOSE_TEXT = "Hi PRAG, I need help choosing the right product for my needs.";

const STATS = [
  { value: '36', label: 'States Covered' },
  { value: '15+', label: 'Years Power Expertise' },
  { value: '50K+', label: 'Installations' },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02zM12.04 20.15h-.003a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2 4.5 13.5a.8.8 0 0 0 .6 1.3H11l-1 7.2 8.5-11.5a.8.8 0 0 0-.6-1.3H12l1-7.2Z" />
    </svg>
  );
}

const STAT_ICONS = [MapPinIcon, ClockIcon, BoltIcon];

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

export default function HeroBanner({ slides: slidesProp, heroBg, whatsappLink, slideTransition }: { slides?: Slide[]; heroBg?: string; whatsappLink?: string; slideTransition?: string }) {
  const allSlides = (slidesProp && slidesProp.length > 0) ? slidesProp : FALLBACK_SLIDES;
  const slides = allSlides.filter((s) => s.enabled !== false);
  const bgSrc = heroBg || FALLBACK_BG;
  const waBase = whatsappLink || FALLBACK_WHATSAPP;
  const helpChooseHref = `${waBase}${waBase.includes('?') ? '&' : '?'}text=${encodeURIComponent(HELP_ME_CHOOSE_TEXT)}`;
  const transitionType = (VALID_TRANSITIONS.includes(slideTransition || '') ? slideTransition : 'fade') as TransitionType;
  const transition = TRANSITION_CLASSES[transitionType];
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="w-full px-0 sm:px-0 md:px-0 lg:px-0 pt-0 md:pt-0 lg:pt-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full mx-auto overflow-hidden min-h-[620px] md:min-h-[560px] lg:min-h-[640px] shadow-sm md:bg-transparent">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: `url('${bgSrc}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.55) contrast(1.05)',
          }}
          aria-hidden="true"
        />
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
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${slideBg}')`,
                    backgroundColor: 'lightgray',
                    filter: 'brightness(0.95) contrast(1.05)',
                  }}
                />
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

        <div className="relative z-10 w-full h-full px-5 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 md:py-12 lg:py-16 flex flex-col justify-center min-h-[620px] md:min-h-[560px] lg:min-h-[640px]">
          <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 md:gap-4 lg:gap-6">
            <div className="flex justify-center w-full md:hidden">
              <div className="relative w-48 h-60">
                <Image key={`mobile-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="192px" quality={85} className="object-contain" priority />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-5 md:gap-6 items-center md:items-start text-center md:text-left">
              <div className="flex flex-col gap-3 md:gap-5">
                <h1 key={`title-${current}`} className={`text-white text-3xl sm:text-4xl md:text-[64px] font-bold font-['Onest'] leading-[1.06] transition-all duration-500 ${transition.active}`}>
                  {slide.title}
                </h1>
                <p key={`desc-${current}`} className={`max-w-[580px] text-white/85 text-xl md:text-xl font-normal font-['Montserrat'] leading-[1.45] transition-all duration-500 whitespace-pre-wrap ${transition.active}`}>
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row items-stretch md:items-start justify-center md:justify-start gap-2.5 md:gap-4 w-full md:w-auto">
                  <Link href={slide.link} className="flex-1 md:flex-none md:w-auto px-4 sm:px-8 py-3 md:py-4 bg-sky-700 rounded-3xl md:rounded-full flex justify-center items-center gap-2 hover:bg-sky-800 transition-all hover:scale-105">
                    <span className="text-white text-base sm:text-lg md:text-xl font-medium font-['Montserrat'] whitespace-nowrap">{slide.cta}</span>
                  </Link>
                  <a
                    href={helpChooseHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none md:w-auto px-4 sm:px-6 py-3 md:py-4 rounded-3xl md:rounded-full flex justify-center items-center gap-2 border border-white/40 bg-white/10 md:backdrop-blur-sm hover:bg-white/20 md:hover:border-white/60 transition-all hover:scale-105"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                    <span className="text-white text-base sm:text-lg md:text-xl font-medium font-['Montserrat'] whitespace-nowrap">Chat on WhatsApp</span>
                  </a>
                </div>

                <div className="flex flex-nowrap items-center justify-center md:justify-start divide-x divide-white/25 pt-3 overflow-x-auto">
                  {STATS.map((stat, i) => {
                    const Icon = STAT_ICONS[i];
                    return (
                      <div key={stat.label} className="flex items-center gap-2 md:gap-3 px-3 md:px-5 first:pl-0 last:pr-0 shrink-0">
                        <Icon className="hidden md:block w-8 h-8 text-sky-300 shrink-0" />
                        <span className="flex flex-col leading-tight">
                          <span className="text-white text-lg md:text-2xl font-bold font-['Onest']">{stat.value}</span>
                          <span className="text-white text-xs md:text-white/90 md:font-medium font-bold font-['Montserrat']">{stat.label}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-1 justify-center lg:justify-end md:-ml-4 lg:-ml-6">
              {slide.showProductImage !== false && (
                <div className="relative w-72 h-[360px] lg:w-[380px] lg:h-[440px]">
                  <Image key={`desktop-${current}`} src={slide.productImage} alt={slide.productAlt} fill sizes="(max-width: 1024px) 288px, 380px" quality={85} className="object-contain" loading="eager" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-5 flex justify-center md:justify-start">
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all w-2.5 h-2.5 flex items-center justify-center ${
                    i === current ? 'bg-sky-700 w-6' : 'bg-white/35 hover:bg-white/55'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
