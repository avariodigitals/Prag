import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WC = WP.replace('/wp-json', '/wp-json/wc/v3');

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

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${WP}/wp/v2/users/me?_fields=id,name,first_name,last_name,email,avatar_urls,meta`, {
    headers: { Authorization: `Bearer ${session.token}` },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch profile' }, { status: res.status });
  return NextResponse.json(await res.json());
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
    body: JSON.stringify(wpPayload),
  });
  if (!res.ok) {
    const message = await readErrorMessage(res, 'Failed to update profile');
    return NextResponse.json({ error: message }, { status: res.status });
  }

  const updatedUser = await res.json();

  // Mirror customer-facing fields into Woo customer data when the account exists there.
  if (process.env.WC_CONSUMER_KEY && process.env.WC_CONSUMER_SECRET && Number.isFinite(Number(updatedUser?.id))) {
    await fetch(`${WC}/customers/${updatedUser.id}?${authQuery()}`, {
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
    }).catch(() => {});
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

  return NextResponse.json(updatedUser);
}
