import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${WP}/wp/v2/users/me?_fields=id,name,first_name,last_name,email,avatar_urls,meta`, {
    headers: { Authorization: `Bearer ${session.token}` },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch profile' }, { status: res.status });
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const res = await fetch(`${WP}/wp/v2/users/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed to update profile' }, { status: res.status });
  return NextResponse.json(await res.json());
}
