import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Use provided products or fall back to an array of 6 nulls to show placeholders
  // that match the user's exact design structure
  const displayProducts = products.length > 0 ? products.slice(0, 6) : Array(6).fill(null);
  const rows = [displayProducts.slice(0, 3), displayProducts.slice(3, 6)];

  return (
    <div className="self-stretch px-20 py-24 bg-stone-50 inline-flex flex-col justify-center items-center gap-10">
      <div className="self-stretch flex flex-col justify-center items-center gap-20">
        <div className="self-stretch flex flex-col justify-center items-center gap-20">
          <div className="self-stretch flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col justify-start items-center gap-7">
              <div className="w-[631px] text-center justify-start text-black text-5xl font-bold font-['Onest']">
                Featured Products
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-center items-center gap-10">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="self-stretch inline-flex justify-start items-center gap-6">
              {row.map((product, colIdx) => {
                const idx = rowIdx * 3 + colIdx;
                
                // Static design properties from user snippet
                const imgSizes = [
                  'w-56 h-72', // 0
                  'w-52 h-56', // 1
                  'w-64 h-64', // 2
                  'w-64 h-64', // 3
                  'w-64 h-60', // 4
                  'w-64 h-64'  // 5
                ];
                
                const heartPositions = [
                  'left-[378px] top-[20px]',
                  'left-[367px] top-[28px]',
                  'left-[364px] top-[21px]',
                  '', // no explicit heart in user snippet for 4th card?
                  'left-[376px] top-[15px]',
                  'left-[356px] top-[23px]'
                ];

                const image = product?.images[0];
                const isNew = product ? new Date(product.date_created).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : (idx === 1);
                const onSale = product ? product.on_sale : (idx === 3);

                return (
                  <div key={product?.id || idx} className="flex-1 relative inline-flex flex-col justify-start items-start gap-4 group">
                    <div className="self-stretch h-72 px-7 bg-stone-50 inline-flex justify-center items-center gap-2.5 overflow-hidden">
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
                        <div className="w-16 px-2.5 py-5 left-[87px] top-[49px] absolute bg-red-600 rounded-[100px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden z-10">
                          <div className="self-stretch justify-start text-stone-50 text-base font-medium font-['Space_Grotesk']">SALE</div>
                        </div>
                      )}

                      {isNew && (
                        <div className="px-2 py-1 left-[74.33px] top-[28px] absolute bg-lime-700 rounded-[10px] flex justify-center items-center gap-2.5 overflow-hidden z-10">
                          <div className="justify-start text-stone-50 text-base font-medium font-['Space_Grotesk']">NEW !</div>
                        </div>
                      )}
                    </div>

                    <div className="self-stretch flex flex-col justify-start items-center gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch text-center justify-start text-zinc-900 text-lg font-medium font-['Onest'] line-clamp-1 group-hover:text-sky-700 transition-colors">
                          {product?.name || '2.5KVA/24V Heavy-Duty Inverter'}
                        </div>
                        <div className="self-stretch inline-flex justify-center items-center">
                          {onSale && product?.regular_price && (
                            <div className="w-20 text-center justify-start text-zinc-900 text-base font-light font-['Onest'] line-through">
                              {formatPrice(product.regular_price)}
                            </div>
                          )}
                          {onSale && !product && (
                             <div className="w-20 text-center justify-start text-zinc-900 text-base font-light font-['Onest'] line-through">191,700.00</div>
                          )}
                          <div className="w-28 text-center justify-start text-zinc-900 text-base font-light font-['Onest']">
                            {product ? formatPrice(product.price) : 'N161,700.00'}
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex justify-center items-center gap-3.5">
                        <Link 
                          href={product ? `/products/${product.slug}` : '#'}
                          className="w-32 p-3 bg-sky-700 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-sky-700 flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors"
                        >
                          <div className="justify-start text-stone-50 text-base font-medium font-['Space_Grotesk']">Learn more</div>
                        </Link>
                        <a 
                          href={product ? shopUrl(product.slug) : '#'}
                          className="w-28 p-3 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
                        >
                          <div className="justify-start text-sky-700 text-base font-medium font-['Space_Grotesk']">Buy &gt;</div>
                        </a>
                      </div>
                    </div>

                    {heartPositions[idx] && (
                      <div className={`w-6 h-6 ${heartPositions[idx]} absolute overflow-hidden`}>
                        <div className="w-4 h-4 left-[3px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-zinc-500 cursor-pointer hover:bg-red-50 transition-colors" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
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
