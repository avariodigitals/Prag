// Public store directory renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import StoresGrid from '@/components/StoresGrid';
import { getStores } from '@/lib/woocommerce';
import type { Store } from '@/lib/types';

export const metadata = {
  title: 'PRAG Stores',
  alternates: { canonical: 'https://shop.prag.global/stores' },
};

const PRAG_STORE_ORDER = ['obanikoro', 'lagos island', 'alaba', 'abuja', 'port harcourt'];

function sortPragStores(stores: Store[]) {
  return [...stores].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aIndex = PRAG_STORE_ORDER.findIndex((k) => aName.includes(k));
    const bIndex = PRAG_STORE_ORDER.findIndex((k) => bName.includes(k));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return aName.localeCompare(bName);
  });
}

export default async function StoresPage() {
  const stores = await getStores();
  const pragStores = sortPragStores(stores.filter((s) => s.type === 'prag'));
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">Find a PRAG Store Near You</h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.
        </p>
      </div>
      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
    </main>
  );
}
