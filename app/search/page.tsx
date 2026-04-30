export const dynamic = 'force-dynamic';

import SearchResultsGrid from '@/components/SearchResultsGrid';
import { searchProducts } from '@/lib/woocommerce';

interface Props {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? '';

  const { products, total } = query
    ? await searchProducts(query, sp.sort, sp.page ? Number(sp.page) : 1)
    : { products: [], total: 0 };

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-4xl font-medium font-['Onest']">Search Results</h1>
      </div>

      {/* Results */}
      <div className="w-full px-4 md:px-14 py-6 md:py-10 flex gap-8">
        <SearchResultsGrid products={products} total={total} query={query} />
      </div>
    </main>
  );
}
