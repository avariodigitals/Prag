import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WC = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '/wp-json/wc/v3') ?? 'https://central.prag.global/wp-json/wc/v3';
const AUTH = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

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
    const { email } = await userRes.json();

    // Fetch WC orders by customer email
    const ordersRes = await fetch(
      `${WC}/orders?${AUTH}&customer=${encodeURIComponent(email)}&per_page=50&orderby=date&order=desc`,
      { cache: 'no-store' }
    );
    if (!ordersRes.ok) return NextResponse.json({ orders: [] });
    const orders = await ordersRes.json();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
