import { NextResponse } from 'next/server';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ message: 'Email required' }, { status: 400 });

  // Use WP's built-in lost password endpoint
  const res = await fetch(`${WP_API}/prag-core/v1/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
