import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.delete('auth_token');
  cookieStore.delete('user_info');

  return NextResponse.json({ success: true });
}
