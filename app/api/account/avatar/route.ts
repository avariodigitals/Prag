import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to WP media library
  const uploadRes = await fetch(`${WP}/wp/v2/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Type': file.type,
    },
    body: buffer,
  });

  if (!uploadRes.ok) return NextResponse.json({ error: 'Upload failed' }, { status: uploadRes.status });
  const media = await uploadRes.json();
  const avatarUrl = media.source_url;

  // Save avatar URL to user meta
  await fetch(`${WP}/wp/v2/users/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({ meta: { prag_avatar: avatarUrl } }),
  });

  return NextResponse.json({ url: avatarUrl });
}
