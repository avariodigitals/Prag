import Link from 'next/link';
import ShippingView from '@/components/ShippingView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shipping – Checkout – Prag' };

export default function ShippingPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/products" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Product Catalog</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <Link href="/checkout" className="text-zinc-500 text-base font-medium font-['Onest'] hover:underline">Check out</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Shipping</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Checkout</h1>
      </div>

      <ShippingView />
    </main>
  );
}
