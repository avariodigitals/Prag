import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CartView from '@/components/CartView';

export const metadata = { title: 'My Cart – Prag' };

export default function CartPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      {/* Breadcrumb + title */}
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <a href="/products" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">
            Product Catalog
          </a>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Cart</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">My Cart</h1>
      </div>

      {/* Cart content */}
      <div className="w-full px-20 pt-10 pb-20 flex flex-col gap-10">
        <CartView />
      </div>

      <Footer />
    </main>
  );
}
