// Public editorial page renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/woocommerce';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata = {
  title: 'Knowledge Center',
  alternates: { canonical: 'https://shop.prag.global/knowledge-center' },
};

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function KnowledgeCenterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [content, { posts }, categories] = await Promise.all([
    getB2CPublicContent(),
    getPosts({ category: sp.category, page: sp.page ? Number(sp.page) : 1, per_page: 10 }),
    getPostCategories(),
  ]);

  const page = findB2CPage(content, '/knowledge-center');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];

  const heroTitle = heroSection?.summary || 'Understand Power. Make Better Decisions.';
  const heroDesc = heroSection?.content || "Practical guides, honest comparisons, and expert insights from PRAG's engineering team — written for Nigerian conditions.";

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          {heroDesc}
        </p>
      </div>
      <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
    </main>
  );
}
