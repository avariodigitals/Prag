'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { WPPost, WPCategory } from '@/lib/woocommerce';
import { ArrowRight } from 'lucide-react';

interface Props {
  featured: WPPost | null;
  posts: WPPost[];
  categories: WPCategory[];
  total: number;
  activeCategory?: string;
}

function postImage(post: WPPost) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}

function postDate(post: WPPost) {
  return new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').trim();
}

export default function BlogGrid({ featured, posts, categories, total, activeCategory }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('page');
    router.push(`/knowledge-center?${params.toString()}`);
  }

  const rows = [];
  for (let i = 0; i < posts.length; i += 3) rows.push(posts.slice(i, i + 3));

  return (
    <div className="w-full p-20 flex flex-col gap-10">
      {/* Featured post */}
      {featured && (
        <div className="flex rounded-bl-2xl rounded-br-2xl overflow-hidden">
          {postImage(featured) && (
            <div className="relative w-[640px] h-[385px] shrink-0">
              <Image src={postImage(featured)!} alt={featured.title.rendered} fill className="object-cover rounded-tl-2xl rounded-bl-2xl" />
            </div>
          )}
          <div className="flex-1 p-6 bg-white rounded-tr-2xl rounded-br-2xl border border-l-0 border-zinc-500/40 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-sm font-medium font-['Space_Grotesk']">Power Guide</span>
                <span className="text-neutral-700 text-sm font-normal font-['Onest']">8min read</span>
                <span className="text-sky-700 text-base font-normal font-['Onest']">{postDate(featured)}</span>
              </div>
              <h2 className="text-zinc-900 text-4xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: featured.title.rendered }} />
              <p className="text-neutral-700 text-xl font-normal font-['Onest']">{stripHtml(featured.excerpt.rendered)}</p>
            </div>
            <Link href={`/knowledge-center/${featured.slug}`} className="flex items-center gap-2.5 text-sky-700 text-base font-normal font-['Onest'] hover:underline">
              Read full Article <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <button onClick={() => setCategory(undefined)}
          className={`w-20 p-3 rounded-3xl text-base font-medium font-['Space_Grotesk'] transition-colors ${!activeCategory ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setCategory(String(cat.id))}
            className={`p-3 rounded-3xl text-base font-medium font-['Space_Grotesk'] transition-colors ${activeCategory === String(cat.id) ? 'bg-sky-700 text-white' : 'bg-white outline outline-1 outline-neutral-700 text-neutral-700 hover:outline-sky-700 hover:text-sky-700'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Article grid */}
      {posts.length === 0 ? (
        <p className="text-gray-400 text-lg font-['Space_Grotesk'] text-center py-10">No articles found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-6">
              {row.map((post) => (
                <div key={post.id} className="flex-1 rounded-bl-2xl rounded-br-2xl flex flex-col">
                  {postImage(post) && (
                    <div className="relative h-56 rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                      <Image src={postImage(post)!} alt={post.title.rendered} fill className="object-cover" />
                    </div>
                  )}
                  <div className="px-6 py-6 bg-white rounded-bl-2xl rounded-br-2xl border border-t-0 border-zinc-500/40 flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <span className="px-2 py-1 bg-sky-700 rounded-3xl text-white text-sm font-medium font-['Space_Grotesk']">Article</span>
                        <span className="text-neutral-700 text-sm font-normal font-['Onest']">8min read</span>
                      </div>
                      <h3 className="text-zinc-900 text-2xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                      <p className="text-neutral-700 text-lg font-normal font-['Onest']">{stripHtml(post.excerpt.rendered)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <Link href={`/knowledge-center/${post.slug}`} className="flex items-center gap-2.5 text-sky-700 text-base font-normal font-['Onest'] hover:underline">
                        Read full Article <ArrowRight className="w-5 h-5" />
                      </Link>
                      <span className="text-zinc-500 text-base font-normal font-['Onest']">{postDate(post)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
