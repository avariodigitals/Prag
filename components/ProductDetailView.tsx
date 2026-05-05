'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, type FormEvent } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { ProductReview, TechDocument } from '@/lib/woocommerce';
import { formatPrice } from '@/lib/woocommerce';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';

function cleanWpContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
}

function splitReviewContent(reviewHtml: string): { title: string; body: string } {
  const plain = reviewHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return { title: '', body: '' };

  const sentence = plain.match(/^(.{12,110}?[.!?])\s*(.*)$/);
  if (sentence) {
    return {
      title: sentence[1].replace(/[.!?]+$/, '').trim(),
      body: sentence[2].trim(),
    };
  }

  return { title: plain.slice(0, 96).trim(), body: plain };
}

interface Props {
  product: Product;
  relatedProducts: Product[];
  reviews: ProductReview[];
  techDocs: TechDocument[];
}

export default function ProductDetailView({ product, relatedProducts, reviews, techDocs }: Props) {
  const numericPrice = Number(String(product.price ?? '').replace(/,/g, ''));
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const isOutOfStock = product.stock_status === 'outofstock' || !hasValidPrice;
  const hasSpecs = (product.attributes && product.attributes.length > 0) || product.weight || (product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height));

  const VISIBLE_TABS = ['Description', 'Specifications', 'Technical Resources', 'Reviews'];
  const [activeTab, setActiveTab] = useState('Description');
  const [qty, setQty] = useState(1);
  const [pageUrl, setPageUrl] = useState('');
  const [reviewItems, setReviewItems] = useState<ProductReview[]>(reviews);
  const [reviewForm, setReviewForm] = useState({ reviewer: '', reviewer_email: '', rating: 5, review: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewNotice, setReviewNotice] = useState('');
  const { add } = useCart();
  const router = useRouter();
  const image = product.images?.[0];

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);

  function handleAddToCart() {
    if (isOutOfStock) return;
    setAdding(true);
    add({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      image: product.images?.[0]?.src ?? '',
    });
    for (let i = 1; i < qty; i++) {
      add({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        slug: product.slug,
        image: product.images?.[0]?.src ?? '',
      });
    }
    setTimeout(() => {
      setAdding(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }, 600);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    router.push(`/checkout?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&slug=${product.slug}&image=${encodeURIComponent(product.images?.[0]?.src ?? '')}&qty=${qty}`);
  }

  async function handleSubmitReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReviewNotice('');
    setReviewSubmitting(true);

    try {
      const res = await fetch('/api/product/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          reviewer: reviewForm.reviewer,
          reviewer_email: reviewForm.reviewer_email,
          rating: reviewForm.rating,
          review: reviewForm.review,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewNotice(data?.error ?? 'Unable to submit review. Please try again.');
        return;
      }

      const submitted = data?.review as ProductReview | undefined;
      if (submitted && submitted.id) {
        setReviewItems((prev) => [submitted, ...prev]);
        setReviewNotice('Review submitted successfully.');
      } else {
        setReviewNotice('Review submitted successfully. It may appear after moderation.');
      }

      setReviewForm({ reviewer: '', reviewer_email: '', rating: 5, review: '' });
    } catch {
      setReviewNotice('Unable to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="w-full px-4 md:px-20 pt-8 md:pt-12 pb-12 md:pb-16">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6 md:gap-8">
      {/* Product hero */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-start">
        {/* Image */}
        <div className="w-full md:w-[520px] h-72 md:h-[430px] relative bg-white rounded-2xl overflow-hidden shrink-0">
          {image && (
            <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 768px) 100vw, 520px" priority className="object-contain p-4 md:p-6" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-5 md:gap-6 max-w-[620px]">
          <div className="flex flex-col gap-3 md:gap-4">
            <h1 className="text-black text-[30px] md:text-[38px] font-bold font-['Onest'] leading-[34px] md:leading-[38px]">{product.name}</h1>
            <div className="flex items-center gap-2">
              {product.on_sale && product.regular_price && (
                <span className="text-zinc-400 text-sm md:text-base font-normal font-['Onest'] line-through">{formatPrice(product.regular_price)}</span>
              )}
              {hasValidPrice ? (
                <p className="text-sky-700 text-[16px] font-extralight font-['Onest'] leading-[28px]">{formatPrice(product.price)}</p>
              ) : (
                <p className="text-rose-700 text-[13px] font-semibold font-['Space_Grotesk'] uppercase tracking-wide">Out of stock</p>
              )}
            </div>
            <div className="wp-content text-zinc-500 text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanWpContent(product.short_description) }} />
          </div>

          {/* Qty stepper */}
          <div className="w-40 px-3 py-2 bg-stone-50 rounded-3xl outline outline-1 outline-zinc-500/30 flex justify-between items-center">
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
            <button onClick={handleAddToCart} disabled={adding || addedToCart || isOutOfStock}
              className="flex-1 h-11 px-4 bg-sky-700 rounded-3xl flex justify-center items-center gap-2 hover:bg-sky-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {adding ? (
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : addedToCart ? (
                <>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk']">Added to Cart</span>
                </>
              ) : (
                <span className="text-white text-sm font-medium font-['Space_Grotesk']">Add to Cart</span>
              )}
            </button>
            <button onClick={handleBuyNow} disabled={isOutOfStock}
              className="flex-1 h-11 px-4 bg-sky-800 rounded-3xl flex justify-center items-center gap-2 hover:bg-sky-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              <span className="text-white text-sm font-medium font-['Space_Grotesk']">Buy Now</span>
            </button>
          </div>
          <Link href="/contact"
            className="w-full h-11 px-4 rounded-3xl outline outline-1 outline-sky-700 flex justify-center items-center gap-2 hover:bg-sky-50 transition-colors">
            <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">Contact sales</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500 text-sm font-medium font-['Space_Grotesk']">Share to</span>
            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${pageUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-neutral-700 hover:text-sky-700 hover:border-sky-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.8 11.8 0 0012.04 0C5.62 0 .39 5.23.39 11.65c0 2.06.54 4.08 1.57 5.86L0 24l6.66-1.88a11.6 11.6 0 005.37 1.37h.01c6.42 0 11.65-5.22 11.65-11.64a11.6 11.6 0 00-3.17-8.37zM12.05 21.5h-.01a9.66 9.66 0 01-4.93-1.35l-.35-.21-3.95 1.12 1.06-3.85-.23-.39a9.67 9.67 0 01-1.49-5.16c0-5.34 4.35-9.68 9.7-9.68 2.59 0 5.02 1.01 6.85 2.84a9.61 9.61 0 012.84 6.84c0 5.34-4.35 9.69-9.69 9.69zm5.31-7.27c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.13-.17.19-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.08-.15-.66-1.6-.9-2.19-.24-.57-.49-.49-.66-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.44 1.05 2.83 1.2 3.02.14.19 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.23 1.33.19 1.83.12.56-.09 1.72-.71 1.96-1.39.24-.68.24-1.26.17-1.39-.07-.12-.26-.19-.56-.34z"/></svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-neutral-700 hover:text-sky-700 hover:border-sky-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/prag_ng/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-neutral-700 hover:text-sky-700 hover:border-sky-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-neutral-700 hover:text-sky-700 hover:border-sky-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full p-4 md:p-8 bg-white rounded-2xl outline outline-1 outline-gray-200 flex flex-col gap-6">
        <div className="border-b border-gray-200 flex overflow-x-auto">
          {VISIBLE_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="inline-flex flex-col items-center shrink-0">
              <span className={`px-3 md:px-4 pt-3 pb-3 text-xs md:text-sm font-medium font-['Space_Grotesk'] whitespace-nowrap ${activeTab === tab ? 'text-sky-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
                {tab}
              </span>
              <div className={`h-0.5 w-full rounded-full ${activeTab === tab ? 'bg-sky-700' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'Description' && (
          <div className="wp-content text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanWpContent(product.description ?? product.short_description) }} />
        )}

        {activeTab === 'Specifications' && (
          <div className="flex flex-col gap-4">
            {/* Attributes from WooCommerce */}
            {product.attributes && product.attributes.length > 0 ? (
              <table className="w-full text-sm font-['Space_Grotesk']">
                <tbody>
                  {(product.weight) && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium w-48">Weight</td>
                      <td className="py-3 text-zinc-800">{product.weight} kg</td>
                    </tr>
                  )}
                  {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium">Dimensions</td>
                      <td className="py-3 text-zinc-800">{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm</td>
                    </tr>
                  )}
                  {product.attributes.map((attr) => (
                    <tr key={attr.id} className="border-b border-gray-100">
                      <td className="py-3 pr-6 text-zinc-500 font-medium w-48">{attr.name}</td>
                      <td className="py-3 text-zinc-800">{attr.options.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-zinc-400 font-['Space_Grotesk']">No specifications available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'Technical Resources' && (
          <div className="rounded-2xl border border-zinc-200 p-4 md:p-6 bg-white flex flex-col gap-4 md:gap-5">
            {techDocs.length > 0 ? (
              techDocs.map((doc) => (
                <div key={doc.id} className="w-full rounded-2xl border border-zinc-200 px-4 py-4 md:px-5 md:py-6 flex items-center justify-between gap-4 bg-white">
                  <span className="text-zinc-800 text-lg md:text-2xl font-medium font-['Onest']">{doc.title}</span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-5 rounded-2xl bg-sky-100 text-sky-700 text-sm md:text-lg font-medium font-['Space_Grotesk'] inline-flex items-center justify-center hover:bg-sky-200 transition-colors shrink-0"
                  >
                    Download
                  </a>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 font-['Space_Grotesk']">No technical documents available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="flex flex-col gap-8">
            {reviewItems.length > 0 ? (
              reviewItems.map((review) => {
                const chunks = splitReviewContent(review.review);
                return (
                  <div key={review.id} className="flex flex-col gap-2.5 pb-7 border-b border-gray-100 last:border-0">
                    <span className="text-zinc-900 text-lg md:text-xl font-semibold leading-none font-['Onest']">{review.reviewer}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-zinc-500 text-base md:text-lg leading-none font-normal font-['Onest']">{new Date(review.date_created).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {chunks.title && (
                      <h4 className="text-zinc-900 text-xl md:text-2xl font-semibold leading-tight font-['Onest']">{chunks.title}</h4>
                    )}
                    <p className="text-zinc-700 text-base md:text-lg leading-relaxed font-normal font-['Onest']">{chunks.body || chunks.title}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-zinc-400 font-['Space_Grotesk']">No reviews yet for this product.</p>
            )}

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 p-4 md:p-5 bg-stone-50 rounded-2xl">
              <h3 className="text-zinc-900 text-base md:text-lg font-semibold font-['Onest']">Write a Review</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={reviewForm.reviewer}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, reviewer: e.target.value }))}
                  placeholder="Your name"
                  required
                  className="h-11 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-['Space_Grotesk'] outline-none focus:border-sky-700"
                />
                <input
                  type="email"
                  value={reviewForm.reviewer_email}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, reviewer_email: e.target.value }))}
                  placeholder="Your email"
                  required
                  className="h-11 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-['Space_Grotesk'] outline-none focus:border-sky-700"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-600 font-['Space_Grotesk']">Rating</span>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="h-10 px-3 rounded-xl border border-zinc-300 bg-white text-sm font-['Space_Grotesk'] outline-none focus:border-sky-700"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <textarea
                value={reviewForm.review}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, review: e.target.value }))}
                placeholder="Share your experience with this product"
                required
                rows={5}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-sm font-['Space_Grotesk'] outline-none focus:border-sky-700 resize-y"
              />

              <div className="flex items-center justify-end gap-4">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="h-10 px-4 bg-sky-700 text-white text-sm font-medium font-['Space_Grotesk'] rounded-3xl hover:bg-sky-800 disabled:opacity-60"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              {reviewNotice && (
                <p className="text-sm font-['Space_Grotesk'] text-sky-700">{reviewNotice}</p>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-neutral-700 text-lg md:text-2xl font-semibold font-['Onest']">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-6 md:gap-y-11">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} bg="bg-white" />
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
