'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Phone } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import ProductCard from './ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const TABS = ['Description', 'Specifications', 'Technical Resources', 'Reviews'];

export default function ProductDetailView({ product, relatedProducts }: Props) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  const image = product.images[0];

  return (
    <div className="w-full px-20 py-24 flex flex-col gap-20">
      {/* Product hero */}
      <div className="flex gap-6 items-center">
        {/* Image */}
        <div className="w-[620px] h-[551px] relative bg-stone-50 rounded-2xl overflow-hidden shrink-0">
          {image && (
            <Image src={image.src} alt={image.alt || product.name} fill className="object-contain p-10" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-black text-4xl font-medium font-['Onest']">{product.name}</h1>
            <p className="text-sky-700 text-3xl font-medium font-['Onest']">{formatPrice(product.price)}</p>
            <p className="text-neutral-500 text-xl font-normal font-['Onest']"
              dangerouslySetInnerHTML={{ __html: product.short_description }} />
          </div>

          {/* Qty stepper */}
          <div className="w-40 p-4 bg-stone-50 rounded-3xl outline outline-1 outline-zinc-500/40 flex justify-between items-center">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
              <Minus className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <span className="text-sky-700 text-base font-medium font-['Inter'] leading-6">{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase">
              <Plus className="w-3.5 h-3.5 text-sky-700" />
            </button>
          </div>

          {/* CTAs */}
          <div className="flex gap-4">
            <a href={shopUrl(product.slug)}
              className="flex-1 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors">
              <span className="text-white text-base font-medium font-['Space_Grotesk']">Buy &gt;</span>
            </a>
            <a href="/contact"
              className="flex-1 p-4 rounded-3xl outline outline-1 outline-sky-700 flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors">
              <Phone className="w-5 h-5 text-sky-700" />
              <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">Contact sales</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full p-8 bg-white rounded-2xl outline outline-1 outline-gray-200 flex flex-col gap-6">
        <div className="border-b border-gray-200 flex">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="inline-flex flex-col items-center">
              <span className={`px-4 pt-4 pb-3.5 text-2xl font-medium font-['Space_Grotesk'] ${activeTab === tab ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
                {tab}
              </span>
              <div className={`h-px w-full ${activeTab === tab ? 'bg-sky-700' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>

        <div className="text-slate-600 text-xl font-normal font-['Space_Grotesk']"
          dangerouslySetInnerHTML={{ __html: product.description ?? product.short_description }} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-neutral-700 text-4xl font-medium font-['Onest']">Related Products</h2>
          <div className="flex gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} bg="bg-white" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
