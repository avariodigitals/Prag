'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, productUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
  whatsappNumber?: string;
}

const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

function normalizeWhatsapp(raw?: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (!digits) return '2348032170129';
  // Convert leading 0 local format to Nigeria country code.
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  return digits;
}

function splitProductName(name: string): { base: string; rating?: string } {
  const match = name.match(/^(.*?)\s*(\([^)]*\d+[^)]*\))\s*$/);
  if (!match) return { base: name };
  const rating = match[2];
  const isRating = /\d+/.test(rating) && /\b(W|VA|KVA|KW|AH|V|MPPT|AMP)\b/i.test(rating);
  if (!isRating) return { base: name };
  return { base: match[1].trim(), rating };
}

function FlashSaleCard({ product, whatsappDigits }: { product: Product; whatsappDigits: string }) {
  const image = product.images?.[0];
  const { base: nameBase, rating: nameRating } = splitProductName(product.name);

  const regular = Number(product.regular_price);
  const sale = Number(product.sale_price || product.price);
  const save = Number.isFinite(regular) && Number.isFinite(sale) ? regular - sale : 0;
  const hasValidSave = Number.isFinite(save) && save > 0;

  const isOutOfStock = product.stock_status === 'outofstock';

  const orderText = `Hi, I'm interested in the ${product.name} (flash deal).`;
  const orderHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(orderText)}`;

  return (
    <div className={`w-full relative flex flex-col gap-2 md:gap-3 group ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div className="w-full h-[220px] sm:h-[280px] md:h-[330px] relative flex justify-center items-center rounded-lg overflow-hidden bg-stone-50">
        {image ? (
          <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="block w-full h-full">
            <Image
              src={image.src}
              alt={image.alt || product.name}
              width={500}
              height={500}
              sizes="(min-width: 768px) 500px, 100vw"
              quality={80}
              loading="lazy"
              className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}

          <div className="absolute left-2 md:left-2 top-2 md:top-2 z-10 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
              Out of stock
            </span>
          )}
          {!isOutOfStock && (
            <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-red-600 text-white text-xs md:text-base font-bold font-['Montserrat'] uppercase tracking-tight flex items-center justify-center leading-none">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-1 pb-2 pt-2 md:pt-3">
        <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="text-center">
          <p className="text-zinc-900 text-base md:text-lg font-bold font-['Montserrat'] leading-snug md:leading-[30px] line-clamp-2 group-hover:text-sky-700 transition-colors text-center" style={{ hyphens: 'auto', wordBreak: 'break-word' }}>
            {nameBase}
            {nameRating && <span> {nameRating}</span>}
          </p>
        </Link>

        {/* Price block: strikethrough regular, sale price, then savings */}
        <div className="flex flex-col items-center gap-1 mt-0">
          <div className="flex items-center justify-center gap-2">
            {product.regular_price && (
              <span className="text-zinc-400 text-xs md:text-sm font-normal font-['Montserrat'] line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            <span className="text-base md:text-xl font-medium font-['Montserrat'] text-sky-700" style={{ color: LISTING_PRICE_COLOR }}>
              {formatPrice(String(sale))}
            </span>
          </div>
          {hasValidSave && (
            <span className="text-xs md:text-sm font-semibold font-['Montserrat'] text-red-600">
              Save {formatPrice(String(save))}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-1.5 md:mt-2">
          <a
            href={isOutOfStock ? undefined : orderHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={isOutOfStock}
            className={`min-w-[100px] md:min-w-[108px] px-3 md:px-4 py-2 rounded-full text-white text-xs md:text-sm font-medium font-['Montserrat'] text-center inline-flex justify-center items-center gap-2 transition-colors ${
              isOutOfStock ? 'bg-zinc-400 cursor-not-allowed pointer-events-none' : 'bg-sky-700 hover:bg-sky-800'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FlashSales({ products, whatsappNumber }: FlashSalesProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const whatsappDigits = normalizeWhatsapp(whatsappNumber);

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

        {/* Header — left-aligned title, nav arrows on the right */}
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col gap-3 md:gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-sky-700" />
              <span className="text-black text-xs font-medium font-['Montserrat'] uppercase tracking-widest">Deals</span>
            </div>
            <h2 className="text-black text-base md:text-2xl font-bold font-['Montserrat']">Today&apos;s PRAG Deals</h2>
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
              className="snap-start shrink-0 w-[78%] sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/4)]"
            >
              <FlashSaleCard product={product} whatsappDigits={whatsappDigits} />
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
