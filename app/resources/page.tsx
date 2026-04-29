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
      <div className="w-full px-14 pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">
          Product Documentation & Technical Guides
        </h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Download detailed specifications, installation manuals, and technical documentation for all Prag products.
        </p>
      </div>
      <TechResourcesView products={products} selectedSlug={sp.product} />
    </main>
  );
}
