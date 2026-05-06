import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';

const SHOP_FALLBACK_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://prag.global';

function normalizeBaseUrl(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed) return 'https://prag.global';
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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteBase = await resolveSiteBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/account', '/wishlist', '/compare'],
    },
    sitemap: `${siteBase}/sitemap.xml`,
    host: siteBase,
  };
}
