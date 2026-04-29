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

  const sort = params.sort ?? '';
  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;

  const [categories, tags, { products, total }] = await Promise.all([
    getCategories(),
    getProductTags(),
    getProducts({
      category: params.category,
      min_price: params.min_price,
      max_price: params.max_price,
      tag: params.tag,
      orderby,
      order,
      page: params.page ? Number(params.page) : 1,
    }),
  ]);

  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      {/* Page title */}
      <div className="w-full px-4 md:px-14 pt-8 md:pt-11 pb-6 md:pb-7 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] text-center">Power Equipment Catalog</h1>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-20 py-10 flex justify-center items-start gap-6">
        {/* Sidebar — desktop only */}
        <div className="hidden md:block">
          <ProductsSidebar categories={categories} tags={tags} />
        </div>
        <ProductsGrid products={products} total={total} categories={categories} tags={tags} />
      </div>

      <Footer />
    </main>
  );
}
