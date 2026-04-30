import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import WishlistView from '@/components/WishlistView';
import Link from 'next/link';

export const metadata = { title: 'Saved Items – Prag' };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect('/login?redirect=/wishlist');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">Saved items</span>
        </div>
        <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']">Saved items</h1>
      </div>
      <WishlistView />
    </main>
  );
}
