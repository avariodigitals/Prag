'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
}

const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

export default function FlashSales({ products }: FlashSalesProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setCurrent(index);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.children[0] as HTMLElement;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 16; // gap-4 = 16px
    const idx = Math.round(track.scrollLeft / cardWidth);
    setCurrent(Math.max(0, Math.min(idx, products.length - 1)));
  }

  if (products.length === 0) return null;

  function prev() { scrollToIndex(Math.max(0, current - 1)); }
  function next() { scrollToIndex(Math.min(products.length - 1, current + 1)); }

  return (
    <section className="w-full px-4 md:px-20 py-8 pb-12 flex flex-col items-center gap-8">
      <div className="w-full max-w-[1229px] flex flex-col gap-8">

        {/* Header */}
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-3 md:gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-sky-700" />
              <span className="text-black text-xs font-medium font-['Montserrat'] uppercase tracking-widest">Discount</span>
            </div>
            <h2 className="text-black text-base md:text-2xl font-bold font-['Montserrat']">Flash Sales</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Previous flash sale products"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700" />
            </button>
            <button
              onClick={next}
              disabled={current >= products.length - 1}
              aria-label="Next flash sale products"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700" />
            </button>
          </div>
        </div>

        {/* Carousel track — CSS scroll-snap for native swipe on mobile */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-full sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)]"
            >
              <ProductCard product={product} bg="bg-white" priceColor={LISTING_PRICE_COLOR} />
            </div>
          ))}
        </div>

        {/* Dots */}
        {products.length > 1 && (
          <div className="flex justify-center items-center gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 min-w-6 min-h-6 flex items-center justify-center ${
                  i === current ? 'bg-sky-700' : 'bg-zinc-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
