import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  // Validate file type and size (max 2MB)
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`;

  // Store base64 directly in user meta — no upload_files capability needed
  const res = await fetch(`${WP}/wp/v2/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
      'Connection': 'keep-alive',
    },
    body: JSON.stringify({ meta: { prag_avatar: base64 } }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Avatar save failed:', err);
    return NextResponse.json({ error: 'Failed to save avatar' }, { status: res.status });
  }

  return NextResponse.json({ url: base64 });
}
