import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';
import { getPosts } from '@/lib/woocommerce';

const SHOP_FALLBACK_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.prag.global';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

function normalizeBaseUrl(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed) return 'https://shop.prag.global';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteBase = await resolveSiteBaseUrl();

  // Shop sitemap advertises genuinely shop-indexable URLs.
  // Excluded (canonicalise to www.prag.global): products, product categories,
  // and corporate/content duplicates (about, contact, resources,
  // faq, distributor, shipping-policy, return-policy, privacy, terms-of-use).
  // Excluded (noindex): transactional URLs (cart, checkout, account, wishlist,
  // compare, search, order-received, order-failed, login, register).
  // Excluded (redirect, no canonical rendered): /solar, /stabilizer, /batteries,
  // /inverter shortcut routes.
  // Excluded (noindex utility page): /sitemap HTML page is noindex,follow and
  // not intended as a search result, so it is not advertised in the XML sitemap.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteBase}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${siteBase}/stores`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteBase}/knowledge-center`, changeFrequency: 'daily', priority: 0.8 },
  ];

  // Include knowledge center articles
  try {
    const { posts } = await getPosts({ per_page: 100 });
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteBase}/knowledge-center/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
