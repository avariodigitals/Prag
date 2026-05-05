import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full px-4 md:px-20 py-10 md:py-14 bg-stone-50 flex flex-col justify-center items-center gap-8">
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-8 md:gap-12">
        <h2 className="w-full max-w-[631px] text-center text-base md:text-2xl font-bold font-['Onest'] text-black">
          Featured Products
        </h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
          {products.slice(0, 6).map((product, idx) => {
            const isNew = product.tags?.some((tag) => tag.slug === 'new' || tag.name.toLowerCase().includes('new')) ?? false;
            return <ProductCard key={product.id} product={product} isNew={isNew} priority={idx === 0} priceColor={LISTING_PRICE_COLOR} />;
          })}
        </div>
      </div>

      <Link
        href="/products"
        className="w-64 p-4 rounded-3xl outline outline-1 outline-offset-[-1px] outline-sky-700 inline-flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
      >
        <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">View all products</span>
      </Link>
    </div>
  );
}
