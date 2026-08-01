export const dynamic = 'force-dynamic';

import CategoryProductsGrid from '@/components/CategoryProductsGrid';
import { getProductBySlug, getProducts, getCategoryBySlug, productUrl, getSiteSettings } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const DISPLAY_NAMES: Record<string, string> = {
    'voltage-stabilizers': 'Stabilizers',
    'inverters': 'Inverters',
    'solar': 'Solar',
    'batteries': 'Batteries',
    'all-prag-stabilizers': 'All Stabilizers',
  };
  const DISPLAY_DESCRIPTIONS: Record<string, string> = {
    'voltage-stabilizers': 'Explore PRAG stabilizers — voltage, thyristor, servo, and relay types. Protect your appliances from voltage fluctuations.',
    'inverters': 'Shop PRAG inverters — hybrid, heavy-duty, and pure sine wave. Reliable power backup for homes and businesses in Nigeria.',
    'solar': 'Discover PRAG solar solutions — panels, charge controllers, and accessories. Harness solar energy for your power needs.',
    'batteries': 'Browse PRAG batteries — tubular, lithium, and battery racks. Long-lasting energy storage for inverter and solar systems.',
    'all-prag-stabilizers': 'Browse all PRAG stabilizers — voltage, thyristor, servo, and relay stabilizers for every load requirement.',
  };
  const name = DISPLAY_NAMES[category] ?? (await getCategoryBySlug(category))?.name ?? category;
  const description = DISPLAY_DESCRIPTIONS[category] ?? `Browse ${name} at PRAG. Quality power engineering products with warranty and nationwide delivery.`;
  return {
    title: `${name} – PRAG`,
    description,
    alternates: { canonical: `https://shop.prag.global/products/${category}` },
    openGraph: {
      title: `${name} – PRAG`,
      description,
      type: 'website',
    },
  };
}

// Known category slug → ID map to skip a network round-trip
const KNOWN_CATEGORY_IDS: Record<string, number> = {
  'inverters': 314,
  'solar': 320,
  'batteries': 327,
  'voltage-stabilizers': 322,
  'all-prag-stabilizers': 321,
  'thyristor-stabilizers': 349,
  'relay-voltage-stabilizers': 323,
  'servo-voltage-stabilizers': 324,
  'advanced-stabilizers': 338,
  'hybrid-inverters': 319,
  'heavy-duty-inverters': 315,
  'pure-sine-wave-inverters': 316,
  'solar-panels': 326,
  'solar-charge-controllers': 325,
  'protective-device': 340,
  'tubular-batteries': 348,
  'lithium-batteries': 344,
  'battery-rack': 339,
};

export async function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  // Check if this category is hidden from the storefront
  const settings = await getSiteSettings();
  const hiddenSet = new Set(settings.hidden_categories ?? []);
  if (hiddenSet.has(category)) notFound();
  if (sp.sub && hiddenSet.has(sp.sub)) notFound();

  const knownId = KNOWN_CATEGORY_IDS[category];
  const knownSubId = sp.sub ? KNOWN_CATEGORY_IDS[sp.sub] : undefined;

  const [cat, activeCategory] = await Promise.all([
    knownId ? Promise.resolve(null) : getCategoryBySlug(category),
    (sp.sub && !knownSubId) ? getCategoryBySlug(sp.sub) : Promise.resolve(null),
  ]);

  if (!knownId && !cat) {
    const product = await getProductBySlug(category);
    if (product) redirect(productUrl(product));
  }

  const resolvedCatId = knownSubId ?? activeCategory?.id ?? (knownId || cat?.id);
  const productCategorySlug = sp.sub ?? category;

  let products: Product[] = [];
  let total = 0;
  try {
    const result = await getProducts({
      category: resolvedCatId ? undefined : productCategorySlug,
      category_id: resolvedCatId,
      page: 1,
      per_page: 16,
    });
    products = result.products;
    total = result.total;
  } catch {
    products = [];
    total = 0;
  }

  if (!knownId && !cat && products.length === 0) notFound();

  const DISPLAY_NAMES: Record<string, string> = {
    'voltage-stabilizers': 'Stabilizers',
    'inverters': 'Inverters',
    'solar': 'Solar',
    'batteries': 'Batteries',
  };
  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'inverters': 'A selection of solar inverters that convert DC power from solar panels into AC power.',
    'voltage-stabilizers': 'Explore our range of voltage stabilizers, designed to protect your appliances from power fluctuations.',
    'batteries': 'Explore our wide range of batteries for solar power, inverters, and other energy storage solutions.',
    'solar': 'Explore our range of solar solutions, designed to maximize energy efficiency and protect against voltage fluctuations.',
  };
  const displayName = DISPLAY_NAMES[category] ?? cat?.name ?? category.charAt(0).toUpperCase() + category.slice(1);
  const displayDescription = CATEGORY_DESCRIPTIONS[category] ?? 'Browse our full range of voltage stabilizers, inverters, batteries, and solar systems — engineered for Nigerian conditions.';

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-[48px] font-bold font-['Montserrat'] text-center leading-snug">{displayName}</h1>
        <p className="max-w-[900px] text-center text-black text-[18px] font-normal font-['Montserrat'] leading-relaxed">{displayDescription}</p>
      </div>

      {/* Products */}
      <div className="w-full px-6 md:px-20 py-12 bg-white flex justify-center">
        <div className="w-full max-w-[1280px]">
          <CategoryProductsGrid
            products={products}
            total={total}
            categorySlug={category}
            activeSub={sp.sub}
          />
        </div>
      </div>
    </main>
  );
}
