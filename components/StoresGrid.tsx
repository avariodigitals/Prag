import Image from 'next/image';
import type { Store } from '@/lib/types';

interface StoreCardProps { store: Store }

function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="flex-1 p-4 bg-white rounded-2xl outline outline-1 outline-zinc-100 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sky-700 text-lg md:text-xl font-bold font-['Onest'] leading-7">{store.name}</h3>
        <p className="text-neutral-700 text-base font-medium font-['Space_Grotesk'] leading-6">{store.city}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Address</span>
          <p className="text-neutral-700 text-base font-normal font-['Space_Grotesk'] leading-6">{store.address}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Phone Number</span>
          <a href={`tel:${store.phone}`} className="text-neutral-700 text-base font-normal font-['Space_Grotesk'] leading-6 hover:text-sky-700">
            {store.phone}
          </a>
        </div>
      </div>
      <div className="flex gap-4">
        <a href={`tel:${store.phone}`} className="flex-1 px-6 py-3 bg-sky-700 rounded-xl flex justify-center items-center hover:bg-sky-800 transition-colors">
          <span className="text-white text-base font-medium font-['Space_Grotesk'] leading-6">Contact Store</span>
        </a>
        <a href={store.map_url} target="_blank" rel="noopener noreferrer"
          className="flex-1 px-6 py-3 rounded-xl outline outline-[1.31px] outline-sky-700 flex justify-center items-center hover:bg-sky-50 transition-colors">
          <span className="text-sky-700 text-base font-medium font-['Space_Grotesk'] leading-6">Map Directions</span>
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

export default function StoresGrid({ pragStores, onlineStores, chainStores }: Props) {
  const displayPrag = pragStores;
  const displayOnline = onlineStores
    .map((store) => store.logo ? ({ src: store.logo.src, alt: store.logo.alt || store.name, href: store.map_url }) : null)
    .filter((store): store is { src: string; alt: string; href: string } => Boolean(store));
  const displayChain = chainStores
    .map((store) => store.logo ? ({ src: store.logo.src, alt: store.logo.alt || store.name, href: store.map_url }) : null)
    .filter((store): store is { src: string; alt: string; href: string } => Boolean(store));

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
        <h2 className="text-zinc-900 text-2xl md:text-3xl font-bold font-['Onest'] leading-tight">PRAG Stores</h2>
        {displayPrag.length === 0 ? (
          <p className="text-zinc-500 text-base font-['Space_Grotesk']">No PRAG stores available right now.</p>
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
      <div className="flex flex-col gap-4">
        <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Onest'] leading-tight">Online Stores</h2>
        {displayOnline.length === 0 ? (
          <p className="text-zinc-500 text-base font-['Space_Grotesk']">No online store logos available right now.</p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayOnline.map((img, i) => (
            <a
              key={i}
              href={img.href || 'https://shop.prag.global'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:border-zinc-200 hover:shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Image src={img.src} alt={img.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
            </a>
          ))}
        </div>
        )}
      </div>

      {/* Chain Stores */}
      <div className="flex flex-col gap-4">
        <h2 className="text-zinc-900 text-xl md:text-2xl font-bold font-['Onest'] leading-tight">Chain Stores</h2>
        {displayChain.length === 0 ? (
          <p className="text-zinc-500 text-base font-['Space_Grotesk']">No chain store logos available right now.</p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayChain.map((img, i) => (
            <a
              key={i}
              href={img.href || 'https://shop.prag.global'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white border border-zinc-100 rounded-2xl p-4 h-20 hover:border-zinc-200 hover:shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Image src={img.src} alt={img.alt} width={140} height={60} className="object-contain max-h-12 w-auto" />
            </a>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
