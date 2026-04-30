'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Download, FileText } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { TechDocument } from '@/lib/woocommerce';

interface Props {
  products: Product[];
  selectedSlug?: string;
}

export default function TechResourcesView({ products, selectedSlug }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(selectedSlug ?? '');
  const [docs, setDocs] = useState<TechDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedProduct = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (!selectedProduct) { setDocs([]); return; }
    setLoading(true);
    fetch(`/api/product/docs?id=${selectedProduct.id}`)
      .then((r) => r.json())
      .then((data) => setDocs(data.docs ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSlug(e.target.value);
    router.push(`/resources?product=${e.target.value}`);
  }

  return (
    <div className="w-full px-4 md:px-20 py-10 md:py-24 flex flex-col gap-10">
      {/* Product selector */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-sky-700" />
          <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">SELECT PRODUCT</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <span className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-[48px] shrink-0">Product:</span>
          <div className="relative w-full md:w-[500px]">
            <select value={slug} onChange={handleSelect}
              className="w-full h-14 md:h-16 pl-4 md:pl-6 pr-10 bg-white rounded-2xl outline outline-2 outline-sky-700 text-zinc-700 text-sm md:text-base font-normal font-['Space_Grotesk'] appearance-none focus:outline-sky-700 outline-none">
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
        <div className="flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h2 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Onest'] leading-tight">{selectedProduct.name}</h2>
            {!loading && <span className="text-zinc-500 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-6">{docs.length} document{docs.length !== 1 ? 's' : ''} available</span>}
          </div>

          {loading && (
            <div className="flex justify-center py-10">
              <svg className="w-8 h-8 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          )}

          {!loading && docs.length === 0 && (
            <p className="text-gray-400 text-base font-['Space_Grotesk'] py-6">No documents available for this product.</p>
          )}

          {!loading && docs.length > 0 && (
            <div className="flex flex-col gap-4 md:gap-6">
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 md:p-6 bg-white rounded-2xl outline outline-1 outline-neutral-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 px-2 md:px-3 bg-sky-700 rounded-xl flex justify-center items-center shrink-0">
                      <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="flex flex-col gap-1 md:gap-3">
                      <span className="text-zinc-900 text-lg md:text-2xl font-medium font-['Space_Grotesk'] leading-7">{doc.title}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {doc.file_type && <span className="text-zinc-500 text-sm md:text-lg font-normal font-['Space_Grotesk']">{doc.file_type.toUpperCase()}</span>}
                        {doc.file_size && <><div className="w-1 h-1 bg-sky-700 rounded-full" /><span className="text-zinc-500 text-sm md:text-lg font-normal font-['Space_Grotesk']">{doc.file_size}</span></>}
                        {doc.pages && <><div className="w-1 h-1 bg-sky-700 rounded-full" /><span className="text-zinc-500 text-sm md:text-lg font-normal font-['Space_Grotesk']">{doc.pages} pages</span></>}
                      </div>
                    </div>
                  </div>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-700 rounded-xl hover:bg-sky-800 transition-colors w-full md:w-auto">
                    <Download className="w-5 h-5 text-white" />
                    <span className="text-white text-base font-medium font-['Space_Grotesk'] leading-6">Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedProduct && (
        <p className="text-gray-400 text-base md:text-lg font-['Space_Grotesk'] text-center py-10">
          Select a product above to view available documents.
        </p>
      )}
    </div>
  );
}
