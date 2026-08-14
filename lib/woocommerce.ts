import { unstable_cache } from 'next/cache';
import type { Product, Category, Tag, Store } from './types';

const PRODUCTS_FETCH_PAGE_SIZE = 100;
const FETCH_TIMEOUT_MS = 7000;
const PUBLIC_PRODUCTS_REVALIDATE_SECONDS = 600;
const PUBLIC_CONTENT_REVALIDATE_SECONDS = 3600;

function authParams() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

async function fetchWithRetry(url: string, init: RequestInit, timeoutMs = FETCH_TIMEOUT_MS, retries = 1): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const startedAt = Date.now();
    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        keepalive: true,
        headers: {
          Connection: 'keep-alive',
          ...(init.headers as Record<string, string> ?? {}),
        },
      });
      clearTimeout(timeout);
      const durationMs = Date.now() - startedAt;
      if (!res.ok || durationMs > 1200) {
        console.warn(`[perf:b2c-fetch] ${durationMs}ms ${res.ok ? 'ok' : 'error'} ${url}`);
      }
      if (res.ok || attempt === retries) return res;
    } catch {
      clearTimeout(timeout);
      const durationMs = Date.now() - startedAt;
      console.warn(`[perf:b2c-fetch] ${durationMs}ms error ${url}`);
    }
  }
  return null;
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetchWithRetry(`${baseUrl()}${path}${path.includes('?') ? '&' : '?'}${authParams()}`, {
      next: { revalidate: 600 },
    }, FETCH_TIMEOUT_MS, 1);
    if (!res) return fallback;
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

const PRODUCT_LIST_FIELDS = 'id,name,slug,price,regular_price,sale_price,images,categories,on_sale,stock_status,date_created,attributes';
const CATEGORY_FIELDS = 'id,name,slug,description,count,parent';

function toPriceNumber(product: Product): number {
  const candidates = [product.price, product.sale_price, product.regular_price];
  for (const value of candidates) {
    const parsed = Number(String(value ?? '').replace(/,/g, ''));
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return Number.POSITIVE_INFINITY;
}

function capacityFromText(text: string): number | null {
  const normalized = text.toLowerCase();

  const batteryRack = normalized.match(/(\d+(?:\.\d+)?)\s*[x*]\s*(\d+(?:\.\d+)?)\s*v\s*(\d+(?:\.\d+)?)\s*ah/);
  if (batteryRack) {
    const count = Number(batteryRack[1]);
    const volt = Number(batteryRack[2]);
    const ah = Number(batteryRack[3]);
    if (Number.isFinite(count) && Number.isFinite(volt) && Number.isFinite(ah)) {
      return count * volt * ah;
    }
  }

  // KW — real power, ranks slightly above KVA for the same number
  const kw = normalized.match(/(\d+(?:\.\d+)?)\s*kw\b/);
  if (kw) return Number(kw[1]) * 1_000_000 + 100_000;

  // KVA — apparent power, base scale
  const kva = normalized.match(/(\d+(?:\.\d+)?)\s*kva\b/);
  if (kva) return Number(kva[1]) * 1_000_000;

  const ah = normalized.match(/(\d+(?:\.\d+)?)\s*ah\b/);
  if (ah) return Number(ah[1]) * 1_000;

  // Watts — convert to KW scale (3000W = 3KW)
  const watts = normalized.match(/(\d+(?:\.\d+)?)\s*w\b/);
  if (watts) return (Number(watts[1]) / 1000) * 1_000_000 + 100_000;

  return null;
}

function extractCapacityScore(product: Product): number {
  const attrs = (product.attributes ?? [])
    .map((attr) => `${attr.name} ${(attr.options ?? []).join(' ')}`)
    .join(' ');
  const haystack = `${product.name} ${attrs}`;
  const fromText = capacityFromText(haystack);
  if (fromText !== null) return fromText;

  // Keep unknown capacities at the end while preserving deterministic ordering.
  return Number.POSITIVE_INFINITY;
}

function sortProductsByCapacityThenPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const capA = extractCapacityScore(a);
    const capB = extractCapacityScore(b);
    if (capA !== capB) {
      if (Number.isFinite(capA) && Number.isFinite(capB)) return capA - capB;
      return Number.isFinite(capA) ? -1 : 1;
    }

    const priceA = toPriceNumber(a);
    const priceB = toPriceNumber(b);
    if (priceA !== priceB) {
      if (Number.isFinite(priceA) && Number.isFinite(priceB)) return priceA - priceB;
      return Number.isFinite(priceA) ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

async function fetchProductsRaw(qs: URLSearchParams, revalidate = 300): Promise<{ products: Product[]; total: number }> {
  const res = await fetchWithRetry(
    `${baseUrl()}/products?${qs}&${authParams()}`,
    {
      next: { revalidate },
    },
    FETCH_TIMEOUT_MS,
    2
  );
  if (!res) throw new Error('Product fetch failed (no response)');
  if (!res.ok) throw new Error(`Product fetch failed (HTTP ${res.status})`);
  const text = await res.text();
  if (!text.startsWith('[')) throw new Error('Product fetch returned non-array response');

  return {
    products: JSON.parse(text) as Product[],
    total: Number(res.headers.get('X-WP-Total') ?? 0),
  };
}

async function fetchAllProductsForDefaultSort(baseParams: URLSearchParams, revalidate = 300): Promise<{ products: Product[]; total: number }> {
  const firstQs = new URLSearchParams(baseParams.toString());
  firstQs.set('per_page', String(PRODUCTS_FETCH_PAGE_SIZE));
  firstQs.set('page', '1');

  const firstPage = await fetchProductsRaw(firstQs, revalidate);
  if (firstPage.total <= firstPage.products.length) {
    return { products: sortProductsByCapacityThenPrice(firstPage.products), total: firstPage.total };
  }

  const totalPages = Math.ceil(firstPage.total / PRODUCTS_FETCH_PAGE_SIZE);
  const remainingPageNumbers = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => i + 2);

  const rest = await Promise.all(
    remainingPageNumbers.map(async (pageNumber) => {
      const qs = new URLSearchParams(baseParams.toString());
      qs.set('per_page', String(PRODUCTS_FETCH_PAGE_SIZE));
      qs.set('page', String(pageNumber));
      return fetchProductsRaw(qs, revalidate);
    })
  );

  const allProducts = [
    ...firstPage.products,
    ...rest.flatMap((result) => result.products),
  ];

  return {
    products: sortProductsByCapacityThenPrice(allProducts),
    total: firstPage.total,
  };
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAccurateSearchMatch(product: Product, query: string): boolean {
  const tokens = normalizeSearchText(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return false;

  const normalizedName = normalizeSearchText(product.name);
  const normalizedCategories = (product.categories ?? []).map((category) => normalizeSearchText(category.name));

  const matchesName = tokens.every((token) => normalizedName.includes(token));
  if (matchesName) return true;

  return normalizedCategories.some((category) => tokens.every((token) => category.includes(token)));
}

export const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const products = await wcFetch<Product[]>(`/products?featured=true&per_page=8&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
    return sortProductsByCapacityThenPrice(products);
  },
  ['featured-products'],
  { revalidate: 600, tags: ['featured-products'] }
);

export const getFlashSaleProducts = unstable_cache(
  async (): Promise<Product[]> => {
    // Fetch a wider pool so we can drop out-of-stock / non-discounted items
    // and still surface 3-4 genuinely discounted, in-stock products.
    const products = await wcFetch<Product[]>(`/products?on_sale=true&per_page=12&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
    const genuinelyDiscounted = products.filter((p) => {
      if (p.stock_status !== 'instock') return false;
      const regular = Number(p.regular_price);
      const sale = Number(p.sale_price || p.price);
      return Number.isFinite(regular) && Number.isFinite(sale) && regular > sale && sale > 0;
    });
    return sortProductsByCapacityThenPrice(genuinelyDiscounted).slice(0, 4);
  },
  ['flash-sale-products'],
  { revalidate: 600, tags: ['flash-sale-products'] }
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return wcFetch<Category[]>(`/products/categories?per_page=100&hide_empty=true&_fields=${CATEGORY_FIELDS}`, []);
  },
  ['product-categories'],
  { revalidate: 3600, tags: ['product-categories'] }
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const res = await fetchWithRetry(
      `${baseUrl()}/products?slug=${slug}&status=publish&_fields=id,name,slug,sku,price,regular_price,sale_price,on_sale,status,stock_status,short_description,description,images,categories,tags,featured,date_created,attributes,dimensions,weight&${authParams()}`,
      { next: { revalidate: 600 } },
      FETCH_TIMEOUT_MS,
      2
    );
    if (!res || !res.ok) throw new Error(`Failed to fetch product "${slug}"`);
    const text = await res.text();
    if (!text.startsWith('[')) return null;
    const products = JSON.parse(text) as Product[];
    return products[0] ?? null;
  },
  ['product-by-slug'],
  { revalidate: 3600, tags: ['product-by-slug'] }
);

export interface ProductsResult {
  products: Product[];
  total: number;
}

export const getProducts = unstable_cache(
  async ({
    category,
    category_id,
    min_price,
    max_price,
    tag,
    orderby,
    order,
    page = 1,
    per_page = 9,
  }: {
    category?: string;
    category_id?: number | string;
    min_price?: string;
    max_price?: string;
    tag?: string;
    orderby?: string;
    order?: string;
    page?: number;
    per_page?: number;
  }): Promise<ProductsResult> => {
    // Resolve category slug to ID using cached lookup
    let categoryId: string | undefined = category_id ? String(category_id) : undefined;
    if (!categoryId && category) {
      const cat = await getCategoryBySlug(category);
      categoryId = cat?.id ? String(cat.id) : category;
    }

    const baseQs = new URLSearchParams({
      status: 'publish',
      _fields: PRODUCT_LIST_FIELDS,
      ...(categoryId && { category: categoryId }),
      ...(min_price && { min_price }),
      ...(max_price && { max_price }),
      ...(tag && { tag }),
      ...(orderby && { orderby }),
      ...(order && { order }),
    });

    const hasExplicitSort = Boolean(orderby || order);

    const qs = new URLSearchParams(baseQs.toString());
    qs.set('per_page', String(per_page));
    qs.set('page', String(page));
    if (!hasExplicitSort) {
      qs.set('orderby', 'menu_order');
      qs.set('order', 'asc');
    }

    return await fetchProductsRaw(qs, PUBLIC_PRODUCTS_REVALIDATE_SECONDS);
  },
  ['products-list'],
  { revalidate: 600, tags: ['products-list'] }
);

export interface ProductReview {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export const getProductReviews = unstable_cache(
  async (productId: number): Promise<ProductReview[]> => {
    try {
      const res = await fetchWithRetry(
        `${baseUrl()}/products/reviews?product=${productId}&per_page=10&status=approved&${authParams()}`,
        { next: { revalidate: 3600 } },
        FETCH_TIMEOUT_MS,
        1
      );
      if (!res) return [];
      if (!res.ok) return [];
      const text = await res.text();
      if (!text.startsWith('[')) return [];
      return JSON.parse(text) as ProductReview[];
    } catch {
      return [];
    }
  },
  ['product-reviews'],
  { revalidate: 3600, tags: ['product-reviews'] }
);

export async function getProductTags(): Promise<Tag[]> {
  return wcFetch<Tag[]>('/products/tags?per_page=20&hide_empty=true', []);
}

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    const cats = await wcFetch<Category[]>(`/products/categories?slug=${slug}&_fields=${CATEGORY_FIELDS}`, []);
    return cats[0] ?? null;
  },
  ['category-by-slug'],
  { revalidate: 3600 }
);

export async function searchProducts(query: string, _sort?: string, page = 1, per_page = 9): Promise<ProductsResult> {
  const baseQs = new URLSearchParams({
    search: query,
    status: 'publish',
    _fields: PRODUCT_LIST_FIELDS,
  });

  try {
    const { products: allProducts } = await fetchAllProductsForDefaultSort(baseQs, PUBLIC_PRODUCTS_REVALIDATE_SECONDS);
    const filteredProducts = allProducts.filter((product) => isAccurateSearchMatch(product, query));
    const start = (page - 1) * per_page;
    const end = start + per_page;
    return { products: filteredProducts.slice(start, end), total: filteredProducts.length };
  } catch {
    return { products: [], total: 0 };
  }
}

export async function getSubcategories(parentSlug: string): Promise<Category[]> {
  const parent = await getCategoryBySlug(parentSlug);
  if (!parent) return [];
  return wcFetch<Category[]>(`/products/categories?parent=${parent.id}&per_page=20`, []);
}

export const getSubcategoriesByParentId = unstable_cache(
  async (parentId: number): Promise<Category[]> => {
    return wcFetch<Category[]>(`/products/categories?parent=${parentId}&per_page=20&_fields=${CATEGORY_FIELDS}`, []);
  },
  ['subcategories-by-parent'],
  { revalidate: 3600 }
);

// WordPress REST API base (without /wc/v3)
function wpBase() {
  return baseUrl().replace('/wp-json/wc/v3', '/wp-json/wp/v2');
}

async function wpFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetchWithRetry(`${wpBase()}${path}`, {
      next: { revalidate: 300 },
    }, 8000, 1);
    if (!res) return fallback;
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export const getStores = unstable_cache(
  async (): Promise<Store[]> => {
    try {
      const url = `${wpBase()}/prag_store?per_page=100&_fields=id,title,meta`;
      const res = await fetch(url, {
        next: {
          revalidate: 300,
          tags: ['wc-stores', 'wordpress-content'],
        },
      });
      if (!res.ok) return [];
      const data = await res.json() as Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>;
      return data.map((s) => ({
        id: s.id,
        name: s.title?.rendered ?? '',
        city: s.meta?.city ?? '',
        address: s.meta?.address ?? '',
        phone: s.meta?.phone ?? '',
        map_url: s.meta?.map_url ?? '',
        type: (s.meta?.store_type as Store['type']) ?? 'prag',
        logo: s.meta?.logo_url
          ? {
              src: s.meta.logo_url,
              alt: s.meta?.logo_alt ?? s.title?.rendered ?? '',
            }
          : undefined,
      }));
    } catch {
      return [];
    }
  },
  ['prag-stores'],
  { revalidate: 300, tags: ['wc-stores', 'wordpress-content'] }
);

export async function getProductsForCompare(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const results = await Promise.allSettled(slugs.map((slug) => getProductBySlug(slug)));
  return results
    .filter((r): r is PromiseFulfilledResult<Product | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((p): p is Product => p !== null);
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  yoast_head_json?: { title?: string; description?: string };
}

export const getPage = unstable_cache(
  async (slug: string): Promise<WPPage | null> => {
    const pages = await wpFetch<WPPage[]>(`/pages?slug=${slug}&_fields=id,slug,title,content,excerpt,yoast_head_json`, []);
    return pages[0] ?? null;
  },
  ['wp-page'],
  { revalidate: 3600 }
);

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiry_type?: string;
  message: string;
  turnstileToken?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: { 'wp:featuredmedia'?: [{ source_url: string; alt_text: string }] };
  categories: number[];
  tags: number[];
  acf?: Record<string, unknown>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export const getPosts = unstable_cache(
  async ({
    category,
    per_page = 9,
    page = 1,
  }: { category?: string; per_page?: number; page?: number } = {}): Promise<{ posts: WPPost[]; total: number }> => {
    const qs = new URLSearchParams({
      per_page: String(per_page),
      page: String(page),
      _embed: '1',
      ...(category && { categories: category }),
    });
    try {
      const res = await fetch(`${wpBase()}/posts?${qs}`, { next: { revalidate: 300 } });
      if (!res.ok) return { posts: [], total: 0 };
      const text = await res.text();
      if (!text.startsWith('[')) return { posts: [], total: 0 };
      return { posts: JSON.parse(text) as WPPost[], total: Number(res.headers.get('X-WP-Total') ?? 0) };
    } catch {
      return { posts: [], total: 0 };
    }
  },
  ['wp-posts'],
  { revalidate: 300 }
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<WPPost | null> => {
    const posts = await wpFetch<WPPost[]>(`/posts?slug=${slug}&_embed=1`, []);
    return posts[0] ?? null;
  },
  ['wp-post-by-slug'],
  { revalidate: 3600 }
);

export const getPostCategories = unstable_cache(
  async (): Promise<WPCategory[]> => {
    return wpFetch<WPCategory[]>('/categories?per_page=20&hide_empty=true', []);
  },
  ['wp-post-categories'],
  { revalidate: 3600 }
);

export interface TechDocument {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  pages: string;
  product_id: number;
}

export const getTechDocuments = unstable_cache(
  async (productId?: number): Promise<TechDocument[]> => {
    try {
      const path = '/prag_document?per_page=100&_fields=id,title,meta';
      const docs = await wpFetch<Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>>(path, []);
      const normalized = docs.map((d) => ({
        id: d.id,
        title: d.title?.rendered ?? '',
        file_url: d.meta?.file_url ?? '',
        file_type: d.meta?.file_type ?? '',
        file_size: d.meta?.file_size ?? '',
        pages: d.meta?.pages ?? '',
        product_id: Number(d.meta?.product_id ?? 0),
      })).filter((d) => d.file_url);

      if (!productId) return normalized;

      // Always enforce product-level filtering client-side to avoid shared/global docs
      // when the WordPress endpoint ignores meta_key/meta_value query arguments.
      return normalized.filter((d) => d.product_id === productId);
    } catch {
      return [];
    }
  },
  ['tech-documents'],
  { revalidate: 3600, tags: ['tech-documents'] }
);

export interface SiteSettings {
  contact_phone: string;
  contact_email: string;
  whatsapp: string;
  address: string;
  business_hours_weekday: string;
  business_hours_saturday: string;
  announcement_bar: string;
  site_under_construction: boolean;
  under_construction_title: string;
  under_construction_message: string;
  footer_description: string;
  brand_banner_kicker: string;
  brand_banner_title: string;
  brand_banner_description: string;
  brand_banner_cta: string;
  brand_banner_link: string;
  brand_banner_whatsapp_text: string;
  brand_banner_image: string;
  final_cta_title: string;
  final_cta_subtitle: string;
  final_cta_shop_text: string;
  final_cta_shop_link: string;
  final_cta_whatsapp_text: string;
  checkout_faq_kicker: string;
  checkout_faq_title: string;
  checkout_faq_subtitle: string;
  checkout_faq_link_text: string;
  checkout_faq_link_url: string;
  checkout_faq_items: { question: string; answer: string }[];
  checkout_faq_banner_enabled: boolean;
  checkout_faq_banner_image: string;
  checkout_faq_banner_link: string;
  testimonial_enabled: boolean;
  testimonial_title: string;
  testimonial_subtitle: string;
  testimonial_items: { rating: number; quote: string; name: string; location: string; product: string; image: string }[];
  home_need_enabled: boolean;
  home_need_title: string;
  home_need_subtitle: string;
  home_need_items: { title: string; description: string; cta: string; link: string; icon: string; image: string }[];
  // Trust Signal ("Why People Buy PRAG" / "Buy With Confidence") — above Flash Sales
  trust_signal_enabled: boolean;
  trust_signal_kicker: string;
  trust_signal_title: string;
  trust_signal_stats: { value: string; label: string }[];
  trust_signal_badges: { label: string }[];
  hero_background: string;
  socials: { facebook: string; instagram: string; linkedin: string; twitter: string; whatsapp: string };
  slides: { title: string; description: string; cta: string; link: string; productImage: string; productAlt: string; backgroundImage?: string; showProductImage?: boolean; enabled?: boolean }[];
  categories: { name: string; slug: string; image: string }[];
  hidden_categories: string[];
  category_order: string[];
  subcategory_order: Record<string, string[]>;
}

const SETTINGS_FALLBACK: SiteSettings = {
  contact_phone: '+2348032170129',
  contact_email: 'sales@prag.global',
  whatsapp: '+2348032170129',
  address: '14 Industrial Layout, Victoria Island, Lagos, Nigeria',
  business_hours_weekday: 'Mon–Fri: 8:00 AM – 6:00 PM',
  business_hours_saturday: 'Sat: 9:00 AM – 2:00 PM',
  announcement_bar: '',
  site_under_construction: false,
  under_construction_title: 'We are coming back soon',
  under_construction_message: 'We are currently making improvements to serve you better. Please check back shortly.',
  footer_description: 'Nigeria\'s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.',
  brand_banner_kicker: 'HELP ME CHOOSE',
  brand_banner_title: 'Not Sure What to Buy?',
  brand_banner_description: 'Tell us what you want to power and we\'ll help you find the right PRAG setup.',
  brand_banner_cta: 'Use Power Calculator',
  brand_banner_link: '/power-calculator',
  brand_banner_whatsapp_text: 'Ask PRAG on WhatsApp',
  brand_banner_image: '',
  final_cta_title: 'Ready for More Reliable Power?',
  final_cta_subtitle: 'Shop PRAG power solutions for your home today.',
  final_cta_shop_text: 'Shop Now',
  final_cta_shop_link: '/products',
  final_cta_whatsapp_text: 'Chat with PRAG on WhatsApp',
  checkout_faq_kicker: 'FAQ',
  checkout_faq_title: 'Still deciding? Here\'s what you need to know before you buy.',
  checkout_faq_subtitle: 'Straight answers on sizing, warranty, delivery and installation — so you can shop with confidence and never second-guess your power setup.',
  checkout_faq_link_text: 'Find your perfect inverter size',
  checkout_faq_link_url: '/power-calculator',
  checkout_faq_items: [
    { question: 'Which inverter size should I buy?', answer: 'The right inverter size depends on the total wattage of the appliances you want to power and how long you need them running. Add up the wattage of your essential loads (fridge, lights, TV, fans) and add a 20–30% buffer for surge power. Use our Power Calculator for an instant recommendation, or chat with our team for a tailored sizing.' },
    { question: 'How do I know what battery I need?', answer: 'Battery sizing depends on your inverter size, how long you want backup power, and your daily energy usage. A 12V system works for small setups, while 48V is better for larger loads. Lithium batteries last longer and charge faster than lead-acid. Use our Power Calculator or talk to our team to match the right battery capacity (Ah) to your inverter and runtime needs.' },
    { question: 'How long will my battery last?', answer: 'Battery runtime depends on capacity (kWh), the load you are running, and battery chemistry. A 2.4kWh lithium battery powering a 300W load gives roughly 6–7 hours of backup. Lithium batteries typically last 5–10 years with proper use, while lead-acid batteries last 2–4 years. Our team can help you estimate runtime for your specific setup.' },
    { question: 'Do PRAG products come with warranty?', answer: 'Yes. All PRAG products come with a manufacturer\'s warranty — typically 5 years for inverters and stabilizers, and up to 10 years for lithium batteries. Warranty covers manufacturing defects and component failures under normal use. Your warranty is activated automatically at purchase.' },
    { question: 'Do you deliver nationwide?', answer: 'Yes, we deliver to all 36 states in Nigeria. Orders within Lagos arrive within 1–2 business days, while other states typically take 2–5 business days. Shipping is free on orders over ₦500,000. You will receive tracking details once your order is dispatched.' },
    { question: 'Can I get help choosing the right product?', answer: 'Absolutely. You can use our Power Calculator for an instant recommendation, chat with us on WhatsApp, call our support line, or visit any PRAG store. Our team will guide you to the right inverter, battery, or solar setup based on your budget and power needs.' },
    { question: 'Can PRAG help with installation?', answer: 'Yes. PRAG offers professional installation through our certified engineers and authorized partner network across Nigeria. We handle everything from residential inverter setups to full solar installations. Schedule an installation by contacting us or visiting a PRAG store after your purchase.' },
  ],
  checkout_faq_banner_enabled: true,
  checkout_faq_banner_image: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
  checkout_faq_banner_link: '/products/inverters',
  testimonial_enabled: true,
  testimonial_title: 'Trusted in Homes Across Nigeria',
  testimonial_subtitle: 'Real reviews from real PRAG customers who took control of their power.',
  testimonial_items: [
    { rating: 5, quote: 'I bought a 3.5kVA inverter and two lithium batteries for my flat. From the day it was installed, I have not had a single dark night. The team came, sized everything properly, and installed it clean. Worth every naira.', name: 'Chidi', location: 'Lekki, Lagos', product: '3.5kVA Inverter + Lithium Battery', image: '' },
    { rating: 5, quote: 'The stabilizer saved my fridge and TV during the voltage spikes in our area. It has been running silently for eight months now — no issues at all. PRAG makes solid products.', name: 'Aisha', location: 'Kano', product: '5kVA Voltage Stabilizer', image: '' },
    { rating: 5, quote: 'I was tired of spending on fuel. PRAG set up a solar system for my home and I barely touch my generator now. Installation was professional and the support team answered every question.', name: 'Emeka', location: 'Port Harcourt', product: 'Solar System Installation', image: '' },
  ],
  home_need_enabled: true,
  home_need_title: 'Power Your Home Your Way',
  home_need_subtitle: 'Whatever your setup, PRAG has a reliable power solution sized for how you actually live.',
  home_need_items: [
    { title: 'For Apartments', description: 'Compact inverter and battery combos that fit tight spaces and keep your essentials running through every outage.', cta: 'Get Recommendations', link: '/home-needs/apartments', icon: '', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
    { title: 'For Family Homes', description: 'Higher-capacity inverters with extended-life lithium batteries for longer runtime across more rooms and appliances.', cta: 'Get Recommendations', link: '/home-needs/family-homes', icon: '', image: 'https://images.unsplash.com/photo-1568605114967-8130f81a6e54?w=800&q=80' },
    { title: 'For Home Offices', description: 'Quiet, clean power that keeps your laptop, internet router, and essential devices online without missing a beat.', cta: 'Get Recommendations', link: '/home-needs/home-offices', icon: '', image: 'https://images.unsplash.com/photo-1593696954577-ab3d39817b21?w=800&q=80' },
    { title: 'For Solar Homes', description: 'Solar panels and hybrid inverters that cut your grid and generator dependence — and your fuel bill.', cta: 'Get Recommendations', link: '/home-needs/solar-homes', icon: '', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80' },
  ],
  trust_signal_enabled: true,
  trust_signal_kicker: 'Why People Buy PRAG',
  trust_signal_title: 'Buy With Confidence',
  trust_signal_stats: [
    { value: '36', label: 'States Covered' },
    { value: '15+', label: 'Years Power Expertise' },
    { value: '50K+', label: 'Installations' },
  ],
  trust_signal_badges: [
    { label: 'Product Warranty' },
    { label: 'Nationwide Delivery' },
    { label: 'Expert Support' },
    { label: 'Secure Checkout' },
  ],
  hero_background: 'https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png',
  socials: {
    facebook: 'https://www.facebook.com/pragpowersolutions',
    instagram: 'https://www.instagram.com/prag_ng/',
    linkedin: 'https://www.linkedin.com/company/prag/',
    twitter: '',
    whatsapp: 'https://wa.me/2348032170129',
  },
  slides: [
    { title: 'No Hype. Just Inverters That Deliver.', description: 'Choose inverters engineered for real-world loads. Shop reliable power systems today.', cta: 'Buy Inverters Built to Last', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png', productAlt: 'Heavy Duty Inverter' },
    { title: 'Power Your Home. Power Your Business.', description: 'From residential to industrial applications. Trusted inverters for every power need.', cta: 'Explore Our Range', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png', productAlt: 'Residential Inverter' },
    { title: 'Built Tough. Tested Tougher.', description: 'Heavy-duty inverters designed to handle the toughest loads without compromise.', cta: 'Shop Heavy Duty Inverters', link: '/inverter', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png', productAlt: 'Industrial Inverter' },
    { title: 'Reliable Power. Unbeatable Performance.', description: 'Experience consistent power delivery with inverters engineered for excellence.', cta: 'Get Started Today', link: '/products', productImage: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png', productAlt: 'Premium Inverter' },
  ],
  categories: [
    { name: 'Voltage Stabilizers', slug: 'voltage-stabilizers', image: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png' },
    { name: 'Inverters', slug: 'inverters', image: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png' },
    { name: 'Solar Panels', slug: 'solar', image: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png' },
    { name: 'Batteries', slug: 'batteries', image: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png' },
  ],
  hidden_categories: [],
  category_order: [],
  subcategory_order: {},
};

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json'}/prag-core/v1/settings`,
        {
          next: {
            revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
            tags: ['wc-settings', 'wordpress-content'],
          },
        }
      );
      if (!res.ok) return SETTINGS_FALLBACK;
      const data = await res.json();
      // Deep merge: fallback fills any missing keys
      return {
        ...SETTINGS_FALLBACK,
        ...data,
        socials: { ...SETTINGS_FALLBACK.socials, ...(data.socials ?? {}) },
        slides: Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : SETTINGS_FALLBACK.slides,
        categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : SETTINGS_FALLBACK.categories,
        checkout_faq_items: Array.isArray(data.checkout_faq_items) && data.checkout_faq_items.length > 0 ? data.checkout_faq_items : SETTINGS_FALLBACK.checkout_faq_items,
        testimonial_items: Array.isArray(data.testimonial_items) && data.testimonial_items.length > 0 ? data.testimonial_items : SETTINGS_FALLBACK.testimonial_items,
        home_need_items: Array.isArray(data.home_need_items) && data.home_need_items.length > 0 ? data.home_need_items : SETTINGS_FALLBACK.home_need_items,
        trust_signal_stats: Array.isArray(data.trust_signal_stats) && data.trust_signal_stats.length > 0 ? data.trust_signal_stats : SETTINGS_FALLBACK.trust_signal_stats,
        trust_signal_badges: Array.isArray(data.trust_signal_badges) && data.trust_signal_badges.length > 0 ? data.trust_signal_badges : SETTINGS_FALLBACK.trust_signal_badges,
        hidden_categories: Array.isArray(data.hidden_categories) ? data.hidden_categories : [],
        category_order: Array.isArray(data.category_order) ? data.category_order : [],
        subcategory_order: data.subcategory_order && typeof data.subcategory_order === 'object' ? data.subcategory_order : {},
      };
    } catch {
      return SETTINGS_FALLBACK;
    }
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] }
);

export interface CustomTab {
  title: string;
  id: string;
  content: string;
}

export const getProductCustomTabs = unstable_cache(
  async (productId: number): Promise<CustomTab[]> => {
    try {
      const wpApi = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
      const res = await fetchWithRetry(`${wpApi}/prag-core/v1/products/${productId}/custom-tabs`, {
        next: { revalidate: 3600 },
      }, FETCH_TIMEOUT_MS, 1);
      if (!res) return [];
      if (!res.ok) return [];
      const text = await res.text();
      if (!text.startsWith('[')) return [];
      return JSON.parse(text) as CustomTab[];
    } catch {
      return [];
    }
  },
  ['product-custom-tabs'],
  { revalidate: 3600, tags: ['product-custom-tabs'] }
);

export function shopUrl(product: Pick<Product, 'slug' | 'categories'>) {
  const shopBase = (process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.prag.global').replace(/\/$/, '');
  const categorySlug = product.categories?.[0]?.slug ?? 'products';
  return `${shopBase}/products/${categorySlug}/${product.slug}`;
}

export function productUrl(product: Pick<Product, 'slug' | 'categories'>) {
  const categorySlug = product.categories[0]?.slug ?? 'products';
  return `/products/${categorySlug}/${product.slug}`;
}

export function formatPrice(price: string) {
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Remove products that belong ONLY to hidden categories. A product is
 * kept as long as at least one of its categories is visible — this
 * prevents losing products that straddle a visible and a hidden category.
 */
export function filterHiddenProducts<T extends { categories?: { slug: string }[] }>(
  products: T[],
  hiddenSlugs: string[] | Set<string> | undefined
): T[] {
  if (!hiddenSlugs) return products;
  const hidden = hiddenSlugs instanceof Set ? hiddenSlugs : new Set(hiddenSlugs);
  if (hidden.size === 0) return products;
  return products.filter((p) => {
    const cats = p.categories ?? [];
    if (cats.length === 0) return true; // no categories — keep
    return cats.some((c) => !hidden.has(c.slug));
  });
}

/**
 * True when a single product belongs ONLY to hidden categories
 * (i.e. it has no visible category at all).
 */
export function isProductHidden<T extends { categories?: { slug: string }[] }>(
  product: T,
  hiddenSlugs: string[] | Set<string> | undefined
): boolean {
  if (!hiddenSlugs) return false;
  const hidden = hiddenSlugs instanceof Set ? hiddenSlugs : new Set(hiddenSlugs);
  if (hidden.size === 0) return false;
  const cats = product.categories ?? [];
  if (cats.length === 0) return false;
  return !cats.some((c) => !hidden.has(c.slug));
}

export const getAllProductSlugs = unstable_cache(
  async (): Promise<{ slug: string; category: string }[]> => {
    try {
      const slugs: { slug: string; category: string }[] = [];
      let page = 1;
      const perPage = 100;
      let hasMore = true;
      while (hasMore) {
        const res = await fetchWithRetry(
          `${baseUrl()}/products?status=publish&per_page=${perPage}&page=${page}&_fields=slug,categories&${authParams()}`,
          { next: { revalidate: 3600 } },
          FETCH_TIMEOUT_MS,
          1
        );
        if (!res || !res.ok) break;
        const text = await res.text();
        if (!text.startsWith('[')) break;
        const products = JSON.parse(text) as { slug: string; categories: { slug: string }[] }[];
        if (products.length === 0) break;
        for (const p of products) {
          slugs.push({ slug: p.slug, category: p.categories?.[0]?.slug ?? 'products' });
        }
        hasMore = products.length === perPage;
        page += 1;
      }
      return slugs;
    } catch {
      return [];
    }
  },
  ['all-product-slugs'],
  { revalidate: 3600, tags: ['all-product-slugs'] }
);
