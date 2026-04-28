import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null;
  const rows = [products.slice(0, 3), products.slice(3, 6)].filter((r) => r.length > 0);

  return (
    <section className="w-full px-20 py-24 bg-stone-50 flex flex-col items-center gap-10">
      <h2 className="w-[631px] text-center text-black text-5xl font-bold font-['Onest']">Featured Products</h2>

      <div className="w-full flex flex-col gap-10">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-6">
            {row.map((product) => (
              <ProductCard key={product.id} product={product} bg="bg-stone-50" />
            ))}
          </div>
        ))}
      </div>

      <Link
        href="/products"
        className="w-64 p-4 rounded-3xl border border-sky-700 flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
      >
        <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">View all products</span>
      </Link>
    </section>
  );
}
