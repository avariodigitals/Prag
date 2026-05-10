import CompareView from '@/components/CompareView';
import { getProducts } from '@/lib/woocommerce';
import Link from 'next/link';

export const metadata = { title: 'Product Comparison - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default async function ComparePage() {
  const { products } = await getProducts({ per_page: 100 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1 text-sm font-['Space_Grotesk']">
          <Link href="/" className="text-sky-700 hover:underline">Home</Link>
          <span className="text-zinc-400 mx-1">/</span>
          <span className="text-zinc-500">Product Comparison</span>
        </div>
      </div>

      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <CompareView products={products} />
      </div>
    </main>
  );
}
