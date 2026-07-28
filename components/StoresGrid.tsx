import Image from 'next/image';
import type { Store } from '@/lib/types';
import { formatPhone } from '@/lib/formatPhone';

interface StoreCardProps { store: Store }

function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="flex-1 p-6 bg-white rounded-2xl outline outline-1 outline-zinc-100 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-sky-700 text-2xl md:text-[28px] font-bold font-['Montserrat'] leading-tight">{store.name}</h3>
        <p className="text-neutral-700 text-lg font-medium font-['Montserrat'] leading-6">{store.city}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sky-700 text-base font-medium font-['Montserrat'] leading-5">Address</span>
          <p className="text-neutral-700 text-base font-normal font-['Montserrat'] leading-6">{store.address}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sky-700 text-base font-medium font-['Montserrat'] leading-5">Phone Number</span>
          <a href={`tel:${store.phone}`} className="text-neutral-700 text-base font-normal font-['Montserrat'] leading-6 hover:text-sky-700">
            {formatPhone(store.phone)}
          </a>
        </div>
      </div>
      <div className="flex gap-4">
        <a href={`tel:${store.phone}`} className="flex-1 px-4 py-2.5 bg-sky-700 rounded-xl flex justify-center items-center hover:bg-sky-800 transition-colors">
          <span className="text-white text-sm font-medium font-['Montserrat'] leading-6">Contact Store</span>
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 px-4 py-2.5 rounded-xl outline outline-[1.31px] outline-sky-700 flex justify-center items-center hover:bg-sky-50 transition-colors">
          <span className="text-sky-700 text-sm font-medium font-['Montserrat'] leading-6">Map Directions</span>
        </a>
      </div>
    </div>
  );
}

interface Props {
  pragStores: Store[];
  onlineStores: Store[];
  chainStores: Store[];
}

function fallbackStoreLinkByName(name: string): string {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalized.includes('spar')) return 'https://www.sparnigeria.com/';
  if (normalized.includes('cashncarry') || normalized.includes('cashandcarry')) return 'https://cashandcarry.com.ng/';
  if (normalized.includes('megaplaza')) return 'https://megaplazang.com/';
  return '';
}

export default function StoresGrid({ pragStores, onlineStores, chainStores }: Props) {
  const displayPrag = pragStores;
  const displayOnline = onlineStores
    .map((store) => store.logo ? ({ name: store.name, src: store.logo.src, alt: store.logo.alt || store.name, href: store.map_url || '' }) : null)
    .filter((store): store is { name: string; src: string; alt: string; href: string } => Boolean(store));
  const displayChain = chainStores
    .map((store) => store.logo
      ? ({
          name: store.name,
          src: store.logo.src,
          alt: store.logo.alt || store.name,
          href: store.map_url || fallbackStoreLinkByName(store.name),
        })
      : null)
    .filter((store): store is { name: string; src: string; alt: string; href: string } => Boolean(store));

  // Chunk into rows of 3
  function rows(stores: Store[]) {
    const result: Store[][] = [];
    for (let i = 0; i < stores.length; i += 3) result.push(stores.slice(i, i + 3));
    return result;
  }

  return (
    <section className="w-full px-4 md:px-20 py-10 md:py-24 flex flex-col gap-10">
      {/* Prag Stores */}
      <div className="flex flex-col gap-6">
        <h2 className="text-zinc-900 text-3xl md:text-[40px] font-bold font-['Montserrat'] tracking-[-1px] leading-tight">PRAG Stores</h2>
        {displayPrag.length === 0 ? (
          <p className="text-zinc-500 text-base font-['Montserrat']">No PRAG stores available right now.</p>
        ) : (
          <div className="flex flex-col gap-6 md:gap-10">
            {rows(displayPrag).map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {row.map((store) => <StoreCard key={store.id} store={store} />)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Online Stores */}
      {displayOnline.length > 0 && (
      <div className="flex flex-col gap-4">
        <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Montserrat'] leading-tight">Online Stores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayOnline.map((img, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-center h-36 md:h-40">
                <Image src={img.src} alt={img.alt} width={300} height={140} className="object-contain max-h-32 md:max-h-36 w-auto" />
              </div>
              {img.href ? (
                <a
                  href={img.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl outline outline-[1.31px] outline-sky-700 flex justify-center items-center hover:bg-sky-50 transition-colors"
                  aria-label={`Visit ${img.name}`}
                >
                  <span className="text-sky-700 text-sm font-medium font-['Montserrat'] leading-6">Visit Store</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-xl outline outline-[1.31px] outline-zinc-300 flex justify-center items-center opacity-60 cursor-not-allowed"
                  aria-label={`Visit ${img.name} unavailable`}
                >
                  <span className="text-zinc-500 text-sm font-medium font-['Montserrat'] leading-6">Visit Store</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Chain Stores */}
      {displayChain.length > 0 && (
      <div className="flex flex-col gap-4">
        <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Montserrat'] leading-tight">Chain Stores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayChain.map((img, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-center h-36 md:h-40">
                <Image src={img.src} alt={img.alt} width={300} height={140} className="object-contain max-h-32 md:max-h-36 w-auto" />
              </div>
              {img.href ? (
                <a
                  href={img.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl outline outline-[1.31px] outline-sky-700 flex justify-center items-center hover:bg-sky-50 transition-colors"
                  aria-label={`Visit ${img.name}`}
                >
                  <span className="text-sky-700 text-sm font-medium font-['Montserrat'] leading-6">Visit Store</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-xl outline outline-[1.31px] outline-zinc-300 flex justify-center items-center opacity-60 cursor-not-allowed"
                  aria-label={`Visit ${img.name} unavailable`}
                >
                  <span className="text-zinc-500 text-sm font-medium font-['Montserrat'] leading-6">Visit Store</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      )}
    </section>
  );
}
