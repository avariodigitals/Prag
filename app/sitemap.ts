import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';

type WcProductLite = {
  slug: string;
  categories?: Array<{ slug?: string }>;
  date_modified?: string;
};

type WcCategoryLite = {
  slug: string;
  count?: number;
  date_modified?: string;
};

type WpPostLite = {
  slug: string;
  modified?: string;
};

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const SHOP_FALLBACK_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://prag.global';

export const dynamic = 'force-dynamic';

function normalizeBaseUrl(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed) return 'https://prag.global';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY ?? ''}&consumer_secret=${process.env.WC_CONSUMER_SECRET ?? ''}`;
}

async function resolveSiteBaseUrl(): Promise<string> {
  try {
    const headerStore = await headers();
    const host = (headerStore.get('x-forwarded-host') || headerStore.get('host') || '').split(':')[0];
    if (host) {
      const scripts = await getEcommerceScriptsForHost(host);
      if (scripts?.ecommerceDomain) {
        return normalizeBaseUrl(scripts.ecommerceDomain);
      }
      return normalizeBaseUrl(host);
    }
  } catch {
    // Fall through to env fallback.
  }

  return normalizeBaseUrl(SHOP_FALLBACK_URL);
}

async function fetchJson(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function fetchAllProductsForSitemap(): Promise<WcProductLite[]> {
  const base = `${WP_API_URL.replace('/wp-json', '/wp-json/wc/v3')}/products`;
  const first = await fetchJson(`${base}?per_page=100&page=1&status=publish&_fields=slug,categories,date_modified&${authQuery()}`);
  if (!first?.ok) return [];

  const firstData = (await first.json()) as WcProductLite[];
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');

  if (totalPages <= 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((page) =>
      fetchJson(`${base}?per_page=100&page=${page}&status=publish&_fields=slug,categories,date_modified&${authQuery()}`)
    )
  );

  const restData = await Promise.all(
    rest.map(async (res) => (res?.ok ? ((await res.json()) as WcProductLite[]) : []))
  );

  return [...firstData, ...restData.flat()];
}

async function fetchAllCategoriesForSitemap(): Promise<WcCategoryLite[]> {
  const url = `${WP_API_URL.replace('/wp-json', '/wp-json/wc/v3')}/products/categories?per_page=100&hide_empty=true&_fields=slug,count,date_modified&${authQuery()}`;
  const res = await fetchJson(url);
  if (!res?.ok) return [];
  return (await res.json()) as WcCategoryLite[];
}

async function fetchAllKnowledgePostsForSitemap(): Promise<WpPostLite[]> {
  const base = `${WP_API_URL.replace('/wp-json', '/wp-json/wp/v2')}/posts`;
  const first = await fetchJson(`${base}?per_page=100&page=1&status=publish&_fields=slug,modified`);
  if (!first?.ok) return [];

  const firstData = (await first.json()) as WpPostLite[];
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? '1');

  if (totalPages <= 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, idx) => idx + 2).map((page) =>
      fetchJson(`${base}?per_page=100&page=${page}&status=publish&_fields=slug,modified`)
    )
  );

  const restData = await Promise.all(
    rest.map(async (res) => (res?.ok ? ((await res.json()) as WpPostLite[]) : []))
  );

  return [...firstData, ...restData.flat()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteBase = await resolveSiteBaseUrl();

  const [products, categories, posts] = await Promise.all([
    fetchAllProductsForSitemap(),
    fetchAllCategoriesForSitemap(),
    fetchAllKnowledgePostsForSitemap(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteBase}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${siteBase}/products`, changeFrequency: 'daily', priority: 0.95 },
    { url: `${siteBase}/stores`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteBase}/knowledge-center`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteBase}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteBase}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteBase}/resources`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteBase}/shipping-policy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteBase}/return-policy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteBase}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteBase}/terms-of-use`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteBase}/sitemap`, changeFrequency: 'monthly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category) => Boolean(category.slug))
    .map((category) => ({
      url: `${siteBase}/products/${category.slug}`,
      lastModified: category.date_modified ? new Date(category.date_modified) : undefined,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => Boolean(product.slug))
    .map((product) => {
      const categorySlug = product.categories?.[0]?.slug;
      const productPath = categorySlug
        ? `/products/${categorySlug}/${product.slug}`
        : `/products/${product.slug}`;

      return {
        url: `${siteBase}${productPath}`,
        lastModified: product.date_modified ? new Date(product.date_modified) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      };
    });

  const knowledgeRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${siteBase}/knowledge-center/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : undefined,
      changeFrequency: 'weekly',
      priority: 0.65,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...knowledgeRoutes];
}
