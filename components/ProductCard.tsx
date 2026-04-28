'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  bg?: string;
}

export default function ProductCard({ product, bg = 'bg-stone-50' }: ProductCardProps) {
  const [isNew, setIsNew] = useState(false);
  const image = product.images[0];

  useEffect(() => {
    const created = new Date(product.date_created);
    const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    setIsNew(diffDays <= 30);
  }, [product.date_created]);

  return (
    <div className="flex-1 relative inline-flex flex-col gap-4">
      {/* Image area */}
      <div className={`w-full h-72 px-7 ${bg} relative flex justify-center items-center overflow-hidden`}>
        {image && (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            width={220}
            height={275}
            className="object-contain h-full w-auto"
          />
        )}

        {product.on_sale && (
          <div className="absolute left-[87px] top-[49px] w-16 px-2.5 py-5 bg-red-600 rounded-[100px] flex flex-col justify-center items-center overflow-hidden">
            <span className="text-white text-base font-medium font-['Space_Grotesk']">SALE</span>
          </div>
        )}

        {isNew && !product.on_sale && (
          <div className="absolute left-[74px] top-[28px] px-2 py-1 bg-lime-700 rounded-[10px] flex justify-center items-center overflow-hidden">
            <span className="text-stone-50 text-base font-medium font-['Space_Grotesk']">NEW !</span>
          </div>
        )}

        <button aria-label="Add to wishlist" className="absolute top-[20px] right-[20px]">
          <Heart className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Info area */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-full flex flex-col gap-2">
          <p className="text-center text-zinc-900 text-lg font-medium font-['Onest']">{product.name}</p>
          <div className="flex justify-center items-center">
            {product.on_sale && product.regular_price && (
              <span className="w-20 text-center text-zinc-900 text-base font-light font-['Onest'] line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
            <span className="w-28 text-center text-zinc-900 text-base font-light font-['Onest']">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <Link
            href={`/products/${product.slug}`}
            className="w-32 p-3 bg-sky-700 rounded-[30px] flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
          >
            <span className="text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</span>
          </Link>
          <a
            href={shopUrl(product.slug)}
            className="w-28 p-3 rounded-3xl flex justify-center items-center gap-2.5 hover:underline"
          >
            <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">Buy &gt;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
