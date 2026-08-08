import CompareView from '@/components/CompareView';
import { getProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product Comparison - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more',
  robots: { index: false, follow: true },
};

export default async function ComparePage() {
  let products: Product[] = [];
  try {
    const result = await getProducts({ per_page: 100 });
    products = result.products;
  } catch {
    products = [];
  }

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <CompareView products={products} />
      </div>
    </main>
  );
}
