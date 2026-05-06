import { NextRequest, NextResponse } from 'next/server';

interface CheckoutOrderRequest {
  payment_method?: string;
  shipping_method?: string;
  shipping_method_title?: string;
  shipping_note?: string;
  line_items?: Array<{ product_id: number; quantity: number }>;
  billing?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    note?: string;
  };
}

interface WooOrderResponse {
  id: number;
  date_created: string;
}

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckoutOrderRequest;

    if (!body.payment_method) {
      return NextResponse.json({ error: 'Missing payment method' }, { status: 400 });
    }

    if (!body.line_items || body.line_items.length === 0) {
      return NextResponse.json({ error: 'No order items found' }, { status: 400 });
    }

    const lineItems = body.line_items
      .map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      }))
      .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0 && Number.isFinite(item.quantity) && item.quantity > 0);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
    }

    const billing = body.billing ?? {};

    const payload = {
      payment_method: body.payment_method,
      set_paid: false,
      billing: {
        first_name: billing.firstName ?? '',
        last_name: billing.lastName ?? '',
        company: billing.company ?? '',
        address_1: billing.address ?? '',
        city: billing.city ?? '',
        state: billing.state ?? '',
        postcode: billing.zip ?? '',
        country: 'NG',
        email: billing.email ?? '',
        phone: billing.phone ?? '',
      },
      shipping: {
        first_name: billing.firstName ?? '',
        last_name: billing.lastName ?? '',
        company: billing.company ?? '',
        address_1: billing.address ?? '',
        city: billing.city ?? '',
        state: billing.state ?? '',
        postcode: billing.zip ?? '',
        country: 'NG',
      },
      line_items: lineItems,
      shipping_lines: body.shipping_method
        ? [{
            method_id: body.shipping_method,
            method_title: body.shipping_method_title ?? body.shipping_method,
            total: '0',
          }]
        : [],
      customer_note: [billing.note, body.shipping_note].filter(Boolean).join(' | '),
    };

    const res = await fetch(`${wcBase()}/orders?${authQuery()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Woo order create failed: ${errorText}` }, { status: res.status });
    }

    const order = await res.json() as WooOrderResponse;
    return NextResponse.json({
      orderId: order.id,
      orderDate: order.date_created,
    });
  } catch {
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  }
}
