import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ order_id?: string; failed?: string }>;
}

interface WooOrder {
  id: number;
  date_created: string;
  status: string;
}

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

async function getOrder(orderId: number): Promise<WooOrder | null> {
  try {
    const res = await fetch(`${wcBase()}/orders/${orderId}?${authQuery()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json() as WooOrder;
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export default async function CheckoutResultPage({ searchParams }: Props) {
  const sp = await searchParams;
  const orderId = Number(sp.order_id ?? 0);

  if (!Number.isFinite(orderId) || orderId <= 0) {
    redirect('/order-failed');
  }

  if (sp.failed === '1') {
    redirect(`/order-failed?order_id=${orderId}`);
  }

  const order = await getOrder(orderId);
  if (!order) {
    redirect(`/order-failed?order_id=${orderId}`);
  }

  if (order.status === 'failed' || order.status === 'cancelled' || order.status === 'refunded') {
    redirect(`/order-failed?order_id=${order.id}`);
  }

  const date = encodeURIComponent(new Date(order.date_created).toLocaleDateString('en-GB'));
  redirect(`/order-received?order_id=${order.id}&order_date=${date}`);
}
