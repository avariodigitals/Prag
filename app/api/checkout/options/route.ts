import { NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL ?? '';

interface WooPaymentGateway {
  id: string;
  title?: string;
  description?: string;
  enabled?: boolean;
}

interface WooZone {
  id: number;
  name?: string;
}

interface WooZoneMethod {
  method_id: string;
  instance_id?: number;
  title?: string;
  enabled?: boolean;
  settings?: {
    title?: { value?: string };
  };
  method_title?: string;
}

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

async function wcFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${wcBase()}${path}${path.includes('?') ? '&' : '?'}${authQuery()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return fallback;
    return await res.json() as T;
  } catch {
    return fallback;
  }
}

export async function GET() {
  const paymentGateways = await wcFetch<WooPaymentGateway[]>('/payment_gateways', []);
  const paymentMethods = paymentGateways
    .filter((gateway) => Boolean(gateway.enabled))
    .map((gateway) => ({
      id: gateway.id,
      title: gateway.title ?? gateway.id,
      description: gateway.description ?? '',
    }));

  const zones = await wcFetch<WooZone[]>('/shipping/zones', []);
  const methodsByZone = await Promise.all([
    wcFetch<WooZoneMethod[]>('/shipping/zones/0/methods', []),
    ...zones.map((zone) => wcFetch<WooZoneMethod[]>(`/shipping/zones/${zone.id}/methods`, [])),
  ]);

  const deduped = new Map<string, { id: string; method_id: string; title: string; description: string }>();
  for (const methods of methodsByZone) {
    for (const method of methods) {
      if (!method.enabled) continue;
      const instanceId = method.instance_id ?? 0;
      const key = `${method.method_id}:${instanceId}`;
      if (deduped.has(key)) continue;

      const title = method.settings?.title?.value || method.title || method.method_title || method.method_id;
      deduped.set(key, {
        id: key,
        method_id: method.method_id,
        title,
        description: '',
      });
    }
  }

  const shippingMethods = Array.from(deduped.values());

  // Fetch Paystack public key from WP settings
  let paystackPublicKey = '';
  try {
    const settingsRes = await fetch(`${WP_API_URL}/prag-core/v1/settings`, { cache: 'no-store' });
    if (settingsRes.ok) {
      const settings = await settingsRes.json() as { paystack_public_key?: string };
      paystackPublicKey = settings.paystack_public_key ?? '';
    }
  } catch { /* ignore */ }

  return NextResponse.json({
    paymentMethods,
    shippingMethods,
    paystackPublicKey,
  });
}
