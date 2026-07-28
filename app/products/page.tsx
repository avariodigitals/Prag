// Product listing renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import ProductsView from '@/components/ProductsView';
import { getCategories, getProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

const CATEGORY_SLUGS = ['inverters', 'voltage-stabilizers', 'all-prag-stabilizers', 'batteries', 'solar'];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cats?: string }>;
}) {
  const sp = await searchParams;
  const query = String(sp.q ?? '').trim();
  const requestedCats = String(sp.cats ?? '')
    .split(',')
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);

  const categories = await getCategories();
  const uniqueRequestedCats = Array.from(new Set(requestedCats));
  const validRequestedCats = uniqueRequestedCats.filter((slug) => categories.some((c) => c.slug === slug));
  const activeFilterNames = validRequestedCats
    .map((slug) => categories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  const baseAllProductsPromise = query
    ? getProducts({ per_page: 100 }).then(({ products }) => {
        const normalized = query.toLowerCase();
        return {
          products: products.filter((product) => {
            const name = product.name.toLowerCase();
            const categoryNames = (product.categories ?? []).map((category) => category.name.toLowerCase());
            return name.includes(normalized) || categoryNames.some((categoryName) => categoryName.includes(normalized));
          }),
          total: 0,
        };
      }).catch(() => ({ products: [] as Product[], total: 0 }))
    : validRequestedCats.length > 0
      ? Promise.all(
          validRequestedCats.map(async (slug) => {
            const cat = categories.find((c) => c.slug === slug);
            if (!cat) return [] as Product[];
            try {
              const { products } = await getProducts({ category_id: cat.id, per_page: 100 });
              return products;
            } catch {
              return [] as Product[];
            }
          })
        ).then((groups) => {
          const deduped = new Map<number, Product>();
          groups.flat().forEach((product) => {
            if (!deduped.has(product.id)) deduped.set(product.id, product);
          });
          return { products: Array.from(deduped.values()), total: deduped.size };
        })
      : getProducts({ per_page: 100 }).catch(() => ({ products: [] as Product[], total: 0 }));

  const [{ products: allProducts }, ...categoryResults] = await Promise.all([
    baseAllProductsPromise,
    ...CATEGORY_SLUGS.map((slug) => {
      const cat = categories.find((category) => category.slug === slug);
      return cat
        ? getProducts({ category_id: cat.id, per_page: 50 }).catch(() => ({ products: [] as Product[], total: 0 }))
        : Promise.resolve({ products: [] as Product[], total: 0 });
    }),
  ]);

  const productsByCategory: Record<string, Product[]> = {};
  CATEGORY_SLUGS.forEach((slug, index) => {
    productsByCategory[slug] = categoryResults[index].products;
  });

  const subcategories = categories.filter(
    (category) => category.parent > 0 && CATEGORY_SLUGS.some((slug) => {
      const parent = categories.find((parentCategory) => parentCategory.slug === slug);
      return parent?.id === category.parent;
    })
  );

  const subResults = await Promise.all(
    subcategories.map((subcategory) => getProducts({ category_id: subcategory.id, per_page: 50 }).catch(() => ({ products: [] as Product[], total: 0 })))
  );
  subcategories.forEach((subcategory, index) => {
    productsByCategory[subcategory.slug] = subResults[index].products;
  });

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-[48px] font-bold font-['Montserrat'] text-center leading-snug">Our Products</h1>
        <p className="max-w-[900px] text-center text-black text-[18px] font-normal font-['Montserrat'] leading-relaxed">
          Browse our full range of voltage stabilizers, inverters, batteries, and solar systems — engineered for Nigerian conditions.
        </p>
      </div>

      <div className="w-full px-6 md:px-20 py-12">
        {activeFilterNames.length > 0 && (
          <div className="mb-6 flex items-center justify-center">
            <p className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 font-['Onest'] text-center">
              Showing: {activeFilterNames.join(' + ')}
            </p>
          </div>
        )}
        <ProductsView
          allProducts={allProducts}
          productsByCategory={productsByCategory}
          categories={categories}
        />
      </div>
    </main>
  );
}
