import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CategoryProductsGrid from '@/components/CategoryProductsGrid';
import { getProductBySlug, getProducts, getSubcategoriesByParentId, getCategoryBySlug, productUrl } from '@/lib/woocommerce';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

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

  const sort = sp.sort ?? '';
  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;

  const [cat, activeCategory] = await Promise.all([
    getCategoryBySlug(category),
    sp.sub ? getCategoryBySlug(sp.sub) : Promise.resolve(null),
  ]);

  if (!cat) {
    const product = await getProductBySlug(category);
    if (product) redirect(productUrl(product));
  }

  const productCategoryId = activeCategory?.id ?? cat?.id;
  const productCategorySlug = sp.sub ?? category;

  const [subcategories, { products, total }] = await Promise.all([
    cat ? getSubcategoriesByParentId(cat.id) : Promise.resolve([]),
    getProducts({
      category: productCategoryId ? undefined : productCategorySlug,
      category_id: productCategoryId,
      orderby,
      order,
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

      {/* Hero */}
      <div className="w-full pt-16 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm font-['Space_Grotesk']">
          <Link href="/" className="text-sky-700 hover:underline">Home</Link>
          <span className="text-zinc-400 mx-1">/</span>
          <Link href="/products" className="text-zinc-500 hover:text-sky-700">Products</Link>
          <span className="text-zinc-400 mx-1">/</span>
          <span className="text-zinc-500">{displayName}</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] text-center">
            {displayName}
          </h1>
          {description && (
            <p className="max-w-[531px] text-center text-sky-700 text-base md:text-lg font-normal font-['Space_Grotesk']"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>

      {/* Products */}
      <div className="w-full px-4 md:px-20 py-10 bg-white flex flex-col gap-10">
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
