import CompareView from '@/components/CompareView';
import { getProducts } from '@/lib/woocommerce';

export const metadata = { title: 'Product Comparison - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default async function ComparePage() {
  const { products } = await getProducts({ per_page: 100 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <CompareView products={products} />
      </div>
    </main>
  );
}
