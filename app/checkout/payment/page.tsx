import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PaymentView from '@/components/PaymentView';

export const metadata = { title: 'Payment – Checkout – Prag' };

export default function PaymentPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <a href="/products" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Product Catalog</a>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <a href="/checkout" className="text-zinc-500 text-base font-medium font-['Onest'] hover:underline">Check out</a>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Payment</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Checkout</h1>
      </div>

      <PaymentView />

      <Footer />
    </main>
  );
}
