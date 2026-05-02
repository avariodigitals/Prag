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
  const DISPLAY_NAMES: Record<string, string> = {
    'all-prag-stabilizers': 'Stabilizers',
    'inverters': 'Inverters',
    'solar': 'Solar Panels',
    'batteries': 'Batteries',
  };
  const name = DISPLAY_NAMES[category] ?? (await getCategoryBySlug(category))?.name ?? category;
  return {
    title: `${name} – Prag`,
    description: '',
  };
}

// Known category slug → ID map to skip a network round-trip
const KNOWN_CATEGORY_IDS: Record<string, number> = {
  'inverters': Number(process.env.WC_CAT_INVERTERS ?? 0),
  'solar': Number(process.env.WC_CAT_SOLAR ?? 0),
  'batteries': Number(process.env.WC_CAT_BATTERIES ?? 0),
  'all-prag-stabilizers': Number(process.env.WC_CAT_STABILIZERS ?? 0),
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  const sort = sp.sort ?? '';
  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;

  const knownId = KNOWN_CATEGORY_IDS[category];

  const [cat, activeCategory] = await Promise.all([
    knownId ? Promise.resolve(null) : getCategoryBySlug(category),
    sp.sub ? getCategoryBySlug(sp.sub) : Promise.resolve(null),
  ]);

  if (!knownId && !cat) {
    const product = await getProductBySlug(category);
    if (product) redirect(productUrl(product));
  }

  const resolvedCatId = activeCategory?.id ?? (knownId || cat?.id);
  const productCategorySlug = sp.sub ?? category;

  const [subcategories, { products, total }] = await Promise.all([
    resolvedCatId ? getSubcategoriesByParentId(resolvedCatId) : Promise.resolve([]),
    getProducts({
      category: resolvedCatId ? undefined : productCategorySlug,
      category_id: resolvedCatId,
      orderby,
      order,
      page: sp.page ? Number(sp.page) : 1,
    }),
  ]);

  if (!knownId && !cat && products.length === 0) notFound();

  const DISPLAY_NAMES: Record<string, string> = {
    'all-prag-stabilizers': 'Stabilizers',
    'inverters': 'Inverters',
    'solar': 'Solar Panels',
    'batteries': 'Batteries',
  };
  const displayName = DISPLAY_NAMES[category] ?? cat?.name ?? category.charAt(0).toUpperCase() + category.slice(1);
  const description = cat?.description ?? '';

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full pt-10 md:pt-12 pb-6 md:pb-8 bg-stone-50 flex flex-col items-center gap-3 md:gap-4 px-4">
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
      <div className="w-full px-4 md:px-20 py-6 md:py-8 bg-white flex justify-center">
        <div className="w-full max-w-[1280px]">
          <CategoryProductsGrid
          products={products}
          total={total}
          subcategories={subcategories}
          categorySlug={category}
          activeSub={sp.sub}
          activeSort={sp.sort}
        />
        </div>
      </div>
    </main>
  );
}
