// Public resources page renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import TechResourcesView from '@/components/TechResourcesView';
import { getProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata = {
  title: 'Technical Resources',
  alternates: { canonical: 'https://shop.prag.global/resources' },
};

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [content, productResult] = await Promise.all([
    getB2CPublicContent(),
    getProducts({ per_page: 50 }).catch(() => ({ products: [] as Product[] })),
  ]);

  const page = findB2CPage(content, '/resources');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = heroSection?.summary || 'Product Documentation & Technical Guides';
  const heroDesc = heroSection?.content || 'Download detailed specifications, installation manuals, and technical documentation for all PRAG products.';

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>
      <TechResourcesView products={productResult.products} selectedSlug={sp.product} />
    </main>
  );
}
