import { NextRequest, NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';

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
    requires?: { value?: string };
  };
  method_title?: string;
}

interface ShippingCity {
  id: number;
  state: string;
  city: string;
  price: number;
  status: 'active' | 'suspended';
}

interface ShippingMethodToggles {
  local_pickup: boolean;
  custom_delivery: boolean;
  city_based: boolean;
}

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';
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

function normalizeText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerState = normalizeText(searchParams.get('state') ?? '');
  const customerCity = normalizeText(searchParams.get('city') ?? '');

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

  const deduped = new Map<string, { id: string; method_id: string; title: string; description: string; freeShippingRequires: string }>();
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
        freeShippingRequires: method.settings?.requires?.value ?? '',
      });
    }
  }

  let shippingMethods = Array.from(deduped.values());

  // Fetch Paystack public key + shipping descriptions from WP settings
  let paystackPublicKey = '';
  let localPickupDesc = '';
  let customDeliveryDesc = '';
  try {
    const settingsRes = await fetch(`${WP_API_URL}/prag-core/v1/settings`, { cache: 'no-store' });
    if (settingsRes.ok) {
      const settings = await settingsRes.json() as {
        paystack_public_key?: string;
        shipping_local_pickup_description?: string;
        shipping_custom_delivery_description?: string;
      };
      paystackPublicKey = settings.paystack_public_key ?? '';
      localPickupDesc = settings.shipping_local_pickup_description ?? '';
      customDeliveryDesc = settings.shipping_custom_delivery_description ?? '';
    }
  } catch { /* ignore */ }

  // Fetch admin shipping method toggles (master switches)
  let toggles: ShippingMethodToggles = { local_pickup: true, custom_delivery: true, city_based: true };
  try {
    const togglesRes = await fetch(`${WP_API_URL}/prag-core/v1/shipping/methods`, { cache: 'no-store' });
    if (togglesRes.ok) {
      toggles = await togglesRes.json() as ShippingMethodToggles;
    }
  } catch { /* ignore */ }

  // Apply admin-configured descriptions to shipping methods.
  // Only a free_shipping instance with a real requirement (min spend/coupon) is
  // treated as genuine free shipping — an unconditional one is repurposed as a
  // custom delivery method, so it gets the custom delivery description.
  for (const method of shippingMethods) {
    if (method.method_id === 'local_pickup') {
      method.description = localPickupDesc;
    } else if (method.method_id === 'free_shipping' && method.freeShippingRequires) {
      method.description = '';
    } else {
      method.description = customDeliveryDesc;
    }
  }

  // Filter by admin toggles (master switches override WooCommerce enabled flag)
  shippingMethods = shippingMethods.filter((method) => {
    if (method.method_id === 'local_pickup') return toggles.local_pickup;
    if (method.method_id === 'free_shipping' && method.freeShippingRequires) return toggles.local_pickup; // genuine free shipping follows pickup toggle
    return toggles.custom_delivery;
  });

  // Build city-based shipping option if the city matches an active, priced row
  let cityShippingOption: { id: string; method_id: string; title: string; description: string; price: number; city: string; state: string } | null = null;
  if (toggles.city_based && customerState && customerCity) {
    try {
      const citiesRes = await fetch(`${WP_API_URL}/prag-core/v1/shipping/cities`, { cache: 'no-store' });
      if (citiesRes.ok) {
        const cities = await citiesRes.json() as ShippingCity[];
        const match = cities.find(
          (c) =>
            c.status === 'active' &&
            c.price > 0 &&
            normalizeText(c.state) === customerState &&
            normalizeText(c.city) === customerCity
        );
        if (match) {
          cityShippingOption = {
            id: 'city_based',
            method_id: 'city_based',
            title: `Delivery to ${match.city}, ${match.state}`,
            description: `Flat-rate delivery to ${match.city}.`,
            price: match.price,
            city: match.city,
            state: match.state,
          };
        }
      }
    } catch { /* ignore */ }
  }

  const responseShippingMethods = shippingMethods.map((method) => ({
    id: method.id,
    method_id: method.method_id,
    title: method.title,
    description: method.description,
  }));

  if (cityShippingOption) {
    responseShippingMethods.push(cityShippingOption);
  }

  return NextResponse.json({
    paymentMethods,
    shippingMethods: responseShippingMethods,
    paystackPublicKey,
  });
}
