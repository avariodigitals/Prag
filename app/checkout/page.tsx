import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CheckoutView from '@/components/CheckoutView';

export const metadata = { title: 'Checkout – Prag' };

export default function CheckoutPage() {
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
          <a href="/cart" className="text-zinc-500 text-base font-medium font-['Onest'] hover:underline">Cart</a>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Check out</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Checkout</h1>
      </div>

      <CheckoutView />

      <Footer />
    </main>
  );
}
