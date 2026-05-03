'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
}

const VISIBLE_DESKTOP = 3;

export default function FlashSales({ products }: FlashSalesProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (products.length === 0) return null;

  const maxIndex = Math.max(0, products.length - VISIBLE_DESKTOP);

  function prev() { setCurrent((c) => Math.max(0, c - 1)); }
  function next() { setCurrent((c) => Math.min(maxIndex, c + 1)); }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
  }

  return (
    <section className="w-full px-4 md:px-20 py-8 pb-12 flex flex-col items-center gap-8 overflow-hidden">
      <div className="w-full max-w-[1229px] flex flex-col gap-8">

        {/* Header */}
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-3 md:gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-sky-700" />
              <span className="text-black text-xs md:text-base font-normal font-['Space_Grotesk']">Discount</span>
            </div>
            <h2 className="text-black text-lg md:text-3xl font-bold font-['Onest']">Flashsales</h2>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700" />
            </button>
            <button
              onClick={next}
              disabled={current >= maxIndex}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700" />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          className="w-full overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(calc(-${current} * (100% + 16px)))` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)]"
              >
                <ProductCard product={product} bg="bg-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-10 h-2.5 bg-sky-700' : 'w-2.5 h-2.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
