'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, productUrl, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Use provided products or fall back to placeholders
  const displayProducts = products.length > 0 ? products.slice(0, 6) : Array(6).fill(null);
  
  const [thirtyDaysAgo, setThirtyDaysAgo] = useState<number>(0);

  useEffect(() => {
    startTransition(() => {
      setThirtyDaysAgo(Date.now() - 30 * 24 * 60 * 60 * 1000);
    });
  }, []);

  return (
    <div className="w-full px-4 md:px-20 py-10 md:py-24 bg-stone-50 flex flex-col justify-center items-center gap-10">
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-10 md:gap-20">
        <div className="w-full flex flex-col justify-center items-center gap-6">
          <h2 className="w-full max-w-[631px] text-center text-3xl md:text-5xl font-bold font-['Onest'] text-black">
            Featured Products
          </h2>
        </div>

        <div className="w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6">
          {displayProducts.map((product, idx) => {
            const imgSizes = [
              'w-56 h-72',
              'w-52 h-56',
              'w-64 h-64',
              'w-64 h-64',
              'w-64 h-60',
              'w-64 h-64'
            ];
            
            const heartPositions = [
              'right-4 top-4',
              'right-4 top-6',
              'right-4 top-5',
              'right-4 top-4',
              'right-4 top-4',
              'right-4 top-6'
            ];

            const image = product?.images[0];
            const isNew = product && thirtyDaysAgo > 0 
              ? new Date(product.date_created).getTime() > thirtyDaysAgo 
              : (idx === 1);
            const onSale = product ? product.on_sale : (idx === 3);

            return (
              <div key={product?.id || idx} className="flex-1 relative flex flex-col justify-start items-start gap-4 group">
                <div className="w-full h-72 px-7 bg-stone-50 flex justify-center items-center gap-2.5 overflow-hidden relative">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      width={250}
                      height={250}
                      className={`${imgSizes[idx]} object-contain group-hover:scale-105 transition-transform duration-300`}
                    />
                  ) : (
                    <Image 
                      className={imgSizes[idx]} 
                      src={`https://placehold.co/${idx === 1 ? '202x219' : idx === 4 ? '250x245' : '250x250'}`} 
                      alt="placeholder"
                      width={250}
                      height={250}
                      unoptimized
                    />
                  )}

                  {onSale && (
                    <div className="w-16 px-2.5 py-5 left-[20px] top-[20px] absolute bg-red-600 rounded-[100px] flex flex-col justify-center items-center gap-2.5 overflow-hidden z-10">
                      <div className="text-stone-50 text-base font-medium font-['Space_Grotesk']">SALE</div>
                    </div>
                  )}

                  {isNew && (
                    <div className="px-2 py-1 left-[20px] top-[20px] absolute bg-lime-700 rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden z-10">
                      <div className="text-stone-50 text-base font-medium font-['Space_Grotesk']">NEW !</div>
                    </div>
                  )}

                  {heartPositions[idx] && (
                    <div className={`w-6 h-6 ${heartPositions[idx]} absolute overflow-hidden z-20`}>
                      <div className="w-4 h-4 left-[3px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500 cursor-pointer hover:bg-red-50 transition-colors" />
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col justify-start items-center gap-6">
                  <div className="w-full flex flex-col justify-start items-center gap-2 text-center">
                    <div className="w-full text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">
                      {product?.name || '2.5KVA/24V Heavy-Duty Inverter'}
                    </div>
                    <div className="w-full flex justify-center items-center gap-2">
                      {onSale && product?.regular_price && (
                        <div className="text-zinc-900 text-base font-light font-['Onest'] line-through">
                          {formatPrice(product.regular_price)}
                        </div>
                      )}
                      <div className="text-zinc-900 text-base font-light font-['Onest']">
                        {product ? formatPrice(product.price) : 'N161,700.00'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-3.5">
                    <Link
                      href={product ? productUrl(product) : '#'}
                      className="w-32 p-3 bg-sky-700 rounded-[30px] outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
                    >
                      <div className="text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</div>
                    </Link>
                    <a
                      href={product ? shopUrl(product.slug) : '#'}
                      className="py-3 rounded-3xl flex justify-center items-center gap-2.5 hover:text-sky-800 transition-colors"
                    >
                      <div className="text-sky-700 text-base font-medium font-['Space_Grotesk'] group-hover:underline">Buy &gt;</div>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link 
        href="/products"
        className="w-64 p-4 rounded-3xl outline outline-1 outline-offset-[-1px] outline-sky-700 inline-flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
      >
        <div className="justify-start text-sky-700 text-base font-medium font-['Space_Grotesk']">View all products</div>
      </Link>
    </div>
  );
}
