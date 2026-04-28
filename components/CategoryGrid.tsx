import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories.length) return null;

  return (
    <section className="w-full px-20 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-black text-base font-normal font-['Space_Grotesk']">PRODUCT CATEGORIES</span>
          </div>
          <h2 className="w-[631px] text-black text-5xl font-bold font-['Onest']">Shop by Categories</h2>
        </div>
        <Link href="/products" className="flex items-center gap-2.5 text-sky-700 text-base font-normal font-['Onest'] hover:underline">
          View all Products
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="flex gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className="flex-1 h-96 relative bg-gradient-to-b from-stone-500/10 to-sky-700 rounded-3xl overflow-hidden group"
          >
            {cat.image && (
              <Image
                src={cat.image.src}
                alt={cat.image.alt || cat.name}
                width={172}
                height={208}
                className="absolute left-[68px] top-[99px] object-contain"
              />
            )}
            <span className="absolute left-[23px] bottom-[24px] text-white text-2xl font-semibold font-['Onest']">
              {cat.name}
            </span>
            <div className="absolute right-[20px] top-[35px] p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 transition-colors">
              <ArrowRight className="w-6 h-6 text-white -rotate-45" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
