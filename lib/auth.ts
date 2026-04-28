import { cookies } from 'next/headers';

export interface AuthToken {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';

export async function login(username: string, password: string): Promise<AuthToken | null> {
  try {
    const res = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${WP_API_URL}/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const userInfo = cookieStore.get('user_info')?.value;

  if (!token) return null;

  return {
    token,
    user: userInfo ? JSON.parse(userInfo) : null,
  };
}
