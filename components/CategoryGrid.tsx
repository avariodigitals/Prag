import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoryGridProps {
  categories: Category[];
}

const CATEGORY_IMAGES = [
  'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
  'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png',
  'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
  'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories.length) return null;

  // Take the first 4 main categories for the home page layout
  const displayCategories = categories.slice(0, 4);

  return (
    <section className="w-full px-4 md:px-20 py-10 flex flex-col items-center gap-10">
      <div className="w-full max-w-[1280px] flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-end gap-10">
          <div className="flex-1 flex flex-col gap-3 md:gap-7">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-sky-700" />
              <span className="text-black text-xs md:text-base font-normal font-['Space_Grotesk'] uppercase">PRODUCT CATEGORIES</span>
            </div>
            <h2 className="text-black text-lg md:text-5xl font-bold font-['Onest']">Shop by Categories</h2>
          </div>
          <Link href="/products" className="flex items-center gap-2.5 text-sky-700 text-xs md:text-base font-normal font-['Onest'] hover:underline">
            View all Products
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {displayCategories.map((cat, idx) => {
            const displayImage = CATEGORY_IMAGES[idx] || cat.image?.src;
            
            return (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="h-96 relative bg-gradient-to-b from-stone-500/10 to-sky-700 rounded-3xl overflow-hidden group"
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={cat.image?.alt || cat.name}
                    fill
                    sizes="220px"
                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-6"
                  />
                ) : (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-sky-600/20 rounded-full flex items-center justify-center">
                    <span className="text-white/30 text-xs text-center px-4">{cat.name} Image</span>
                  </div>
                )}
                
                <div className="absolute left-[23px] bottom-[24px]">
                  <span className="text-white text-2xl font-semibold font-['Onest']">
                    {cat.name}
                  </span>
                </div>
                
                <div className="absolute right-[20px] top-[30px] p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 transition-colors shadow-lg">
                  <MoveUpRight className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
