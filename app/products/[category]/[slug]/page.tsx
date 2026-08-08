export const dynamic = 'force-dynamic';

import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, searchProducts, productUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);
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
  const [product, relatedResult] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ category, per_page: 4 }).catch(() => ({ products: [] as Product[], total: 0 })),
  ]);
  const related = relatedResult.products;

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

  const [reviews, techDocs, customTabs] = await Promise.all([
    getProductReviews(product.id),
    getTechDocuments(product.id),
    getProductCustomTabs(product.id),
  ]);

  const relatedFiltered = related.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="w-full bg-white flex flex-col">
      <ProductDetailView product={product} relatedProducts={relatedFiltered} reviews={reviews} techDocs={techDocs} customTabs={customTabs} />
    </main>
  );
}
