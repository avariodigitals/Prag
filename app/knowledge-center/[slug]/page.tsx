import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPostCategories, getPosts } from '@/lib/woocommerce';
import type { WPPost, WPCategory } from '@/lib/woocommerce';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

function postImage(post: WPPost) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}

function sanitize(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '');
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article – Prag' };
  return {
    title: `${post.title.rendered.replace(/<[^>]+>/g, '')} – Prag`,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, '').trim().slice(0, 160),
  };
}

export default async function KnowledgeCenterPost({ params }: Props) {
  const { slug } = await params;

  const [post, categories, { posts: recentPosts }] = await Promise.all([
    getPostBySlug(slug),
    getPostCategories(),
    getPosts({ per_page: 3 }),
  ]);

  if (!post) notFound();

  const img = postImage(post);
  const catName = (categories as WPCategory[]).find((c) => post.categories.includes(c.id))?.name ?? 'Article';
  const date = new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const related = recentPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 pt-8 pb-6 bg-stone-50 flex flex-col gap-3 max-w-[1280px] mx-auto">
        <Link href="/knowledge-center" className="flex items-center gap-2 text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Center
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-xs font-medium font-['Space_Grotesk']">{catName}</span>
          <span className="text-zinc-400 text-sm font-['Space_Grotesk']">{date}</span>
        </div>
        <h1 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight"
          dangerouslySetInnerHTML={{ __html: sanitize(post.title.rendered) }} />
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-20 py-8 flex flex-col gap-8 max-w-[1280px] mx-auto">
        {img && (
          <div className="relative w-full h-56 md:h-[420px] rounded-2xl overflow-hidden">
            <Image src={img} alt={post.title.rendered.replace(/<[^>]+>/g, '')} fill sizes="(max-width: 768px) 100vw, 1280px" className="object-cover" priority />
          </div>
        )}

        <article
          className="w-full max-w-none text-zinc-700 text-base md:text-lg font-['Space_Grotesk'] leading-relaxed wp-content"
          dangerouslySetInnerHTML={{ __html: sanitize(post.content.rendered) }}
        />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="w-full px-4 md:px-20 py-8 border-t border-zinc-100 max-w-[1280px] mx-auto flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Onest']">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => {
              const rImg = postImage(p);
              return (
                <Link key={p.id} href={`/knowledge-center/${p.slug}`} className="flex flex-col gap-3 group">
                  {rImg && (
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <Image src={rImg} alt={p.title.rendered} fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <h3 className="text-zinc-900 text-base font-medium font-['Onest'] line-clamp-2 group-hover:text-sky-700 transition-colors"
                    dangerouslySetInnerHTML={{ __html: sanitize(p.title.rendered) }} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
