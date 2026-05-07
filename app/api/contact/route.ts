import { NextResponse } from 'next/server';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ message: 'Name, email and message are required.' }, { status: 400 });
  }

  const res = await fetch(`${WP_API}/prag-core/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || 'Failed to send message. Please try again.' },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
