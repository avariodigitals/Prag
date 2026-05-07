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
  customHeadScripts: string;
  customBodyScripts: string;
  customFooterScripts: string;
}

interface EcommerceConfigResponse {
  allowed: boolean;
  domain: string;
  scripts: EcommerceTrackingScripts | null;
}

function adminBaseUrl() {
  return (
    process.env.ECOMMERCE_ADMIN_API_URL
    || process.env.NEXT_PUBLIC_ADMIN_API_URL
    || process.env.NEXT_PUBLIC_ADMIN_URL
    || ''
  ).trim();
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
    'https://prag-admin.vercel.app',
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

export async function getEcommerceScriptsForHost(host: string): Promise<EcommerceTrackingScripts | null> {
  const normalizedHost = normalizeHost(host);
  if (!normalizedHost) return null;

  const candidates = getAdminApiCandidates(normalizedHost);
  if (candidates.length === 0) return null;

  for (const base of candidates) {
    try {
    const res = await fetch(
      `${base.replace(/\/$/, '')}/api/ecommerce-config?host=${encodeURIComponent(normalizedHost)}`,
      { cache: 'no-store' },
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
