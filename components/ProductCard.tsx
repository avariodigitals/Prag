'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { formatPrice, productUrl } from '@/lib/woocommerce';
import { useWishlist } from '@/lib/WishlistContext';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  bg?: string;
  isNew?: boolean;
  priority?: boolean;
  priceColor?: string;
}

export default function ProductCard({ product, bg = 'bg-stone-50', isNew = false, priority = false, priceColor }: ProductCardProps) {
  const { isWishlisted, toggle, authed } = useWishlist();
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const image = product.images?.[0];

  function normalizedPrice(value: string): number {
    const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  function handleBuyNow() {
    const price = normalizedPrice(product.price);
    router.push(`/checkout?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${price}&slug=${product.slug}&image=${encodeURIComponent(image?.src ?? '')}`);
  }

  async function handleWishlist() {
    if (authed === null) return; // still loading auth state, do nothing
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
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isActuallyOutOfStock = product.stock_status === 'outofstock';
  const isOutOfStock = isActuallyOutOfStock || !hasValidPrice;
  const hasNewTag = product.tags?.some((tag) => tag.slug === 'new' || tag.name.toLowerCase().includes('new'));
  const shouldShowNew = (isNew || hasNewTag) && !isOutOfStock;

  return (
    <div className="w-full relative flex flex-col gap-2 md:gap-3 group rounded-xl p-1.5 bg-transparent hover:shadow-sm transition-shadow duration-300">
      <div className={`w-full h-[300px] md:h-[330px] relative flex justify-center items-center rounded-lg overflow-hidden bg-transparent ${bg ? '' : ''}`}>
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt || product.name}
              width={500}
              height={500}
              sizes="(min-width: 768px) 500px, 100vw"
              quality={80}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-full object-contain p-1 md:p-1 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
            />

            <div className="absolute left-2 md:left-2 top-2 md:top-2 z-10 flex flex-col gap-1.5">
              {isActuallyOutOfStock && hasValidPrice && (
                <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wide">
                  Out of stock
                </span>
              )}
              {product.on_sale && !isOutOfStock && (
                <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-600 text-white text-sm md:text-base font-bold font-['Space_Grotesk'] uppercase tracking-tight flex items-center justify-center leading-none">
                  Sale
                </span>
              )}
              {shouldShowNew && !product.on_sale && (
                <span className="px-2 py-1 rounded-full bg-lime-700 text-white text-[10px] font-semibold font-['Space_Grotesk'] uppercase tracking-wide">
                  New
                </span>
              )}
            </div>

            <button
              onClick={handleWishlist}
              disabled={saving}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute right-2 md:right-3 top-2 md:top-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
            >
              <Heart className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${wishlisted ? 'text-sky-700 fill-sky-700' : 'text-zinc-500'}`} />
            </button>
          </>
        ) : (
          <div className="w-40 h-40 bg-zinc-200 rounded-full flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1 pb-2 pt-2 md:pt-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-zinc-900 text-base font-semibold font-['Onest'] leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors text-center">
            {product.name}
          </p>
          <div className="flex items-center justify-center gap-2 mt-0">
            {product.on_sale && product.regular_price && (
              <span className="text-zinc-400 text-xs font-normal font-['Onest'] line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            {hasValidPrice ? (
              <span className="text-base font-normal md:font-medium font-['Onest'] text-zinc-900" style={priceColor ? { color: priceColor } : undefined}>
                {formatPrice(product.price)}
              </span>
            ) : (
              <span className="text-sm font-medium font-['Space_Grotesk'] text-rose-700 uppercase tracking-wide">
                Out of stock
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-1.5 md:mt-2">
          <Link
            href={productUrl(product)}
            aria-label={`Learn more about ${product.name}`}
            className="min-w-[108px] px-4 py-2 bg-sky-700 rounded-full text-white text-sm font-medium font-['Space_Grotesk'] text-center hover:bg-sky-800 transition-colors"
          >
            Learn more
            <span className="sr-only"> about {product.name}</span>
          </Link>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="min-w-[78px] px-3 py-2 rounded-full text-sm font-medium font-['Space_Grotesk'] text-center transition-colors border border-sky-700 text-sky-700 hover:bg-sky-50 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            Buy &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
