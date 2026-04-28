import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
}

export default function FlashSales({ products }: FlashSalesProps) {
  // Use provided products or fall back to an array of 3 nulls to show placeholders
  const displayProducts = products.length > 0 ? products.slice(0, 3) : Array(3).fill(null);

  return (
    <section className="w-full px-4 md:px-20 pt-10 pb-20 flex flex-col items-center gap-10 overflow-hidden">
      <div className="w-full max-w-[1229px] flex flex-col justify-center items-start gap-10">
        <div className="w-full flex justify-start items-center gap-24">
          <div className="flex flex-col justify-start items-start gap-3 md:gap-6">
            <div className="inline-flex justify-start items-center gap-1.5">
              <div className="w-4 h-4 relative bg-sky-700" />
              <div className="justify-start text-black text-xs md:text-base font-normal font-['Space_Grotesk']">Discount</div>
            </div>
            <div className="w-full max-w-[631px] justify-start text-black text-3xl md:text-5xl font-bold font-['Onest']">Flashsales</div>
          </div>
        </div>
        
        <div className="w-full relative flex flex-col md:flex-row justify-start items-center gap-10 md:gap-6">
          {displayProducts.map((product, idx) => {
            const image = product?.images[0];
            
            // Design properties from user snippet
            const imgSizes = [
              'w-64 h-64', // 0
              'w-64 h-60', // 1
              'w-64 h-64', // 2
            ];
            
            const badgePositions = [
              'left-[10%] top-[49px]',
              'left-[15%] top-[28px]',
              'left-[10%] top-[60px]',
            ];

            const heartPositions = [
              'right-4 top-4', // card 0
              'right-4 top-4', // card 1
              'right-4 top-6', // card 2
            ];

            return (
              <div key={product?.id || idx} className="w-full flex flex-col justify-start items-start gap-4 group">
                <div className="w-full h-72 px-7 relative bg-white flex justify-center items-center gap-2.5 overflow-hidden">
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
                      src={`https://placehold.co/${idx === 1 ? '250x245' : '250x253'}`} 
                      alt="placeholder"
                      width={250}
                      height={250}
                      unoptimized
                    />
                  )}
                  
                  <div className={`w-16 px-2.5 py-5 ${badgePositions[idx]} absolute bg-red-600 rounded-[100px] flex flex-col justify-center items-center gap-2.5 overflow-hidden z-10`}>
                    <div className="text-white text-base font-medium font-['Space_Grotesk']">SALE</div>
                  </div>

                  {heartPositions[idx] && (
                    <div className={`w-6 h-6 ${heartPositions[idx]} absolute overflow-hidden`}>
                      <div className="w-4 h-4 left-[3px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500 cursor-pointer hover:bg-red-50 transition-colors mask-heart" />
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col justify-start items-center gap-6">
                  <div className="w-full flex flex-col justify-start items-start gap-2 text-center">
                    <div className="w-full text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">
                      {product?.name || '2.5KVA/24V Heavy-Duty Inverter'}
                    </div>
                    <div className="w-full flex justify-center items-center gap-2">
                      <div className="text-zinc-900 text-base font-light font-['Onest'] line-through">
                        {product?.regular_price ? formatPrice(product.regular_price) : '191,700.00'}
                      </div>
                      <div className="text-zinc-900 text-base font-light font-['Onest']">
                        {product?.price ? formatPrice(product.price) : 'N161,700.00'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-3.5">
                    <Link
                      href={product ? `/products/${product.slug}` : '#'}
                      className="w-32 p-3 bg-sky-700 rounded-[30px] outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
                    >
                      <div className="text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</div>
                    </Link>
                    <Link
                      href={product ? shopUrl(product.id) : '#'}
                      className="py-3 rounded-3xl flex justify-center items-center gap-2.5 hover:text-sky-800 transition-colors"
                    >
                      <div className="text-sky-700 text-base font-medium font-['Space_Grotesk'] group-hover:underline">Buy &gt;</div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-start items-start gap-3">
        <div className="w-11 h-2.5 bg-sky-700 rounded-lg" />
        <div className="w-3 h-3 bg-zinc-300 rounded-lg" />
        <div className="w-3 h-3 bg-zinc-300 rounded-lg" />
        <div className="w-3 h-3 bg-zinc-300 rounded-lg" />
        <div className="w-3 h-3 bg-zinc-300 rounded-lg" />
        <div className="w-3 h-3 bg-zinc-300 rounded-lg" />
        <div className="w-7 h-3 bg-zinc-300 rounded-lg" />
      </div>
    </section>
  );
}
