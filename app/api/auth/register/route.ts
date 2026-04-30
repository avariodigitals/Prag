import { NextResponse } from 'next/server';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

export async function POST(req: Request) {
  const { first_name, last_name, email, phone, password } = await req.json();

  if (!first_name || !last_name || !email || !password) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  // Use email as username (WP accepts email as username)
  const res = await fetch(`${WP_API}/prag-core/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, email, password, first_name, last_name, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || data?.data?.message || 'Registration failed.' },
      { status: res.status }
    );
  }

  // Immediately send OTP to verify email
  await fetch(`${WP_API}/prag-core/v1/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return NextResponse.json({ success: true });
}
