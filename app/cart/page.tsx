import CartView from '@/components/CartView';

export const metadata = { title: 'My Cart - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default function CartPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat']">My Cart</h1>
      </div>

      <div className="w-full px-4 md:px-20 pt-6 md:pt-10 pb-10 md:pb-20 flex flex-col gap-10">
        <CartView />
      </div>
    </main>
  );
}
