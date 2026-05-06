import { NextRequest, NextResponse } from 'next/server';

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string;
    amount: number;
    currency: string;
    reference: string;
    customer?: { email: string };
  };
}

interface VerifyRequest {
  reference: string;
  order_id: number;
}

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

function authQuery() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY ?? ''}&consumer_secret=${process.env.WC_CONSUMER_SECRET ?? ''}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
      return NextResponse.json({ error: 'Verification is not configured: missing WooCommerce API keys' }, { status: 500 });
    }

    const body = await req.json() as VerifyRequest;
    const { reference, order_id } = body;

    if (!reference || !order_id) {
      return NextResponse.json({ error: 'Missing reference or order_id' }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: 'Payment verification not configured' }, { status: 500 });
    }

    // Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Paystack verification request failed' }, { status: 502 });
    }

    const verifyData = await verifyRes.json() as PaystackVerifyResponse;

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful', paystackStatus: verifyData.data?.status }, { status: 402 });
    }

    // Mark WooCommerce order as processing
    const updateRes = await fetch(`${wcBase()}/orders/${order_id}?${authQuery()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'processing',
        set_paid: true,
        transaction_id: reference,
      }),
      cache: 'no-store',
    });

    if (!updateRes.ok) {
      // Payment succeeded but order update failed — log and still return success
      // so the user is not shown an error for a completed payment
      console.error('WC order update failed after successful Paystack payment', order_id, reference);
    }

    return NextResponse.json({ success: true, reference, order_id });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
