export const dynamic = 'force-dynamic';

import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
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
      <TopBar />
      <NavBar />
      <div className="w-full px-14 pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">Find a Prag Store Near You</h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Connect with authorized Prag stores across Nigeria for expert consultation, product purchases, and professional installation services.
        </p>
      </div>
      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
      <Footer />
    </main>
  );
}
