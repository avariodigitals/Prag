import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const authData = await login(username, password);

    if (!authData || !authData.token) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    
    // Set the token in an HTTP-only cookie
    cookieStore.set('auth_token', authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Also set some non-sensitive user info in a cookie for the client to read
    cookieStore.set('user_info', JSON.stringify({
      email: authData.user_email,
      name: authData.user_display_name,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        email: authData.user_email,
        name: authData.user_display_name,
      }
    });
  } catch (error) {
    console.error('API login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
