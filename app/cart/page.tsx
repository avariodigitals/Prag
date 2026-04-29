import Link from 'next/link';
import CartView from '@/components/CartView';

export const metadata = { title: 'My Cart – Prag' };

export default function CartPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/products" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">
            Product Catalog
          </Link>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">Cart</span>
        </div>
        <h1 className="text-black text-xl md:text-4xl font-medium font-['Onest']">My Cart</h1>
      </div>

      <div className="w-full px-4 md:px-20 pt-6 md:pt-10 pb-10 md:pb-20 flex flex-col gap-10">
        <CartView />
      </div>
    </main>
  );
}
