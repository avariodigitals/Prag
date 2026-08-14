export const dynamic = 'force-dynamic';

import SearchResultsGrid from '@/components/SearchResultsGrid';
import { searchProducts, getSiteSettings, filterHiddenProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

export const metadata = {
  title: 'Search – PRAG',
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? '';

  const rawResult = query
    ? await searchProducts(query, sp.sort, 1, 16)
    : { products: [] as Product[], total: 0 };

  // Strip out any products belonging to hidden categories
  const settings = await getSiteSettings();
  const products = filterHiddenProducts(rawResult.products, settings.hidden_categories);
  const total = products.length;

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat'] text-center">Search Results</h1>
      </div>

      {/* Results */}
      <div className="w-full px-4 md:px-14 py-6 md:py-10 flex gap-8">
        <SearchResultsGrid products={products} total={total} query={query} />
      </div>
    </main>
  );
}
