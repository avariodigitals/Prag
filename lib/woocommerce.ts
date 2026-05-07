import { unstable_cache } from 'next/cache';
import type { Product, Category, Tag, Store } from './types';

const PRODUCTS_FETCH_PAGE_SIZE = 100;
const FETCH_TIMEOUT_MS = 7000;

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
      if (res.ok || attempt === retries) return res;
    } catch {
      clearTimeout(timeout);
    }
  }
  return null;
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetchWithRetry(`${baseUrl()}${path}${path.includes('?') ? '&' : '?'}${authParams()}`, {
      next: { revalidate: 300 },
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

  const kva = normalized.match(/(\d+(?:\.\d+)?)\s*kva\b/);
  if (kva) return Number(kva[1]) * 1_000_000;

  const kw = normalized.match(/(\d+(?:\.\d+)?)\s*kw\b/);
  if (kw) return Number(kw[1]) * 100_000;

  const ah = normalized.match(/(\d+(?:\.\d+)?)\s*ah\b/);
  if (ah) return Number(ah[1]) * 1_000;

  const watts = normalized.match(/(\d+(?:\.\d+)?)\s*w\b/);
  if (watts) return Number(watts[1]) * 100;

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

function extractPhaseCount(product: Product): number {
  const attrs = (product.attributes ?? [])
    .map((attr) => `${attr.name} ${(attr.options ?? []).join(' ')}`)
    .join(' ');
  const haystack = `${product.name} ${attrs}`.toLowerCase();
  const match = haystack.match(/(\d)\s*phase\b/);
  return match ? Number(match[1]) : 1;
}

function sortProductsByCapacityThenPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const capA = extractCapacityScore(a);
    const capB = extractCapacityScore(b);
    if (capA !== capB) {
      if (Number.isFinite(capA) && Number.isFinite(capB)) return capA - capB;
      return Number.isFinite(capA) ? -1 : 1;
    }

    const phaseDiff = extractPhaseCount(a) - extractPhaseCount(b);
    if (phaseDiff !== 0) return phaseDiff;

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
    1
  );
  if (!res) return { products: [], total: 0 };
  if (!res.ok) return { products: [], total: 0 };
  const text = await res.text();
  if (!text.startsWith('[')) return { products: [], total: 0 };

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

export const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const products = await wcFetch<Product[]>(`/products?featured=true&per_page=6&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
    return sortProductsByCapacityThenPrice(products);
  },
  ['featured-products'],
  { revalidate: 300 }
);

export const getFlashSaleProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const products = await wcFetch<Product[]>(`/products?on_sale=true&per_page=4&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
    return sortProductsByCapacityThenPrice(products);
  },
  ['flash-sale-products'],
  { revalidate: 300 }
);

export async function getCategories(): Promise<Category[]> {
  return wcFetch<Category[]>(`/products/categories?per_page=100&hide_empty=true&_fields=${CATEGORY_FIELDS}`, []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetchWithRetry(
      `${baseUrl()}/products?slug=${slug}&_fields=id,name,slug,price,regular_price,sale_price,on_sale,status,stock_status,short_description,description,images,categories,tags,featured,date_created,attributes,dimensions,weight&${authParams()}`,
      { next: { revalidate: 120 } },
      FETCH_TIMEOUT_MS,
      1
    );
    if (!res) return null;
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.startsWith('[')) return null;
    const products = JSON.parse(text) as Product[];
    return products[0] ?? null;
  } catch {
    return null;
  }
}

export interface ProductsResult {
  products: Product[];
  total: number;
}

export async function getProducts({
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
}): Promise<ProductsResult> {
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

  if (!hasExplicitSort) {
    try {
      const { products: allProducts, total } = await fetchAllProductsForDefaultSort(baseQs, 300);
      const start = (page - 1) * per_page;
      const end = start + per_page;
      return { products: allProducts.slice(start, end), total };
    } catch {
      return { products: [], total: 0 };
    }
  }

  const qs = new URLSearchParams(baseQs.toString());
  qs.set('per_page', String(per_page));
  qs.set('page', String(page));

  try {
    return await fetchProductsRaw(qs, 300);
  } catch {
    return { products: [], total: 0 };
  }
}

export interface ProductReview {
  id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export async function getProductReviews(productId: number): Promise<ProductReview[]> {
  try {
    const res = await fetchWithRetry(
      `${baseUrl()}/products/reviews?product=${productId}&per_page=10&status=approved&${authParams()}`,
      { next: { revalidate: 120 } },
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
}

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

export async function searchProducts(query: string, sort?: string, page = 1, per_page = 9): Promise<ProductsResult> {
  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;
  const baseQs = new URLSearchParams({
    search: query,
    status: 'publish',
    _fields: PRODUCT_LIST_FIELDS,
    ...(orderby && { orderby }),
    ...(order && { order }),
  });

  const hasExplicitSort = Boolean(orderby || order);

  if (!hasExplicitSort) {
    try {
      const { products: allProducts, total } = await fetchAllProductsForDefaultSort(baseQs, 0);
      const start = (page - 1) * per_page;
      const end = start + per_page;
      return { products: allProducts.slice(start, end), total };
    } catch {
      return { products: [], total: 0 };
    }
  }

  const qs = new URLSearchParams(baseQs.toString());
  qs.set('per_page', String(per_page));
  qs.set('page', String(page));

  try {
    return await fetchProductsRaw(qs, 0);
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

export async function getStores(): Promise<Store[]> {
  try {
    const url = `${wpBase()}/prag_store?per_page=100&_fields=id,title,meta`;
    const res = await fetch(url, { cache: 'no-store' });
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
}

export async function getProductsForCompare(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const results = await Promise.all(slugs.map((slug) => getProductBySlug(slug)));
  return results.filter((p): p is Product => p !== null);
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  yoast_head_json?: { title?: string; description?: string };
}

export async function getPage(slug: string): Promise<WPPage | null> {
  const pages = await wpFetch<WPPage[]>(`/pages?slug=${slug}&_fields=id,slug,title,content,excerpt,yoast_head_json`, []);
  return pages[0] ?? null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiry_type?: string;
  message: string;
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

export async function getPosts({
  category,
  per_page = 9,
  page = 1,
}: { category?: string; per_page?: number; page?: number } = {}): Promise<{ posts: WPPost[]; total: number }> {
  const qs = new URLSearchParams({
    per_page: String(per_page),
    page: String(page),
    _embed: '1',
    ...(category && { categories: category }),
  });
  try {
    const res = await fetch(`${wpBase()}/posts?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return { posts: [], total: 0 };
    const text = await res.text();
    if (!text.startsWith('[')) return { posts: [], total: 0 };
    return { posts: JSON.parse(text) as WPPost[], total: Number(res.headers.get('X-WP-Total') ?? 0) };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`/posts?slug=${slug}&_embed=1`, []);
  return posts[0] ?? null;
}

export async function getPostCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>('/categories?per_page=20&hide_empty=true', []);
}

export interface TechDocument {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
  file_size: string;
  pages: string;
  product_id: number;
}

export async function getTechDocuments(productId?: number): Promise<TechDocument[]> {
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
}

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
  brand_banner_title: string;
  brand_banner_description: string;
  brand_banner_cta: string;
  brand_banner_link: string;
  brand_banner_image: string;
  hero_background: string;
  socials: { facebook: string; instagram: string; linkedin: string; twitter: string; whatsapp: string };
  slides: { title: string; description: string; cta: string; link: string; productImage: string; productAlt: string }[];
  categories: { name: string; slug: string; image: string }[];
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
  brand_banner_title: 'No Hype. Just Inverters That Deliver.',
  brand_banner_description: 'Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.',
  brand_banner_cta: 'Buy Inverters Built to Last',
  brand_banner_link: '/products/inverters',
  brand_banner_image: 'https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png',
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
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json'}/prag-core/v1/settings`,
      { next: { revalidate: 300 } }
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
    };
  } catch {
    return SETTINGS_FALLBACK;
  }
}

export function shopUrl(slug: string) {
  return `${process.env.NEXT_PUBLIC_SHOP_URL}/product/${slug}`;
}

export function productUrl(product: Pick<Product, 'slug' | 'categories'>) {
  const categorySlug = product.categories[0]?.slug ?? 'products';
  return `/products/${categorySlug}/${product.slug}`;
}

export function formatPrice(price: string) {
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}
