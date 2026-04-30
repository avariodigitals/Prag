export const dynamic = 'force-dynamic';

import TechResourcesView from '@/components/TechResourcesView';
import { getProducts } from '@/lib/woocommerce';

export const metadata = { title: 'Technical Resources – Prag' };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { products } = await getProducts({ per_page: 50 });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] text-center">
          Product Documentation &amp; Technical Guides
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-base md:text-lg font-normal font-['Space_Grotesk']">
          Download detailed specifications, installation manuals, and technical documentation for all PRAG products.
        </p>
      </div>
      <TechResourcesView products={products} selectedSlug={sp.product} />
    </main>
  );
}
