import { unstable_cache } from 'next/cache';

export interface WhatsAppChatOption {
  label: string;
  subtitle: string;
  prefill: string;
  number: string;
}

export interface EcommerceTrackingScripts {
  ecommerceDomain: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleVerification: string;
  metaPixelId: string;
  tiktokPixelId: string;
  whatsappChatEnabled: boolean;
  whatsappChatNumber: string;
  whatsappChatText: string;
  whatsappChatOptions: WhatsAppChatOption[];
  customHeadScripts: string;
  customBodyScripts: string;
  customFooterScripts: string;
  /** Zoho SalesIQ widget code hash; rendered as the two-tag embed on the storefront. */
  zohoSalesIqCode: string;
}

interface EcommerceConfigResponse {
  allowed: boolean;
  domain: string;
  scripts: EcommerceTrackingScripts | null;
}

function normalizeHost(host: string) {
  const trimmed = host.trim().toLowerCase();
  if (!trimmed) return '';

  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  const hostWithPath = withoutProtocol.replace(/\/.*$/, '');
  const hostWithoutPort = hostWithPath.replace(/:\d+$/, '');
  return hostWithoutPort.replace(/^www\./, '');
}

function toOrigin(input: string) {
  const raw = input.trim();
  if (!raw) return '';

  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return '';
    }
  }
}

function getAdminApiCandidates(host: string) {
  const envCandidates = [
    process.env.ECOMMERCE_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_URL,
    'https://portal.prag.global',
  ]
    .map((value) => toOrigin(value ?? ''))
    .filter(Boolean);

  const normalizedHost = normalizeHost(host);
  const hostParts = normalizedHost.split('.').filter(Boolean);
  const inferred: string[] = [];

  if (hostParts.length >= 2) {
    const rootDomain = hostParts.slice(-2).join('.');
    inferred.push(`https://admin.${rootDomain}`);
  }

  if (normalizedHost) {
    inferred.push(`https://admin.${normalizedHost}`);
  }

  return Array.from(new Set([...envCandidates, ...inferred]));
}

// How long a resolved per-host config is reused before refetching the admin
// API. This fetch sits on the critical path of every page render (root layout)
// and the /api/tracking endpoint, so it must be cached — an uncached call here
// adds ~1s+ to TTFB for every request.
const ECOMMERCE_CONFIG_REVALIDATE_SECONDS = 300;
// Hard ceiling so a hung/slow admin host can never stall a page render.
const ECOMMERCE_CONFIG_TIMEOUT_MS = 3000;

async function fetchEcommerceScriptsForHost(normalizedHost: string): Promise<EcommerceTrackingScripts | null> {
  const candidates = getAdminApiCandidates(normalizedHost);
  if (candidates.length === 0) return null;

  for (const base of candidates) {
    try {
      const res = await fetch(
        `${base.replace(/\/$/, '')}/api/ecommerce-config?host=${encodeURIComponent(normalizedHost)}`,
        { cache: 'no-store', signal: AbortSignal.timeout(ECOMMERCE_CONFIG_TIMEOUT_MS) },
      );

      if (!res.ok) continue;
      const data = (await res.json()) as EcommerceConfigResponse;
      if (!data.allowed || !data.scripts) continue;
      return data.scripts;
    } catch {
      continue;
    }
  }

  return null;
}

const getEcommerceScriptsCached = unstable_cache(
  fetchEcommerceScriptsForHost,
  ['ecommerce-config'],
  { revalidate: ECOMMERCE_CONFIG_REVALIDATE_SECONDS, tags: ['ecommerce-config'] },
);

export async function getEcommerceScriptsForHost(host: string): Promise<EcommerceTrackingScripts | null> {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost) return null;

  try {
    return await getEcommerceScriptsCached(normalizedHost);
  } catch {
    return null;
  }
}
