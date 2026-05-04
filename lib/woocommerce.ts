import { unstable_cache } from 'next/cache';
import type { Product, Category, Tag, Store } from './types';

function authParams() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl()}${path}${path.includes('?') ? '&' : '?'}${authParams()}`, {
      next: { revalidate: 300 },
      signal: controller.signal,
      keepalive: true,
      headers: { 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip, deflate, br' },
    });
    clearTimeout(timeout);
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

const PRODUCT_LIST_FIELDS = 'id,name,slug,price,regular_price,sale_price,images,categories,on_sale,stock_status,date_created';
const CATEGORY_FIELDS = 'id,name,slug,description,count,parent';

export async function getFeaturedProducts(): Promise<Product[]> {
  return wcFetch<Product[]>(`/products?featured=true&per_page=6&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  return wcFetch<Product[]>(`/products?on_sale=true&per_page=4&status=publish&_fields=${PRODUCT_LIST_FIELDS}`, []);
}

export async function getCategories(): Promise<Category[]> {
  return wcFetch<Category[]>(`/products/categories?per_page=10&hide_empty=true&_fields=${CATEGORY_FIELDS}`, []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await wcFetch<Product[]>(`/products?slug=${slug}&_fields=id,name,slug,price,regular_price,sale_price,on_sale,status,stock_status,short_description,description,images,categories,tags,featured,date_created,attributes,dimensions,weight`, []);
  return products[0] ?? null;
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

  const qs = new URLSearchParams({
    status: 'publish',
    per_page: String(per_page),
    page: String(page),
    _fields: PRODUCT_LIST_FIELDS,
    ...(categoryId && { category: categoryId }),
    ...(min_price && { min_price }),
    ...(max_price && { max_price }),
    ...(tag && { tag }),
    ...(orderby && { orderby }),
    ...(order && { order }),
  });
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `${baseUrl()}/products?${qs}&${authParams()}`,
      { next: { revalidate: 300 }, signal: controller.signal, keepalive: true, headers: { 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip, deflate, br' } }
    );
    clearTimeout(timeout);
    if (!res.ok) return { products: [], total: 0 };
    const text = await res.text();
    if (!text.startsWith('[')) return { products: [], total: 0 };
    const total = Number(res.headers.get('X-WP-Total') ?? 0);
    return { products: JSON.parse(text) as Product[], total };
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
  return wcFetch<ProductReview[]>(`/products/reviews?product=${productId}&per_page=10&status=approved`, []);
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
  const qs = new URLSearchParams({
    search: query,
    status: 'publish',
    per_page: String(per_page),
    page: String(page),
    _fields: PRODUCT_LIST_FIELDS,
    ...(orderby && { orderby }),
    ...(order && { order }),
  });
  try {
    const res = await fetch(
      `${baseUrl()}/products?${qs}&${authParams()}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return { products: [], total: 0 };
    const text = await res.text();
    if (!text.startsWith('[')) return { products: [], total: 0 };
    const total = Number(res.headers.get('X-WP-Total') ?? 0);
    return { products: JSON.parse(text) as Product[], total };
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${wpBase()}${path}`, { 
      next: { revalidate: 300 },
      signal: controller.signal,
      headers: { 'Connection': 'keep-alive' },
    });
    clearTimeout(timeout);
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
    const data = await wpFetch<Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>>(
      '/prag_store?per_page=20&_fields=id,title,meta', []
    );
    return data.map((s) => ({
      id: s.id,
      name: s.title?.rendered ?? '',
      city: s.meta?.city ?? '',
      address: s.meta?.address ?? '',
      phone: s.meta?.phone ?? '',
      map_url: s.meta?.map_url ?? '',
      type: (s.meta?.store_type as Store['type']) ?? 'prag',
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
    const res = await fetch(
      `${baseUrl().replace('/wp-json/wc/v3', '/wp-json/contact-form-7/v1/contact-forms/1/feedback')}`,

      {
        method: 'POST',
        body: new URLSearchParams({
          'your-name': data.name,
          'your-email': data.email,
          'your-phone': data.phone ?? '',
          'your-company': data.company ?? '',
          'enquiry-type': data.enquiry_type ?? '',
          'your-message': data.message,
        }),
      }
    );
    const json = await res.json();
    return { success: json.status === 'mail_sent' };
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
    const path = productId
      ? `/prag_document?per_page=20&meta_key=product_id&meta_value=${productId}&_fields=id,title,meta`
      : '/prag_document?per_page=20&_fields=id,title,meta';
    const docs = await wpFetch<Array<{ id: number; title: { rendered: string }; meta: Record<string, string> }>>(path, []);
    return docs.map((d) => ({
      id: d.id,
      title: d.title?.rendered ?? '',
      file_url: d.meta?.file_url ?? '',
      file_type: d.meta?.file_type ?? '',
      file_size: d.meta?.file_size ?? '',
      pages: d.meta?.pages ?? '',
      product_id: Number(d.meta?.product_id ?? 0),
    })).filter((d) => d.file_url);
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
  footer_description: string;
  brand_banner_title: string;
  brand_banner_description: string;
  brand_banner_cta: string;
  brand_banner_link: string;
  brand_banner_image: string;
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
  footer_description: 'Nigeria\'s leading power engineering company. We design, supply and install power solutions for homes, businesses and industrial facilities across the country.',
  brand_banner_title: 'No Hype. Just Inverters That Deliver.',
  brand_banner_description: 'Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption.',
  brand_banner_cta: 'Buy Inverters Built to Last',
  brand_banner_link: '/products/inverters',
  brand_banner_image: 'https://central.prag.global/wp-content/uploads/2026/04/f80b14a4d9e3fc153ae2e60c3d8d11a58ebe33fe.png',
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
