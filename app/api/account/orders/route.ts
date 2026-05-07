import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WC = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '/wp-json/wc/v3') ?? 'https://central.prag.global/wp-json/wc/v3';
const AUTH = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

interface SessionUser {
  id: number;
  email: string;
}

interface WooOrder {
  id: number;
  date_created: string;
}

async function fetchOrdersByQuery(query: string): Promise<WooOrder[]> {
  const res = await fetch(`${WC}/orders?${AUTH}&status=any&per_page=100&orderby=date&order=desc&${query}`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? (data as WooOrder[]) : [];
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ orders: [] }, { status: 401 });

  try {
    // Get WP user email to look up WC customer
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/users/me?_fields=id,email`,
      { headers: { Authorization: `Bearer ${session.token}` }, cache: 'no-store' }
    );
    if (!userRes.ok) return NextResponse.json({ orders: [] });
    const user = (await userRes.json()) as SessionUser;
    const email = String(user.email ?? '').trim();
    const userId = Number(user.id);

    // Woo stores account-linked orders by customer ID; guest/legacy orders are tied by billing_email.
    const [byCustomerId, byBillingEmail] = await Promise.all([
      Number.isFinite(userId) && userId > 0 ? fetchOrdersByQuery(`customer=${userId}`) : Promise.resolve([]),
      email ? fetchOrdersByQuery(`billing_email=${encodeURIComponent(email)}`) : Promise.resolve([]),
    ]);

    const merged = new Map<number, WooOrder>();
    for (const order of [...byCustomerId, ...byBillingEmail]) {
      merged.set(order.id, order);
    }

    const orders = Array.from(merged.values()).sort(
      (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
    );

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
