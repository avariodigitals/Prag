import type { Product, Category, Tag, Store } from './types';

function authParams() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  // Ensure we use the /wc/v3 namespace for WooCommerce REST API
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${baseUrl()}${path}${path.includes('?') ? '&' : '?'}${authParams()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return wcFetch<Product[]>('/products?featured=true&per_page=6&status=publish', []);
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  return wcFetch<Product[]>('/products?on_sale=true&per_page=4&status=publish', []);
}

export async function getCategories(): Promise<Category[]> {
  return wcFetch<Category[]>('/products/categories?per_page=10&hide_empty=true', []);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await wcFetch<Product[]>(`/products?slug=${slug}`, []);
  return products[0] ?? null;
}

export interface ProductsResult {
  products: Product[];
  total: number;
}

export async function getProducts({
  category,
  min_price,
  max_price,
  tag,
  orderby,
  page = 1,
  per_page = 9,
}: {
  category?: string;
  min_price?: string;
  max_price?: string;
  tag?: string;
  orderby?: string;
  page?: number;
  per_page?: number;
}): Promise<ProductsResult> {
  const qs = new URLSearchParams({
    status: 'publish',
    per_page: String(per_page),
    page: String(page),
    ...(category && { category }),
    ...(min_price && { min_price }),
    ...(max_price && { max_price }),
    ...(tag && { tag }),
    ...(orderby && { orderby }),
  });
  try {
    const res = await fetch(
      `${baseUrl()}/products?${qs}&${authParams()}`,
      { next: { revalidate: 60 } }
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

export async function getProductTags(): Promise<Tag[]> {
  return wcFetch<Tag[]>('/products/tags?per_page=20&hide_empty=true', []);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await wcFetch<Category[]>(`/products/categories?slug=${slug}`, []);
  return cats[0] ?? null;
}

export async function searchProducts(query: string, orderby?: string, page = 1, per_page = 9): Promise<ProductsResult> {
  const qs = new URLSearchParams({
    search: query,
    status: 'publish',
    per_page: String(per_page),
    page: String(page),
    ...(orderby && { orderby }),
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

// WordPress REST API base (without /wc/v3)
function wpBase() {
  return baseUrl().replace('/wp-json/wc/v3', '/wp-json/wp/v2');
}

async function wpFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${wpBase()}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text.startsWith('{') && !text.startsWith('[')) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

// Stores are managed as a custom post type 'prag_store' with ACF fields
export async function getStores(): Promise<Store[]> {
  return wpFetch<Store[]>('/prag_store?per_page=20&_fields=id,name,acf', []);
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
  const path = productId
    ? `/prag_document?per_page=20&meta_key=product_id&meta_value=${productId}&_fields=id,title,acf`
    : '/prag_document?per_page=20&_fields=id,title,acf';
  return wpFetch<TechDocument[]>(path, []);
}

export function shopUrl(slug: string) {
  return `${process.env.NEXT_PUBLIC_SHOP_URL}/product/${slug}`;
}

export function formatPrice(price: string) {
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}
