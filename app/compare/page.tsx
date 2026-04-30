import CompareView from '@/components/CompareView';
import { getProductsForCompare } from '@/lib/woocommerce';
import Link from 'next/link';

export const metadata = { title: 'Product Comparison – Prag' };

interface Props {
  searchParams: Promise<{ p1?: string; p2?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const { p1, p2 } = await searchParams;
  const slugs = [p1, p2].filter((s): s is string => Boolean(s));

  const products = await getProductsForCompare(slugs);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Product Comparison</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Product Comparison</h1>
      </div>

      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <CompareView initialProducts={products} />
      </div>
    </main>
  );
}
