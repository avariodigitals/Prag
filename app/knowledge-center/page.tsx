export const dynamic = 'force-dynamic';

import BlogGrid from '@/components/BlogGrid';
import { getPosts, getPostCategories } from '@/lib/woocommerce';

export const metadata = { title: 'Knowledge Center – Prag' };

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function KnowledgeCenterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [{ posts }, categories] = await Promise.all([
    getPosts({ category: sp.category, page: sp.page ? Number(sp.page) : 1 }),
    getPostCategories(),
  ]);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">
          Understand Power. Make Better Decisions.
        </h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Practical guides, honest comparisons, and expert insights from Prag&apos;s engineering team — written for Nigerian conditions.
        </p>
      </div>
      <BlogGrid featured={featured} posts={rest} categories={categories} activeCategory={sp.category} />
    </main>
  );
}
