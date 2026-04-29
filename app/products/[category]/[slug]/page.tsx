export const dynamic = 'force-dynamic';

import ProductDetailView from '@/components/ProductDetailView';
import { getProductBySlug, getProducts } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} – Prag` : 'Product – Prag' };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const [product, { products: related }] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ category, per_page: 3 }),
  ]);

  if (!product) notFound();

  const relatedFiltered = related.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1 flex-wrap">
          <Link href="/products" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Product Catalog</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <Link href={`/products/${category}`} className="text-zinc-500 text-base font-medium font-['Onest'] hover:underline capitalize">{category}</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] truncate max-w-xs">{product.name}</span>
        </div>
      </div>
      <ProductDetailView product={product} relatedProducts={relatedFiltered} />
    </main>
  );
}
