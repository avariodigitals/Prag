import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import WishlistView from '@/components/WishlistView';

export const metadata = { title: 'Saved Items - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect('/login?redirect=/wishlist');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat']">Saved items</h1>
      </div>
      <WishlistView />
    </main>
  );
}
