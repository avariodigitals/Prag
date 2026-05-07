import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WC = process.env.NEXT_PUBLIC_WP_API_URL?.replace('/wp-json', '/wp-json/wc/v3') ?? 'https://central.prag.global/wp-json/wc/v3';
const AUTH = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

interface SessionUser {
  id: number;
  email: string;
}

interface WooCustomer {
  id: number;
  email?: string;
}

interface WooOrder {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  line_items: Array<{ id: number; name: string; quantity: number; total: string }>;
  shipping: { address_1?: string; city?: string; state?: string };
  billing?: {
    email?: string;
  };
}

async function fetchOrdersPage(page: number): Promise<{ orders: WooOrder[]; totalPages: number }> {
  const res = await fetch(`${WC}/orders?${AUTH}&status=any&per_page=100&page=${page}&orderby=date&order=desc`, {
    cache: 'no-store',
  });

  if (!res.ok) return { orders: [], totalPages: 0 };
  const data = await res.json();
  const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? '1');
  return {
    orders: Array.isArray(data) ? (data as WooOrder[]) : [],
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  };
}

async function fetchOrdersByCustomerId(customerId: number): Promise<WooOrder[]> {
  if (!Number.isFinite(customerId) || customerId <= 0) return [];

  const res = await fetch(`${WC}/orders?${AUTH}&status=any&customer=${customerId}&per_page=100&orderby=date&order=desc`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? (data as WooOrder[]) : [];
}

async function fetchWooCustomersByEmail(email: string): Promise<WooCustomer[]> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return [];

  const res = await fetch(`${WC}/customers?${AUTH}&per_page=100&search=${encodeURIComponent(email)}`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return (data as WooCustomer[]).filter((customer) => String(customer.email ?? '').trim().toLowerCase() === normalizedEmail);
}

async function fetchOrdersByEmail(email: string): Promise<WooOrder[]> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return [];

  const firstPage = await fetchOrdersPage(1);
  if (firstPage.orders.length === 0) return [];

  const maxPages = Math.min(firstPage.totalPages, 25);
  const rest = maxPages > 1
    ? await Promise.all(Array.from({ length: maxPages - 1 }, (_, index) => fetchOrdersPage(index + 2)))
    : [];

  return [firstPage, ...rest]
    .flatMap((page) => page.orders)
    .filter((order) => String(order.billing?.email ?? '').trim().toLowerCase() === normalizedEmail);
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
    const customerMatches = email ? await fetchWooCustomersByEmail(email) : [];
    const customerOrders = await Promise.all(customerMatches.map((customer) => fetchOrdersByCustomerId(customer.id)));

    const merged = new Map<number, WooOrder>();
    for (const order of [...customerOrders.flat(), ...(email ? await fetchOrdersByEmail(email) : [])]) {
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
