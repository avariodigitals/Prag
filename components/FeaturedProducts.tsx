'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { formatPrice, productUrl } from '@/lib/woocommerce';
import { useWishlist } from '@/lib/WishlistContext';
import type { Product } from '@/lib/types';
import type { SiteSettings } from '@/lib/woocommerce';

interface FeaturedProductsProps {
  products: Product[];
  whatsappNumber?: string;
  settings?: SiteSettings;
}

function splitProductName(name: string): { base: string; rating?: string } {
  const match = name.match(/^(.*?)\s*(\([^)]*\d+[^)]*\))\s*$/);
  if (!match) return { base: name };
  const rating = match[2];
  const isRating = /\d+/.test(rating) && /\b(W|VA|KVA|KW|AH|V|MPPT|AMP)\b/i.test(rating);
  if (!isRating) return { base: name };
  return { base: match[1].trim(), rating };
}

/** Pull a very short, useful spec line from the product data. */
function shortSpec(product: Product): string {
  // 1) Try the first attribute (e.g. Capacity: 1.5KVA)
  const firstAttr = product.attributes?.[0];
  if (firstAttr?.options?.length) {
    return `${firstAttr.name}: ${firstAttr.options[0]}`;
  }
  // 2) Try a cleaned snippet of short_description
  const fromDesc = product.short_description
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (fromDesc) {
    return fromDesc.length > 60 ? `${fromDesc.slice(0, 57).trimEnd()}…` : fromDesc;
  }
  // 3) Fall back to the rating pulled out of the name
  const { rating } = splitProductName(product.name);
  return rating ?? '';
}

function BestSellerCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const { base: nameBase, rating: nameRating } = splitProductName(product.name);
  const { isWishlisted, toggle, authed } = useWishlist();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isOutOfStock = product.stock_status === 'outofstock';
  const isOnBackorder = product.stock_status === 'onbackorder';
  const isAvailable = !isOutOfStock && hasValidPrice;

  const spec = shortSpec(product);
  // Hide spec line if it just repeats the rating already shown in the name
  const specIsDuplicate = nameRating && spec && spec.replace(/[^a-zA-Z0-9]/g, '').includes(nameRating.replace(/[^a-zA-Z0-9]/g, ''));

  async function handleWishlist() {
    if (authed === null) return;
    if (!authed) {
      router.push('/login?redirect=/wishlist');
      return;
    }
    setSaving(true);
    await toggle({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      on_sale: product.on_sale,
      image: image?.src ?? '',
      categories: product.categories,
    });
    setSaving(false);
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="w-full relative flex flex-col bg-white rounded-2xl overflow-hidden group transition-shadow hover:shadow-lg hover:shadow-stone-200/60">
      {/* Image */}
      <div className="w-full aspect-square relative flex justify-center items-center overflow-hidden">
        {image ? (
          <>
            <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="block w-full h-full">
              <Image
                src={image.src}
                alt={image.alt || product.name}
                width={500}
                height={500}
                sizes="(min-width: 768px) 25vw, 50vw"
                quality={80}
                loading="lazy"
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
              {product.on_sale && isAvailable && (
                <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
                  Sale
                </span>
              )}
              {isOutOfStock && (
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
                  Out of stock
                </span>
              )}
              {isOnBackorder && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
                  Back order
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              disabled={saving}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute right-3 top-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
            >
              <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'text-sky-700 fill-sky-700' : 'text-zinc-500'}`} />
            </button>
          </>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Name */}
        <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="text-center">
          <h3 className="text-zinc-900 text-base font-bold font-['Montserrat'] leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors" style={{ hyphens: 'auto', wordBreak: 'break-word' }}>
            {nameBase}
            {nameRating && <span> {nameRating}</span>}
          </h3>
        </Link>

        {/* Short spec */}
        {spec && !specIsDuplicate && (
          <p className="text-center text-zinc-500 text-xs font-normal font-['Montserrat'] line-clamp-1 min-h-[16px]">
            {spec}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-center gap-2 min-h-[28px]">
          {product.on_sale && product.regular_price && hasValidPrice && (
            <span className="text-zinc-400 text-sm font-normal font-['Montserrat'] line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
          {hasValidPrice ? (
            <span className="text-lg md:text-xl font-medium font-['Montserrat'] text-sky-700">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-sm font-medium font-['Montserrat'] text-sky-700 uppercase tracking-wide">
              Call for Price
            </span>
          )}
        </div>

        {/* View details */}
        <div className="flex items-center justify-center gap-3 mt-1.5 md:mt-2">
          <Link
            href={productUrl(product)}
            aria-label={`View details for ${product.name}`}
            className="min-w-[108px] px-4 py-2 bg-sky-700 rounded-full text-white text-sm font-medium font-['Montserrat'] text-center hover:bg-sky-800 transition-colors"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts({ products, whatsappNumber, settings }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const enabled = settings?.best_sellers_enabled ?? true;
  if (!enabled) return null;

  const visible = products.slice(0, 8);

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-white flex flex-col justify-center items-center gap-10 md:gap-14">
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-10 md:gap-14">
        {/* Header */}
        <div className="w-full flex flex-col items-center gap-3 md:gap-4 text-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-sky-700 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">
              Best Sellers
            </span>
          </div>
          <h2 className="text-black text-2xl md:text-4xl font-bold font-['Montserrat'] leading-tight">
            Most Popular Right Now
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-normal font-['Montserrat']">
            Now we&apos;re ready to sell.
          </p>
        </div>

        {/* Grid — 4 on mobile, 8 on desktop */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
          {visible.map((product, i) => (
            <div key={product.id} className={i >= 4 ? 'hidden md:block' : ''}>
              <BestSellerCard product={product} />
            </div>
          ))}
        </div>

        {/* View all */}
        <Link
          href="/products"
          className="w-64 p-4 rounded-3xl outline outline-1 outline-offset-[-1px] outline-sky-700 inline-flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
        >
          <span className="text-sky-700 text-sm font-medium font-['Montserrat']">View all products</span>
        </Link>
      </div>
    </section>
  );
}
