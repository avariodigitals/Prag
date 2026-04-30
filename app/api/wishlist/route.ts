import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value ?? null;
}

export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ items: [] }, { status: 401 });

  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/users/me?_fields=meta`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (!res.ok) return NextResponse.json({ items: [] });
    const data = await res.json();
    const raw = data?.meta?.prag_wishlist ?? '[]';
    const items = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const { items } = await req.json();

  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/users/me`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meta: { prag_wishlist: JSON.stringify(items) } }),
    });
    return NextResponse.json({ success: res.ok });
  } catch {
    return NextResponse.json({ success: false });
  }
}
