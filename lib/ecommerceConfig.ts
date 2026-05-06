export interface EcommerceTrackingScripts {
  ecommerceDomain: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleVerification: string;
  metaPixelId: string;
  tiktokPixelId: string;
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
  return host.split(':')[0].toLowerCase();
}

export async function getEcommerceScriptsForHost(host: string): Promise<EcommerceTrackingScripts | null> {
  const base = adminBaseUrl();
  if (!base) return null;

  try {
    const normalizedHost = normalizeHost(host);
    const res = await fetch(
      `${base.replace(/\/$/, '')}/api/ecommerce-config?host=${encodeURIComponent(normalizedHost)}`,
      { cache: 'no-store' },
    );

    if (!res.ok) return null;
    const data = (await res.json()) as EcommerceConfigResponse;
    if (!data.allowed || !data.scripts) return null;
    return data.scripts;
  } catch {
    return null;
  }
}
