import { NextRequest, NextResponse } from 'next/server';

function wcBase() {
  const url = process.env.NEXT_PUBLIC_WP_API_URL ?? '';
  return url.replace('/wp-json', '/wp-json/wc/v3');
}

function authParams() {
  return `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
}

export async function GET(req: NextRequest) {
  const productId = Number(req.nextUrl.searchParams.get('productId') ?? 0);
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${wcBase()}/products/reviews?product=${productId}&per_page=20&status=approved&${authParams()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return NextResponse.json({ reviews: [] });
    const text = await res.text();
    if (!text.startsWith('[')) return NextResponse.json({ reviews: [] });
    return NextResponse.json({ reviews: JSON.parse(text) });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = Number(body?.productId ?? 0);
    const reviewer = String(body?.reviewer ?? '').trim();
    const reviewerEmail = String(body?.reviewer_email ?? '').trim();
    const review = String(body?.review ?? '').trim();
    const rating = Number(body?.rating ?? 0);

    if (!productId || !reviewer || !reviewerEmail || !review || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
    }

    const res = await fetch(`${wcBase()}/products/reviews?${authParams()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        reviewer,
        reviewer_email: reviewerEmail,
        review,
        rating,
      }),
    });

    const text = await res.text();
    const payload = text && (text.startsWith('{') || text.startsWith('[')) ? JSON.parse(text) : {};

    if (!res.ok) {
      return NextResponse.json(
        { error: payload?.message ?? 'Unable to submit review' },
        { status: res.status }
      );
    }

    return NextResponse.json({ review: payload }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to submit review' }, { status: 500 });
  }
}
