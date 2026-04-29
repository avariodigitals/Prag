import Link from 'next/link';
import CheckoutView from '@/components/CheckoutView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Checkout – Prag' };

export default function CheckoutPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      {/* Breadcrumb + title */}
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Link href="/products" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">
            Product Catalog
          </Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <Link href="/cart" className="text-zinc-500 text-base font-medium font-['Onest'] hover:underline">Cart</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Check out</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Checkout</h1>
      </div>

      <CheckoutView />
    </main>
  );
}
