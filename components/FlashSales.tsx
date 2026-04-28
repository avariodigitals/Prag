import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FlashSalesProps {
  products: Product[];
}

export default function FlashSales({ products }: FlashSalesProps) {
  if (!products.length) return null;

  return (
    <section className="w-full px-20 pt-10 pb-20 flex flex-col items-center gap-10 overflow-hidden">
      <div className="w-full flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-black text-base font-normal font-['Space_Grotesk']">Discount</span>
          </div>
          <h2 className="w-[631px] text-black text-5xl font-bold font-['Onest']">Flashsales</h2>
        </div>

        {/* Products row */}
        <div className="flex gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} bg="bg-white" />
          ))}
        </div>
      </div>

      {/* Carousel dots */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-2.5 bg-sky-700 rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-zinc-300 rounded-lg" />
        ))}
        <div className="w-7 h-3 bg-zinc-300 rounded-lg" />
      </div>
    </section>
  );
}
