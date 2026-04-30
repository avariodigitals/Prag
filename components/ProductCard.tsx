'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { formatPrice, productUrl, shopUrl } from '@/lib/woocommerce';
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
  const image = product.images[0];

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
    <div className="flex-1 min-w-[300px] relative inline-flex flex-col gap-4 group">
      <div className={`w-full h-80 px-7 ${bg} relative flex justify-center items-center overflow-hidden rounded-2xl`}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            width={220}
            height={275}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="object-contain h-[80%] w-auto group-hover:scale-105 transition-transform duration-300"
            style={{ width: 'auto' }}
          />
        ) : (
          <div className="w-44 h-44 bg-zinc-200 rounded-full flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}

        {product.on_sale && (
          <div className="absolute left-6 top-6 px-3 py-1 bg-red-600 rounded-full flex justify-center items-center overflow-hidden">
            <span className="text-white text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider">SALE</span>
          </div>
        )}

        {isNew && !product.on_sale && (
          <div className="absolute left-6 top-6 px-3 py-1 bg-lime-700 rounded-full flex justify-center items-center overflow-hidden">
            <span className="text-stone-50 text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider">NEW !</span>
          </div>
        )}

        <button
          onClick={handleWishlist}
          disabled={saving}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'text-sky-700 fill-sky-700' : 'text-zinc-500'}`} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 px-2">
        <div className="w-full flex flex-col gap-2">
          <p className="text-center text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">
            {product.name}
          </p>
          <div className="flex justify-center items-center gap-2">
            {product.on_sale && product.regular_price && (
              <span className="text-zinc-400 text-sm font-light font-['Onest'] line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            <span className="text-zinc-900 text-base font-semibold font-['Onest']">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 w-full justify-center">
          <Link
            href={productUrl(product)}
            className="flex-1 max-w-[130px] p-3 bg-sky-700 rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-all hover:shadow-md"
          >
            <span className="text-stone-50 text-sm font-medium font-['Space_Grotesk']">Learn more</span>
          </Link>
          <a
            href={shopUrl(product.slug)}
            className="flex-1 max-w-[110px] p-3 rounded-full flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
          >
            <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">Buy &gt;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
