import CheckoutView from '@/components/CheckoutView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Checkout - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default function CheckoutPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat']">Checkout</h1>
      </div>

      <CheckoutView />
    </main>
  );
}
