import { unstable_cache } from 'next/cache';

// ─── Types (mirror Prag-Admin B2CPageRecord/B2CPageSection) ──────────────────

export interface B2CPageSection {
  id: string;
  title: string;
  type: string;
  visible: boolean;
  summary: string;
  content?: string;
  kicker?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  mobileImageUrl?: string;
}

export interface B2CPageRecord {
  route: string;
  title: string;
  description: string;
  published: boolean;
  updatedAt: string;
  sections: B2CPageSection[];
}

export interface B2CPublicContent {
  pages: B2CPageRecord[];
  updatedAt: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const B2C_CONTENT_REVALIDATE_SECONDS = 60;

function resolveAdminApiUrl(): string | null {
  const candidates = [
    process.env.ECOMMERCE_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_URL,
    'https://portal.prag.global',
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

function resolveWordPressApiUrl(): string | null {
  const candidate = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!candidate || !candidate.trim()) return null;
  return candidate.replace(/\/$/, '');
}

function buildWordPressAuthHeader(): Record<string, string> {
  const user = process.env.WP_APP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!user || !password) return {};
  const encoded = Buffer.from(`${user}:${password}`).toString('base64');
  return { Authorization: `Basic ${encoded}` };
}

// ─── Fetchers ────────────────────────────────────────────────────────────────

async function getB2CContentFromAdminPublicApi(baseUrl: string): Promise<B2CPublicContent | null> {
  try {
    const res = await fetch(`${baseUrl}/api/public/b2c-content`, {
      next: {
        revalidate: B2C_CONTENT_REVALIDATE_SECONDS,
        tags: ['b2c-public-content'],
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.pages)) return null;
    return { pages: data.pages, updatedAt: data.updatedAt ?? new Date().toISOString() };
  } catch {
    return null;
  }
}

async function getB2CContentFromWordPress(): Promise<B2CPublicContent | null> {
  const wpApiUrl = resolveWordPressApiUrl();
  if (!wpApiUrl) return null;

  try {
    const res = await fetch(`${wpApiUrl}/prag-core/v1/admin-config`, {
      next: { revalidate: B2C_CONTENT_REVALIDATE_SECONDS, tags: ['b2c-public-content'] },
      headers: { 'Content-Type': 'application/json', ...buildWordPressAuthHeader() },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok || res.status === 204) return null;

    const parsed = await res.json();
    const pages = Array.isArray(parsed.b2cPages) ? parsed.b2cPages : [];
    return { pages, updatedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}

async function getB2CPublicContentFresh(): Promise<B2CPublicContent | null> {
  // Try Prag-Admin public API first
  const baseUrl = resolveAdminApiUrl();
  if (baseUrl) {
    const adminContent = await getB2CContentFromAdminPublicApi(baseUrl);
    if (adminContent) return adminContent;
  }

  // Fall back to WordPress directly
  const wpContent = await getB2CContentFromWordPress();
  if (wpContent) return wpContent;

  return null;
}

const getB2CPublicContentCached = unstable_cache(
  async (): Promise<B2CPublicContent> => {
    const content = await getB2CPublicContentFresh();
    if (!content) {
      return { pages: [], updatedAt: new Date().toISOString() };
    }
    return content;
  },
  ['b2c-public-content'],
  { revalidate: B2C_CONTENT_REVALIDATE_SECONDS, tags: ['b2c-public-content'] },
);

export async function getB2CPublicContent(): Promise<B2CPublicContent | null> {
  if (process.env.NODE_ENV === 'development') {
    return getB2CPublicContentFresh();
  }
  try {
    return await getB2CPublicContentCached();
  } catch {
    return null;
  }
}

// ─── Helpers (same API as prag-b2b's b2bContent) ─────────────────────────────

export function findB2CPage(content: B2CPublicContent | null, route: string): B2CPageRecord | null {
  if (!content?.pages || !Array.isArray(content.pages)) return null;
  return content.pages.find((page) => page?.route === route && page.published) ?? null;
}

export function findVisibleSectionsByType(page: B2CPageRecord | null, type: string): B2CPageSection[] {
  if (!page?.sections || !Array.isArray(page.sections)) return [];
  return page.sections.filter((s) => s.type === type && s.visible !== false);
}

export function findFirstVisibleSectionByType(page: B2CPageRecord | null, type: string): B2CPageSection | null {
  return findVisibleSectionsByType(page, type)[0] ?? null;
}

/**
 * If the admin has added "content" sections to a page, convert them to
 * PolicyPageLayout-compatible sections (heading + body text). Returns null
 * if no content sections exist, so callers can fall back to hardcoded content.
 */
export function getAdminContentSections(page: B2CPageRecord | null): { heading: string; body: React.ReactNode }[] | null {
  const sections = findVisibleSectionsByType(page, 'content');
  if (sections.length === 0) return null;
  return sections.map((s) => ({
    heading: s.title,
    body: <p className="whitespace-pre-line">{s.content || s.summary}</p>,
  }));
}
