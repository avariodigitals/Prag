import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';
import { getProducts, getSubcategories, getCategoryBySlug } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  return {
    title: cat ? `${cat.name} – Prag` : 'Products – Prag',
    description: cat?.description ?? '',
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  const [cat, subcategories, { products, total }] = await Promise.all([
    getCategoryBySlug(category),
    getSubcategories(category),
    getProducts({
      category: sp.sub ?? category,
      orderby: sp.sort,
      page: sp.page ? Number(sp.page) : 1,
    }),
  ]);

  if (!cat && products.length === 0) notFound();

  const displayName = cat?.name ?? category.charAt(0).toUpperCase() + category.slice(1);
  const description = cat?.description ?? '';

  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      {/* Category hero */}
      <div className="w-full pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">{displayName}</h1>
        {description && (
          <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
            {description}
          </p>
        )}
      </div>

      {/* Products with subcategory tabs */}
      <div className="w-full px-20 py-10 bg-white flex flex-col gap-36">
        <CategoryProductsGrid
          products={products}
          total={total}
          subcategories={subcategories}
          categorySlug={category}
          activeSub={sp.sub}
          activeSort={sp.sort}
        />
      </div>

      <Footer />
    </main>
  );
}
