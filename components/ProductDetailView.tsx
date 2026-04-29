'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Phone } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, shopUrl } from '@/lib/woocommerce';
import { useCart } from '@/lib/CartContext';
import ProductCard from './ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const TABS = ['Description', 'Specifications', 'Technical Resources', 'Reviews'];

export default function ProductDetailView({ product, relatedProducts }: Props) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const { add } = useCart();
  const image = product.images[0];

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      add({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        slug: product.slug,
        image: image?.src ?? '',
      });
    }
  }

  return (
    <div className="w-full px-4 md:px-20 py-10 md:py-24 flex flex-col gap-10 md:gap-20">
      {/* Product hero */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
        {/* Image */}
        <div className="w-full md:w-[620px] h-72 md:h-[551px] relative bg-stone-50 rounded-2xl overflow-hidden shrink-0">
          {image && (
            <Image src={image.src} alt={image.alt || product.name} fill className="object-contain p-6 md:p-10" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']">{product.name}</h1>
            <p className="text-sky-700 text-2xl md:text-3xl font-medium font-['Onest']">{formatPrice(product.price)}</p>
            <div className="wp-content text-neutral-500 text-base md:text-xl"
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
            <button onClick={handleAddToCart}
              className="flex-1 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors">
              <span className="text-white text-base font-medium font-['Space_Grotesk']">Add to Cart</span>
            </button>
            <a href={shopUrl(product.slug)}
              className="flex-1 p-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2.5 hover:bg-sky-800 transition-colors">
              <span className="text-white text-base font-medium font-['Space_Grotesk']">Buy &gt;</span>
            </a>
          </div>
          <Link href="/contact"
            className="w-full p-4 rounded-3xl outline outline-1 outline-sky-700 flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors">
            <Phone className="w-5 h-5 text-sky-700" />
            <span className="text-sky-700 text-base font-medium font-['Space_Grotesk']">Contact sales</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500 text-lg font-medium font-['Space_Grotesk']">Share to</span>
            <div className="flex items-center gap-2">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                <svg className="w-5 h-5 text-neutral-700 hover:text-sky-700 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                <svg className="w-5 h-5 text-neutral-700 hover:text-sky-700 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-5 h-5 text-neutral-700 hover:text-sky-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                <svg className="w-5 h-5 text-neutral-700 hover:text-sky-700 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full p-4 md:p-8 bg-white rounded-2xl outline outline-1 outline-gray-200 flex flex-col gap-6">
        <div className="border-b border-gray-200 flex overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="inline-flex flex-col items-center shrink-0">
              <span className={`px-3 md:px-4 pt-4 pb-3.5 text-base md:text-2xl font-medium font-['Space_Grotesk'] whitespace-nowrap ${activeTab === tab ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
                {tab}
              </span>
              <div className={`h-px w-full ${activeTab === tab ? 'bg-sky-700' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>

        <div className="wp-content text-base md:text-xl"
          dangerouslySetInnerHTML={{ __html: product.description ?? product.short_description }} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-neutral-700 text-2xl md:text-4xl font-medium font-['Onest']">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} bg="bg-white" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
