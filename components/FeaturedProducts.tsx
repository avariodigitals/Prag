import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="w-full px-4 md:px-20 py-10 md:py-24 bg-stone-50 flex flex-col justify-center items-center gap-10">
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-10 md:gap-20">
        <h2 className="w-full max-w-[631px] text-center text-3xl md:text-5xl font-bold font-['Onest'] text-black">
          Featured Products
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6">
          {products.slice(0, 6).map((product, idx) => {
            const isNew = product.date_created
              ? new Date(product.date_created).getTime() > thirtyDaysAgo
              : false;
            return <ProductCard key={product.id} product={product} isNew={isNew} priority={idx === 0} />;
          })}
        </div>
      </div>

      <Link
        href="/products"
        className="w-64 p-4 rounded-3xl outline outline-1 outline-offset-[-1px] outline-sky-700 inline-flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
      >
        <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">View all products</span>
      </Link>
    </div>
  );
}
