// Public resources page is ISR-cached.
export const revalidate = 1800;

import TechResourcesView from '@/components/TechResourcesView';
import { getProducts } from '@/lib/woocommerce';

export const metadata = { title: 'Technical Resources - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { products } = await getProducts({ per_page: 50 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          Product Documentation &amp; Technical Guides
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          Download detailed specifications, installation manuals, and technical documentation for all PRAG products.
        </p>
      </div>
      <TechResourcesView products={products} selectedSlug={sp.product} />
    </main>
  );
}
