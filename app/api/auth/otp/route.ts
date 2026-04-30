import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: Request) {
  const { email, code, password } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ message: 'Email and code are required.' }, { status: 400 });
  }

  // Verify OTP
  const verifyRes = await fetch(`${WP_API}/prag-core/v1/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  const verifyData = await verifyRes.json();

  if (!verifyRes.ok) {
    return NextResponse.json(
      { message: verifyData?.message || 'Invalid or expired code.' },
      { status: verifyRes.status }
    );
  }

  // Auto-login after verification
  const loginRes = await fetch(`${WP_API}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  if (!loginRes.ok) {
    // Verified but couldn't auto-login — just return success, user can log in manually
    return NextResponse.json({ success: true, autoLogin: false });
  }

  const authData = await loginRes.json();
  const cookieStore = await cookies();

  cookieStore.set('auth_token', authData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  cookieStore.set('user_info', JSON.stringify({
    email: authData.user_email,
    user_display_name: authData.user_display_name,
  }), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.json({ success: true, autoLogin: true });
}
