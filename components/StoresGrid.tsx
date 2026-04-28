import Image from 'next/image';
import type { Store } from '@/lib/types';

const FALLBACK_STORES: Store[] = [
  { id: 1, name: 'Prag Lagos Main', city: 'Ikeja, Lagos', address: '4, Obanikoro Street, Via Falemi House, Off Ikorodu Road, Lagos', phone: '0703 646 3977', map_url: 'https://maps.google.com', type: 'prag' },
  { id: 2, name: 'Prag Abuja', city: 'Wuse, Abuja', address: '12 Aminu Kano Crescent, Wuse 2, Abuja', phone: '0703 646 3978', map_url: 'https://maps.google.com', type: 'prag' },
  { id: 3, name: 'Prag Port Harcourt', city: 'GRA, Port Harcourt', address: '5 Aba Road, GRA Phase 2, Port Harcourt', phone: '0703 646 3979', map_url: 'https://maps.google.com', type: 'prag' },
];

interface StoreCardProps { store: Store }

function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="flex-1 p-4 bg-white rounded-2xl outline outline-1 outline-zinc-100 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sky-700 text-3xl font-bold font-['Onest'] leading-10">{store.name}</h3>
        <p className="text-neutral-700 text-lg font-medium font-['Space_Grotesk'] leading-7">{store.city}</p>
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
  const displayPrag = pragStores.length ? pragStores : FALLBACK_STORES;

  // Chunk into rows of 3
  function rows(stores: Store[]) {
    const result: Store[][] = [];
    for (let i = 0; i < stores.length; i += 3) result.push(stores.slice(i, i + 3));
    return result;
  }

  return (
    <section className="w-full px-20 py-24 flex flex-col gap-6">
      {/* Prag Stores */}
      <div className="flex flex-col gap-6">
        <h2 className="text-zinc-900 text-4xl font-bold font-['Onest'] leading-[60px]">Prag Stores</h2>
        <div className="flex flex-col gap-10">
          {rows(displayPrag).map((row, i) => (
            <div key={i} className="flex gap-6">
              {row.map((store) => <StoreCard key={store.id} store={store} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Online Stores */}
      {onlineStores.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-zinc-900 text-4xl font-bold font-['Onest'] leading-[60px]">Online Stores</h2>
          <div className="flex gap-36 flex-wrap">
            {onlineStores.map((store) => store.logo && (
              <Image key={store.id} src={store.logo.src} alt={store.logo.alt || store.name} width={182} height={91} className="object-contain" />
            ))}
          </div>
        </div>
      )}

      {/* Chain Stores */}
      {chainStores.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-zinc-900 text-4xl font-bold font-['Onest'] leading-[60px]">Chain Stores</h2>
          <div className="flex gap-36 flex-wrap">
            {chainStores.map((store) => store.logo && (
              <Image key={store.id} src={store.logo.src} alt={store.logo.alt || store.name} width={200} height={131} className="object-contain" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
