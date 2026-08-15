export const dynamic = 'force-dynamic';

import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, searchProducts, productUrl, getSiteSettings, filterHiddenProducts, isProductHidden, getStores } from '@/lib/woocommerce';
import type { Product, Store } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: 'Product – PRAG' };

  const description = product.short_description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
    || product.description?.replace(/<[^>]+>/g, '').trim().slice(0, 160)
    || `Buy ${product.name} at PRAG. Quality power engineering products with warranty and nationwide delivery.`;
  const imageUrl = product.images?.[0]?.src;
  // Shop product pages canonicalise to the www SEO/content authority.
  // Use the product's WooCommerce category slug (matching www's own canonical)
  // so the shop canonical points to the exact www canonical URL (no chain).
  // The shop page itself is not redirected and remains fully functional (HTTP 200).
  const categorySlug = product.categories?.[0]?.slug ?? category;
  const canonical = `https://www.prag.global/products/${categorySlug}/${product.slug}`;

  return {
    title: `${product.name} – PRAG`,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: product.images?.[0]?.alt || product.name }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const [product, relatedResult, settings] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    getProducts({ category, per_page: 4 }).catch(() => ({ products: [] as Product[], total: 0 })),
    getSiteSettings(),
  ]);
  const hiddenSet = new Set(settings.hidden_categories ?? []);
  const related = filterHiddenProducts(relatedResult.products, hiddenSet);

  if (!product) {
    try {
      const searchQuery = slug.replace(/-/g, ' ');
      const searchResult = await searchProducts(searchQuery, undefined, 1, 5);
      const match = searchResult.products.find((p) =>
        p.slug !== slug && p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        redirect(productUrl(match));
      }
    } catch {
      // Search failed, fall through to notFound
    }
    notFound();
  }

  // Hide product entirely if it belongs to a turned-off category
  if (isProductHidden(product, hiddenSet)) {
    notFound();
  }

  const [reviews, techDocs, customTabs, stores] = await Promise.all([
    getProductReviews(product.id),
    getTechDocuments(product.id),
    getProductCustomTabs(product.id),
    getStores(),
  ]);

  const relatedFiltered = related.filter((p) => p.slug !== slug).slice(0, 3);

  // Pick Lagos & Abuja offices
  const pragStores = stores.filter((s) => s.type === 'prag');
  const offices = pragStores.filter((s) => {
    const hay = `${s.name} ${s.city}`.toLowerCase();
    return hay.includes('lagos') || hay.includes('abuja') ||
      hay.includes('obanikoro') || hay.includes('alaba') || hay.includes('lagos island');
  }).sort((a, b) => {
    const aLagos = `${a.name} ${a.city}`.toLowerCase().includes('lagos') ||
      a.name.toLowerCase().includes('obanikoro') || a.name.toLowerCase().includes('alaba');
    const bLagos = `${b.name} ${b.city}`.toLowerCase().includes('lagos') ||
      b.name.toLowerCase().includes('obanikoro') || b.name.toLowerCase().includes('alaba');
    if (aLagos && !bLagos) return -1;
    if (!aLagos && bLagos) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <main className="w-full bg-white flex flex-col">
      <ProductDetailView product={product} relatedProducts={relatedFiltered} reviews={reviews} techDocs={techDocs} customTabs={customTabs} offices={offices} stats={settings.trust_signal_stats} />
    </main>
  );
}
