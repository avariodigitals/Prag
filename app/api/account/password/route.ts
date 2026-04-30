import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const WP = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Get user email first
  const userRes = await fetch(`${WP}/wp/v2/users/me?_fields=email`, {
    headers: { Authorization: `Bearer ${session.token}` },
    cache: 'no-store',
  });
  if (!userRes.ok) return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  const { email } = await userRes.json();

  // Verify current password by re-authenticating
  const verifyRes = await fetch(`${WP}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password: currentPassword }),
  });
  if (!verifyRes.ok) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  // Update password via WP REST API
  const updateRes = await fetch(`${WP}/wp/v2/users/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!updateRes.ok) return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  return NextResponse.json({ success: true });
}
