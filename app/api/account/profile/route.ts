import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WC = WP.replace('/wp-json', '/wp-json/wc/v3');

interface WpUserProfile {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_urls?: Record<string, string>;
  meta?: {
    prag_phone?: string;
    prag_avatar?: string;
  };
}

interface WooCustomerProfile {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  billing?: {
    phone?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

interface ProfilePayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  meta?: {
    prag_phone?: string;
    billing_address_1?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postcode?: string;
  };
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY ?? ''}&consumer_secret=${process.env.WC_CONSUMER_SECRET ?? ''}`;
}

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return String(data?.message ?? data?.error ?? fallback);
  } catch {
    try {
      const text = await res.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
}

async function fetchWpUser(token: string): Promise<WpUserProfile> {
  const res = await fetch(`${WP}/wp/v2/users/me?_fields=id,name,first_name,last_name,email,avatar_urls,meta`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, 'Failed to fetch profile'));
  }

  return await res.json();
}

async function fetchWooCustomer(userId: number, email: string): Promise<WooCustomerProfile | null> {
  if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) return null;

  if (Number.isFinite(userId) && userId > 0) {
    const direct = await fetch(`${WC}/customers/${userId}?${authQuery()}`, {
      cache: 'no-store',
    });
    if (direct.ok) {
      const customer = (await direct.json()) as WooCustomerProfile;
      if (customer?.id) return customer;
    }
  }

  if (!email) return null;

  const search = await fetch(`${WC}/customers?${authQuery()}&per_page=100&search=${encodeURIComponent(email)}`, {
    cache: 'no-store',
  });
  if (!search.ok) return null;

  const customers = (await search.json()) as WooCustomerProfile[];
  return customers.find((customer) => String(customer.email ?? '').trim().toLowerCase() === email.toLowerCase()) ?? null;
}

function mergeProfile(wpUser: WpUserProfile, wooCustomer: WooCustomerProfile | null) {
  return {
    id: wpUser.id,
    first_name: wpUser.first_name ?? wooCustomer?.first_name ?? '',
    last_name: wpUser.last_name ?? wooCustomer?.last_name ?? '',
    email: wpUser.email ?? wooCustomer?.email ?? '',
    meta: {
      prag_phone: wpUser.meta?.prag_phone ?? wooCustomer?.billing?.phone ?? '',
      prag_avatar: wpUser.meta?.prag_avatar ?? wooCustomer?.avatar_url ?? '',
      billing_address_1: wooCustomer?.billing?.address_1 ?? '',
      billing_city: wooCustomer?.billing?.city ?? '',
      billing_state: wooCustomer?.billing?.state ?? '',
      billing_postcode: wooCustomer?.billing?.postcode ?? '',
    },
    avatar_urls: wpUser.avatar_urls ?? {},
  };
}

async function loadProfile(token: string) {
  const wpUser = await fetchWpUser(token);
  const wooCustomer = await fetchWooCustomer(Number(wpUser.id), String(wpUser.email ?? '').trim());
  return mergeProfile(wpUser, wooCustomer);
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    return NextResponse.json(await loadProfile(session.token));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json()) as ProfilePayload;

  const wpPayload = {
    email: String(body.email ?? '').trim(),
    first_name: String(body.first_name ?? '').trim(),
    last_name: String(body.last_name ?? '').trim(),
    meta: {
      prag_phone: String(body.meta?.prag_phone ?? '').trim(),
      billing_address_1: String(body.meta?.billing_address_1 ?? '').trim(),
      billing_city: String(body.meta?.billing_city ?? '').trim(),
      billing_state: String(body.meta?.billing_state ?? '').trim(),
      billing_postcode: String(body.meta?.billing_postcode ?? '').trim(),
    },
  };

  const res = await fetch(`${WP}/wp/v2/users/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({
      email: wpPayload.email,
      first_name: wpPayload.first_name,
      last_name: wpPayload.last_name,
      meta: {
        prag_phone: wpPayload.meta.prag_phone,
      },
    }),
  });
  if (!res.ok) {
    const message = await readErrorMessage(res, 'Failed to update profile');
    return NextResponse.json({ error: message }, { status: res.status });
  }

  const updatedUser = (await res.json()) as WpUserProfile;

  // Mirror customer-facing fields into Woo customer data when the account exists there.
  if (process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET) {
    const wooCustomer = await fetchWooCustomer(Number(updatedUser?.id), wpPayload.email);
    if (wooCustomer?.id) {
      const customerRes = await fetch(`${WC}/customers/${wooCustomer.id}?${authQuery()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: wpPayload.email,
        first_name: wpPayload.first_name,
        last_name: wpPayload.last_name,
        billing: {
          email: wpPayload.email,
          first_name: wpPayload.first_name,
          last_name: wpPayload.last_name,
          phone: wpPayload.meta.prag_phone,
          address_1: wpPayload.meta.billing_address_1,
          city: wpPayload.meta.billing_city,
          state: wpPayload.meta.billing_state,
          postcode: wpPayload.meta.billing_postcode,
          country: 'NG',
        },
        shipping: {
          first_name: wpPayload.first_name,
          last_name: wpPayload.last_name,
          address_1: wpPayload.meta.billing_address_1,
          city: wpPayload.meta.billing_city,
          state: wpPayload.meta.billing_state,
          postcode: wpPayload.meta.billing_postcode,
          country: 'NG',
        },
      }),
      cache: 'no-store',
      });

      if (!customerRes.ok) {
        const message = await readErrorMessage(customerRes, 'Failed to update customer profile');
        return NextResponse.json({ error: message }, { status: customerRes.status });
      }
    }
  }

  const cookieStore = await cookies();
  cookieStore.set('user_info', JSON.stringify({
    email: updatedUser.email ?? wpPayload.email,
    user_display_name: [updatedUser.first_name ?? wpPayload.first_name, updatedUser.last_name ?? wpPayload.last_name]
      .filter(Boolean)
      .join(' ') || updatedUser.name || '',
  }), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  try {
    return NextResponse.json(await loadProfile(session.token));
  } catch {
    return NextResponse.json(mergeProfile(updatedUser, null));
  }
}
