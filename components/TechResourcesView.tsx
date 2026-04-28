'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Download, FileText } from 'lucide-react';
import type { Product } from '@/lib/types';

interface Props {
  products: Product[];
  selectedSlug?: string;
}

// Documents come from WooCommerce product ACF fields (acf.documents array)
// Fallback demo documents shown when no product selected
const DEMO_DOCS = [
  { title: 'Data sheet', type: 'PDF', size: '3.8 MB', pages: '24 pages', url: '#' },
  { title: 'Manual', type: 'PDF', size: '1.8 MB', pages: '6 pages', url: '#' },
  { title: 'Brochure', type: 'PDF', size: '2.8 MB', pages: '8 pages', url: '#' },
];

export default function TechResourcesView({ products, selectedSlug }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(selectedSlug ?? '');

  const selectedProduct = products.find((p) => p.slug === slug);
  const docs = (selectedProduct as unknown as { acf?: { documents?: typeof DEMO_DOCS } })?.acf?.documents ?? (selectedProduct ? DEMO_DOCS : []);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSlug(e.target.value);
    router.push(`/resources?product=${e.target.value}`);
  }

  return (
    <div className="w-full px-20 py-24 flex flex-col gap-10">
      {/* Product selector */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-sky-700" />
          <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">SELECT PRODUCT</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-zinc-900 text-3xl font-bold font-['Onest'] leading-[48px] shrink-0">Product:</span>
          <div className="relative w-[500px]">
            <select value={slug} onChange={handleSelect}
              className="w-full h-16 pl-6 pr-10 bg-white rounded-2xl outline outline-2 outline-sky-700 text-zinc-700 text-base font-normal font-['Space_Grotesk'] appearance-none focus:outline-sky-700 outline-none">
              <option value="">Select a product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-sky-700 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Documents */}
      {selectedProduct && (
        <div className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <h2 className="text-zinc-900 text-4xl font-bold font-['Onest'] leading-[60px]">{selectedProduct.name}</h2>
            <span className="text-zinc-500 text-base font-normal font-['Space_Grotesk'] leading-6">{docs.length} documents available</span>
          </div>

          <div className="flex flex-col gap-6">
            {docs.map((doc) => (
              <div key={doc.title} className="h-28 p-6 bg-white rounded-2xl outline outline-1 outline-neutral-200 flex justify-between items-center">
                <div className="w-80 flex items-center gap-6">
                  <div className="w-14 h-14 px-3 bg-sky-700 rounded-xl flex justify-center items-center shrink-0">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">{doc.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-lg font-normal font-['Space_Grotesk'] leading-6">{doc.type}</span>
                      <div className="w-1 h-1 bg-sky-700 rounded-full" />
                      <span className="text-zinc-500 text-lg font-normal font-['Space_Grotesk'] leading-6">{doc.size}</span>
                      <div className="w-1 h-1 bg-sky-700 rounded-full" />
                      <span className="text-zinc-500 text-lg font-normal font-['Space_Grotesk'] leading-6">{doc.pages}</span>
                    </div>
                  </div>
                </div>
                <a href={doc.url} download
                  className="px-6 py-3 bg-sky-700 rounded-xl flex items-center gap-2 hover:bg-sky-800 transition-colors">
                  <Download className="w-5 h-5 text-white" />
                  <span className="text-white text-base font-medium font-['Space_Grotesk'] leading-6">Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedProduct && (
        <p className="text-gray-400 text-lg font-['Space_Grotesk'] text-center py-10">Select a product above to view available documents.</p>
      )}
    </div>
  );
}
