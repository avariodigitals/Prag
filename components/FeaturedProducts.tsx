import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, productUrl } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: Product[];
  whatsappNumber?: string;
}

const LISTING_PRICE_COLOR = 'lab(26.8019 1.35387 -4.68303)';

function normalizeWhatsapp(raw?: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (!digits) return '2348032170129';
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  return digits;
}

function splitProductName(name: string): { base: string; rating?: string } {
  const match = name.match(/^(.*?)\s*(\([^)]*\d+[^)]*\))\s*$/);
  if (!match) return { base: name };
  const rating = match[2];
  const isRating = /\d+/.test(rating) && /\b(W|VA|KVA|KW|AH|V|MPPT|AMP)\b/i.test(rating);
  if (!isRating) return { base: name };
  return { base: match[1].trim(), rating };
}

/** Pull a very short, useful spec line from the product data. */
function shortSpec(product: Product): string {
  // 1) Try the first attribute (e.g. Capacity: 1.5KVA)
  const firstAttr = product.attributes?.[0];
  if (firstAttr?.options?.length) {
    return `${firstAttr.name}: ${firstAttr.options[0]}`;
  }
  // 2) Try a cleaned snippet of short_description
  const fromDesc = product.short_description
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (fromDesc) {
    return fromDesc.length > 60 ? `${fromDesc.slice(0, 57).trimEnd()}…` : fromDesc;
  }
  // 3) Fall back to the rating pulled out of the name
  const { rating } = splitProductName(product.name);
  return rating ?? '';
}

function BestSellerCard({ product, whatsappDigits }: { product: Product; whatsappDigits: string }) {
  const image = product.images?.[0];
  const { base: nameBase, rating: nameRating } = splitProductName(product.name);

  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isOutOfStock = product.stock_status === 'outofstock';
  const isOnBackorder = product.stock_status === 'onbackorder';
  const isAvailable = !isOutOfStock && hasValidPrice;

  const spec = shortSpec(product);
  // Hide spec line if it just repeats the rating already shown in the name
  const specIsDuplicate = nameRating && spec && spec.replace(/[^a-zA-Z0-9]/g, '').includes(nameRating.replace(/[^a-zA-Z0-9]/g, ''));

  const orderText = `Hi, I'm interested in the ${product.name}.`;
  const orderHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(orderText)}`;

  return (
    <div className="w-full relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden group transition-shadow hover:shadow-lg hover:shadow-stone-200/60">
      {/* Image */}
      <div className="w-full aspect-square relative flex justify-center items-center bg-stone-50 overflow-hidden">
        {image ? (
          <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="block w-full h-full">
            <Image
              src={image.src}
              alt={image.alt || product.name}
              width={500}
              height={500}
              sizes="(min-width: 768px) 25vw, 50vw"
              quality={80}
              loading="lazy"
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="w-40 h-40 flex items-center justify-center">
            <span className="text-zinc-400 text-xs">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.on_sale && isAvailable && (
            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
              Out of stock
            </span>
          )}
          {isOnBackorder && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold font-['Montserrat'] uppercase tracking-wide">
              Back order
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Name */}
        <Link href={productUrl(product)} aria-label={`View details for ${product.name}`} className="text-center">
          <h3 className="text-zinc-900 text-base font-bold font-['Montserrat'] leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors" style={{ hyphens: 'auto', wordBreak: 'break-word' }}>
            {nameBase}
            {nameRating && <span> {nameRating}</span>}
          </h3>
        </Link>

        {/* Short spec */}
        {spec && !specIsDuplicate && (
          <p className="text-center text-zinc-500 text-xs font-normal font-['Montserrat'] line-clamp-1 min-h-[16px]">
            {spec}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-center gap-2 min-h-[28px]">
          {product.on_sale && product.regular_price && hasValidPrice && (
            <span className="text-zinc-400 text-sm font-normal font-['Montserrat'] line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
          {hasValidPrice ? (
            <span className="text-lg font-semibold font-['Montserrat']" style={{ color: LISTING_PRICE_COLOR }}>
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-sm font-semibold font-['Montserrat'] uppercase tracking-wide" style={{ color: LISTING_PRICE_COLOR }}>
              Call for Price
            </span>
          )}
        </div>

        {/* Dominant: Order on WhatsApp */}
        <a
          href={isAvailable ? orderHref : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!isAvailable}
          className={`w-full mt-1 px-4 py-2.5 rounded-full text-white text-sm font-semibold font-['Montserrat'] text-center inline-flex justify-center items-center gap-2 transition-colors ${
            isAvailable ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-zinc-300 cursor-not-allowed pointer-events-none'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order on WhatsApp
        </a>

        {/* Secondary: View Details */}
        <Link
          href={productUrl(product)}
          aria-label={`View details for ${product.name}`}
          className="w-full text-center text-sky-700 text-xs font-medium font-['Montserrat'] hover:text-sky-900 hover:underline transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedProducts({ products, whatsappNumber }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const whatsappDigits = normalizeWhatsapp(whatsappNumber);
  const visible = products.slice(0, 4);

  return (
    <section className="w-full px-4 md:px-20 py-12 md:py-20 bg-white flex flex-col justify-center items-center gap-10 md:gap-14">
      <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-10 md:gap-14">
        {/* Header */}
        <div className="w-full flex flex-col items-center gap-3 md:gap-4 text-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-sky-700 text-xs font-semibold font-['Montserrat'] uppercase tracking-widest">
              Best Sellers
            </span>
          </div>
          <h2 className="text-black text-2xl md:text-4xl font-bold font-['Montserrat'] leading-tight">
            Most Popular Right Now
          </h2>
          <p className="text-zinc-500 text-sm md:text-base font-normal font-['Montserrat']">
            Now we&apos;re ready to sell.
          </p>
        </div>

        {/* Grid — only 4 products */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
          {visible.map((product) => (
            <BestSellerCard key={product.id} product={product} whatsappDigits={whatsappDigits} />
          ))}
        </div>

        {/* View all */}
        <Link
          href="/products"
          className="w-64 p-4 rounded-3xl outline outline-1 outline-offset-[-1px] outline-sky-700 inline-flex justify-center items-center gap-2.5 hover:bg-sky-50 transition-colors"
        >
          <span className="text-sky-700 text-sm font-medium font-['Montserrat']">View all products</span>
        </Link>
      </div>
    </section>
  );
}
