// Public editorial page is ISR-cached.
export const revalidate = 900;

import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/woocommerce';

export const metadata = { title: 'Knowledge Center - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function KnowledgeCenterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [{ posts }, categories] = await Promise.all([
    getPosts({ category: sp.category, page: sp.page ? Number(sp.page) : 1, per_page: 10 }),
    getPostCategories(),
  ]);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          Understand Power. Make Better Decisions.
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          Practical guides, honest comparisons, and expert insights from PRAG&apos;s engineering team — written for Nigerian conditions.
        </p>
      </div>
      <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
    </main>
  );
}
