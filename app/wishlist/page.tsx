import WishlistView from '@/components/WishlistView';
import Link from 'next/link';

export const metadata = { title: 'Saved Items – Prag' };

export default function WishlistPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">Saved items</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">Saved items</h1>
      </div>
      <WishlistView />
    </main>
  );
}
