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
}

export default function ProductCard({ product, bg = 'bg-stone-50', isNew = false, priority = false }: ProductCardProps) {
  const { isWishlisted, toggle, authed } = useWishlist();
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const image = product.images?.[0];

  function handleBuyNow() {
    router.push(`/checkout?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&slug=${product.slug}&image=${encodeURIComponent(image?.src ?? '')}`);
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

  return (
    <div className="w-full relative flex flex-col gap-2 group bg-white rounded-xl p-2 hover:shadow-md transition-shadow">
      <div className={`w-full h-48 md:h-56 ${bg} relative flex justify-center items-center rounded-lg overflow-hidden`}>
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
            
            {product.on_sale && (
              <div className="absolute left-2 top-2 w-12 h-12 bg-red-600 rounded-full flex justify-center items-center z-10">
                <span className="text-white text-[10px] font-bold font-['Space_Grotesk'] uppercase tracking-tight">SALE</span>
              </div>
            )}

            {isNew && !product.on_sale && (
              <div className="absolute left-2 top-2 w-12 h-12 bg-lime-700 rounded-full flex justify-center items-center z-10">
                <span className="text-stone-50 text-[10px] font-bold font-['Space_Grotesk'] uppercase tracking-tight">NEW</span>
              </div>
            )}

            <button
              onClick={handleWishlist}
              disabled={saving}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'text-sky-700 fill-sky-700' : 'text-zinc-500'}`} />
            </button>
          </>
        ) : (
          <div className="w-44 h-44 bg-zinc-200 rounded-full flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}

      </div>

      <div className="flex flex-col items-center gap-2 px-1">
        <div className="w-full flex flex-col gap-1">
          <p className="text-center text-zinc-900 text-sm md:text-xs font-medium font-['Onest'] line-clamp-2 group-hover:text-sky-700 transition-colors">
            {product.name}
          </p>
          <div className="flex justify-center items-center gap-2">
            {product.on_sale && product.regular_price && (
              <span className="text-zinc-400 text-xs md:text-[10px] font-light font-['Onest'] line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            <span className="text-zinc-900 text-sm md:text-xs font-semibold font-['Onest']">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 w-full">
          <Link
            href={productUrl(product)}
            className="flex-1 py-1.5 bg-sky-700 rounded-full flex justify-center items-center hover:bg-sky-800 transition-all hover:shadow-md"
          >
            <span className="text-stone-50 text-xs font-medium font-['Space_Grotesk'] whitespace-nowrap">Learn more</span>
          </Link>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-1.5 rounded-full flex justify-center items-center hover:bg-sky-50 transition-colors border border-sky-700"
          >
            <span className="text-sky-700 text-xs font-medium font-['Space_Grotesk'] whitespace-nowrap">Buy now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
