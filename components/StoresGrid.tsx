import Image from 'next/image';
import type { Store } from '@/lib/types';

const FALLBACK_STORES: Store[] = [
  { id: 1, name: 'PRAG (Obanikoro)', city: 'Obanikoro', address: '4, Obanikoro Street, Via Falemi House, Off Ikorodu Road, Lagos', phone: '0703 646 3977', map_url: 'https://maps.google.com/?q=4+Obanikoro+Street+Lagos', type: 'prag' },
  { id: 2, name: 'PRAG (Port Harcourt)', city: 'Portharcourt', address: '18, Ezimgbu Link Road, GRA Phase IV, Mopol 19 Mummy-B Bypass, Port Harcourt', phone: '0703 549 2994', map_url: 'https://maps.google.com/?q=18+Ezimgbu+Link+Road+Port+Harcourt', type: 'prag' },
  { id: 3, name: 'PRAG Abuja (Durumi)', city: 'Abuja', address: 'A.A IBRAHIM PLAZA, Block A, Suite 08, 12 David Ejoor, Durumi, Abuja, FCT', phone: '0808 101 0747', map_url: 'https://maps.google.com/?q=12+David+Ejoor+Durumi+Abuja', type: 'prag' },
  { id: 4, name: 'Partner Abuja', city: 'Abuja', address: 'Shop 205, Block GH, Kaura Market, Durumi District, Abuja', phone: '07064847951', map_url: 'https://maps.google.com/?q=Kaura+Market+Durumi+Abuja', type: 'prag' },
  { id: 5, name: 'PRAG (Lagos Island)', city: 'Lagos Island', address: 'G12, City Mall, Opposite Muson Centre, Onikan, Lagos', phone: '0810 400 0715', map_url: 'https://maps.google.com/?q=City+Mall+Onikan+Lagos', type: 'prag' },
  { id: 6, name: 'PRAG (Alaba)', city: 'Alaba', address: 'Ichida Mall, Sunny Bus stop, Opposite Diamond Bank, Alaba International Market, Ojo, Alaba', phone: '0802 690 2296', map_url: 'https://maps.google.com/?q=Alaba+International+Market+Lagos', type: 'prag' },
];

const FALLBACK_ONLINE = [
  { src: 'https://central.prag.global/wp-content/uploads/2026/04/5ff0e6849b09a1a4eb3bdeda8471ff7fc2fd8ce3.png', alt: 'Online Store 1' },
  { src: 'https://central.prag.global/wp-content/uploads/2026/04/bee5d02c8cf83b603f5e20ea9d3ea9af4c73da4e.png', alt: 'Online Store 2' },
];

const FALLBACK_CHAIN = [
  { src: 'https://central.prag.global/wp-content/uploads/2026/04/10b7be4d65865dc31d780030e9229855815dc832.png', alt: 'Chain Store 1' },
  { src: 'https://central.prag.global/wp-content/uploads/2026/04/34ad001c624cbf2245020be3a1641a3b6e2869c1.png', alt: 'Chain Store 2' },
  { src: 'https://central.prag.global/wp-content/uploads/2026/04/80fc1fd5ec7a69f5a983d6a7bd47f293daf297b9.png', alt: 'Chain Store 3' },
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
    <section className="w-full px-4 md:px-20 py-10 md:py-24 flex flex-col gap-10">
      {/* Prag Stores */}
      <div className="flex flex-col gap-6">
        <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-[60px]">PRAG Stores</h2>
        <div className="flex flex-col gap-6 md:gap-10">
          {rows(displayPrag).map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {row.map((store) => <StoreCard key={store.id} store={store} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Online Stores */}
      <div className="flex flex-col gap-6">
        <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-[60px]">Online Stores</h2>
        <div className="flex gap-10 md:gap-36 flex-wrap items-center">
          {(onlineStores.length > 0
            ? onlineStores.filter(s => s.logo).map(s => ({ src: s.logo!.src, alt: s.logo!.alt || s.name }))
            : FALLBACK_ONLINE
          ).map((img, i) => (
            <Image key={i} src={img.src} alt={img.alt} width={182} height={91} className="object-contain" />
          ))}
        </div>
      </div>

      {/* Chain Stores */}
      <div className="flex flex-col gap-6">
        <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest'] leading-[60px]">Chain Stores</h2>
        <div className="flex gap-10 md:gap-36 flex-wrap items-center">
          {(chainStores.length > 0
            ? chainStores.filter(s => s.logo).map(s => ({ src: s.logo!.src, alt: s.logo!.alt || s.name }))
            : FALLBACK_CHAIN
          ).map((img, i) => (
            <Image key={i} src={img.src} alt={img.alt} width={200} height={131} className="object-contain" />
          ))}
        </div>
      </div>
    </section>
  );
}
