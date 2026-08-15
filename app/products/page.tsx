// Product listing renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import ProductsView from '@/components/ProductsView';
import ProductAssurance from '@/components/ProductAssurance';
import SlideOutChat from '@/components/SlideOutChat';
import { getCategories, getProducts, getSiteSettings, filterHiddenProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

const CATEGORY_SLUGS = ['voltage-stabilizers', 'inverters', 'batteries', 'solar'];

export async function generateMetadata() {
  // Shop products index canonicalises to the www SEO/content authority.
  // Search/filter params (q, cats) are excluded so filtered URLs canonicalise to the clean URL.
  const canonical = 'https://www.prag.global/products';
  return {
    title: 'Products – PRAG',
    description: 'Browse all PRAG product categories and power technologies.',
    alternates: { canonical },
    openGraph: {
      title: 'Products – PRAG',
      description: 'Browse all PRAG product categories and power technologies.',
      url: canonical,
      type: 'website',
    },
  };
}

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

  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);
  const hiddenSet = new Set(settings.hidden_categories ?? []);
  const orderMap = new Map((settings.category_order ?? []).map((slug, i) => [slug, i]));
  // Exclude container/legacy categories that shouldn't appear as tabs
  const EXCLUDED_SLUGS = new Set(['all-prag-stabilizers']);
  const visibleCategories = categories.filter((c) => !hiddenSet.has(c.slug) && !EXCLUDED_SLUGS.has(c.slug));
  // Sort category slugs: those in category_order first (in that order), then remaining in original CATEGORY_SLUGS order
  const visibleCategorySlugs = CATEGORY_SLUGS.filter((slug) => !hiddenSet.has(slug)).sort((a, b) => {
    const aIdx = orderMap.get(a);
    const bIdx = orderMap.get(b);
    if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
    if (aIdx !== undefined) return -1;
    if (bIdx !== undefined) return 1;
    return 0;
  });
  const uniqueRequestedCats = Array.from(new Set(requestedCats));
  const validRequestedCats = uniqueRequestedCats.filter((slug) => visibleCategories.some((c) => c.slug === slug));
  const activeFilterNames = validRequestedCats
    .map((slug) => visibleCategories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  const baseAllProductsPromise = query
    ? getProducts({ per_page: 100 }).then(({ products }) => {
        const normalized = query.toLowerCase();
        return {
          products: filterHiddenProducts(products, hiddenSet).filter((product) => {
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
      : getProducts({ per_page: 100 }).then(({ products, total }) => ({ products: filterHiddenProducts(products, hiddenSet), total })).catch(() => ({ products: [] as Product[], total: 0 }));

  const [{ products: allProducts }, ...categoryResults] = await Promise.all([
    baseAllProductsPromise,
    ...visibleCategorySlugs.map((slug) => {
      const cat = visibleCategories.find((category) => category.slug === slug);
      return cat
        ? getProducts({ category_id: cat.id, per_page: 50 }).then(({ products, total }) => ({ products: filterHiddenProducts(products, hiddenSet), total })).catch(() => ({ products: [] as Product[], total: 0 }))
        : Promise.resolve({ products: [] as Product[], total: 0 });
    }),
  ]);

  // Fetch on-sale products for the Sales tab
  const onSaleProducts = filterHiddenProducts(
    await getProducts({ per_page: 100, on_sale: true })
      .then(({ products }) => products)
      .catch(() => [] as Product[]),
    hiddenSet
  );

  const productsByCategory: Record<string, Product[]> = {};
  visibleCategorySlugs.forEach((slug, index) => {
    productsByCategory[slug] = categoryResults[index].products;
  });

  const subcategories = visibleCategories.filter(
    (category) => category.parent > 0 && visibleCategorySlugs.some((slug) => {
      const parent = visibleCategories.find((parentCategory) => parentCategory.slug === slug);
      return parent?.id === category.parent;
    })
  );

  // Sort subcategories by subcategory_order within each parent
  const subOrderMap = settings.subcategory_order ?? {};
  subcategories.sort((a, b) => {
    const parentCat = visibleCategories.find((c) => c.id === a.parent);
    const parentSlug = parentCat?.slug ?? '';
    const subOrder = subOrderMap[parentSlug] ?? [];
    const aIdx = subOrder.indexOf(a.slug);
    const bIdx = subOrder.indexOf(b.slug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const subResults = await Promise.all(
    subcategories.map((subcategory) => getProducts({ category_id: subcategory.id, per_page: 50 }).then(({ products, total }) => ({ products: filterHiddenProducts(products, hiddenSet), total })).catch(() => ({ products: [] as Product[], total: 0 })))
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
          categories={visibleCategories}
          categoryOrder={settings.category_order}
          subcategoryOrder={settings.subcategory_order}
          onSaleProducts={onSaleProducts}
        />
      </div>

      <ProductAssurance />
      <SlideOutChat settings={settings} whatsappNumber={settings.socials?.whatsapp || settings.whatsapp} />
    </main>
  );
}
