// Product detail page uses ISR while preserving fresh review/doc windows.
export const revalidate = 3600;

import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts, getProductReviews, getTechDocuments, getProductCustomTabs, getAllProductSlugs } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const allSlugs = await getAllProductSlugs();
  return allSlugs.map(({ slug, category }) => ({
    category,
    slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} – PRAG` : 'Product – PRAG' };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const [product, { products: related }] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ category, per_page: 4 }),
  ]);

  if (!product) notFound();

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
