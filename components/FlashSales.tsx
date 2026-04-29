'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { formatPrice, productUrl, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
}

const VISIBLE = 3;

export default function FlashSales({ products }: FlashSalesProps) {
  const displayProducts = products.length > 0 ? products : Array(6).fill(null);
  const total = displayProducts.length;
  const maxIndex = Math.max(0, total - VISIBLE);

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

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
    <section className="w-full px-4 md:px-20 pt-10 pb-20 flex flex-col items-center gap-10 overflow-hidden">
      <div className="w-full max-w-[1229px] flex flex-col gap-10">

        {/* Header */}
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-3 md:gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-sky-700" />
              <span className="text-black text-xs md:text-base font-normal font-['Space_Grotesk']">Discount</span>
            </div>
            <h2 className="text-black text-3xl md:text-5xl font-bold font-['Onest']">Flashsales</h2>
          </div>

          {/* Arrow buttons — desktop only */}
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
            className="flex gap-6 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + 8px)))` }}
          >
            {displayProducts.map((product, idx) => {
              const image = product?.images?.[0];
              return (
                <div
                  key={product?.id || idx}
                  className="flex-shrink-0 w-[calc((100%-48px)/3)] md:w-[calc((100%-48px)/3)] flex flex-col gap-4 group"
                  style={{ minWidth: 'calc((100% - 48px) / 3)' }}
                >
                  {/* Image card */}
                  <div className="w-full h-72 px-7 relative bg-white flex justify-center items-center overflow-hidden rounded-2xl">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || product.name}
                        width={250}
                        height={250}
                        className="object-contain w-auto h-[80%] group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-44 h-44 bg-zinc-100 rounded-full flex items-center justify-center">
                        <span className="text-zinc-300 text-xs">No Image</span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4 px-2.5 py-4 bg-red-600 rounded-full flex items-center justify-center z-10">
                      <span className="text-white text-xs font-medium font-['Space_Grotesk']">SALE</span>
                    </div>

                    <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-zinc-500 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full flex flex-col gap-2 text-center">
                      <p className="text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">
                        {product?.name || 'Flash Sale Product'}
                      </p>
                      <div className="flex justify-center items-center gap-2">
                        {product?.regular_price && (
                          <span className="text-zinc-400 text-sm font-light font-['Onest'] line-through">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                        <span className="text-zinc-900 text-base font-semibold font-['Onest']">
                          {product?.price ? formatPrice(product.price) : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <Link
                        href={product ? productUrl(product) : '#'}
                        className="w-32 p-3 bg-sky-700 rounded-[30px] flex justify-center items-center hover:bg-sky-800 transition-colors"
                      >
                        <span className="text-stone-50 text-sm font-medium font-['Space_Grotesk']">Learn more</span>
                      </Link>
                      <a
                        href={product ? shopUrl(product.slug) : '#'}
                        className="py-3 flex items-center gap-1 hover:text-sky-800 transition-colors"
                      >
                        <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">Buy &gt;</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
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
      </div>
    </section>
  );
}
