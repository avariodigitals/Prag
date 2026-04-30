export const dynamic = 'force-dynamic';

import StoresGrid from '@/components/StoresGrid';
import { getStores } from '@/lib/woocommerce';

export const metadata = { title: 'Prag Stores – Prag' };

export default async function StoresPage() {
  const stores = await getStores();
  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] text-center">Find a PRAG Store Near You</h1>
        <p className="max-w-[531px] text-center text-sky-700 text-base md:text-lg font-normal font-['Space_Grotesk']">
          Connect with authorized PRAG stores across Nigeria for expert consultation, product purchases, and professional installation services.
        </p>
      </div>
      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
    </main>
  );
}
