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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(`${baseUrl()}${path}${path.includes('?') ? '&' : '?'}${authParams()}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
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

const PRODUCT_LIST_FIELDS = 'id,name,slug,price,regular_price,sale_price,images,categories,on_sale,stock_status';
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
  // Resolve category slug to ID for accurate WooCommerce filtering
  let categoryId: string | undefined = category_id ? String(category_id) : undefined;
  if (!categoryId && category) {
    const cats = await wcFetch<{ id: number }[]>(`/products/categories?slug=${category}`, []);
    categoryId = cats[0]?.id ? String(cats[0].id) : category;
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
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      `${baseUrl()}/products?${qs}&${authParams()}`,
      { next: { revalidate: 60 }, signal: controller.signal }
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

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await wcFetch<Category[]>(`/products/categories?slug=${slug}&_fields=${CATEGORY_FIELDS}`, []);
  return cats[0] ?? null;
}

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

export async function getSubcategoriesByParentId(parentId: number): Promise<Category[]> {
  return wcFetch<Category[]>(`/products/categories?parent=${parentId}&per_page=20&_fields=${CATEGORY_FIELDS}`, []);
}

// WordPress REST API base (without /wc/v3)
function wpBase() {
  return baseUrl().replace('/wp-json/wc/v3', '/wp-json/wp/v2');
}

async function wpFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(`${wpBase()}${path}`, { 
      next: { revalidate: 60 },
      signal: controller.signal,
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

export function productUrl(product: Pick<Product, 'slug' | 'categories'>) {
  const categorySlug = product.categories[0]?.slug ?? 'products';
  return `/products/${categorySlug}/${product.slug}`;
}

export function formatPrice(price: string) {
  return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}
