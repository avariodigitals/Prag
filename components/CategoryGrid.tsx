import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/woocommerce';

const FALLBACK_CATEGORIES = [
  { name: 'Voltage Stabilizers', slug: 'voltage-stabilizers', image: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png' },
  { name: 'Inverters',           slug: 'inverters',            image: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png' },
  { name: 'Solar Panels',        slug: 'solar',                image: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png' },
  { name: 'Batteries',           slug: 'batteries',            image: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png' },
];

export default function CategoryGrid({ settings }: { settings?: SiteSettings }) {
  const categories = (settings?.categories && settings.categories.length > 0)
    ? settings.categories
    : FALLBACK_CATEGORIES;

  return (
    <section className="w-full px-4 md:px-20 py-10 flex flex-col items-center gap-10">
      <div className="w-full max-w-[1280px] flex flex-col gap-10">
        <div className="flex justify-between items-end gap-10">
          <div className="flex-1 flex flex-col gap-3 md:gap-7">
            <h2 className="text-black text-base md:text-2xl font-bold font-['Montserrat']">Shop by Categories</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sky-700 text-xs md:text-sm font-normal font-['Montserrat'] hover:underline">
            View all Products
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="h-96 md:h-[450px] relative bg-gradient-to-b from-stone-500/10 to-sky-700 rounded-3xl overflow-hidden group"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                quality={80}
                loading="lazy"
                className={`object-contain transition-transform duration-300 p-8 pb-24 md:p-10 md:pb-28 ${cat.slug === 'batteries' ? 'scale-110 md:scale-115' : 'group-hover:scale-105'}`}
              />
              <div className="absolute left-0 right-0 bottom-[24px] px-5 text-center">
                <span className="text-white text-[30px] md:text-[28px] font-semibold font-['Montserrat'] leading-tight whitespace-nowrap">{cat.name}</span>
              </div>
              <div className="absolute right-[18px] top-[18px] p-3 bg-sky-700 rounded-full group-hover:bg-sky-800 group-hover:scale-110 transition-all shadow-lg cursor-pointer">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
