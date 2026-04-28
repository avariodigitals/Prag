export const dynamic = 'force-dynamic';

import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ProductsSidebar from '@/components/ProductsSidebar';
import ProductsGrid from '@/components/ProductsGrid';
import { getCategories, getProductTags, getProducts } from '@/lib/woocommerce';

interface SearchParams {
  category?: string;
  min_price?: string;
  max_price?: string;
  tag?: string;
  sort?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [categories, tags, { products, total }] = await Promise.all([
    getCategories(),
    getProductTags(),
    getProducts({
      category: params.category,
      min_price: params.min_price,
      max_price: params.max_price,
      tag: params.tag,
      orderby: params.sort,
      page: params.page ? Number(params.page) : 1,
    }),
  ]);

  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      {/* Page title */}
      <div className="w-full px-14 pt-11 pb-7 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest']">Power Equipment Catalog</h1>
      </div>

      {/* Content */}
      <div className="w-full px-20 py-10 flex justify-center items-start gap-6">
        <ProductsSidebar categories={categories} tags={tags} />
        <ProductsGrid products={products} total={total} />
      </div>

      <Footer />
    </main>
  );
}
