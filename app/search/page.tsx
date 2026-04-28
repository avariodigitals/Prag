export const dynamic = 'force-dynamic';

import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
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
      <TopBar />
      <NavBar />

      {/* Hero */}
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <h1 className="text-black text-4xl font-medium font-['Onest']">Search Results</h1>
      </div>

      {/* Results */}
      <div className="w-full px-14 py-10 flex gap-8">
        <SearchResultsGrid products={products} total={total} query={query} />
      </div>

      <Footer />
    </main>
  );
}
