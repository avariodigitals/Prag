import { NextRequest, NextResponse } from 'next/server';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';

export async function GET(req: NextRequest) {
  const host = req.nextUrl.searchParams.get('host') ?? '';
  const scripts = await getEcommerceScriptsForHost(host);
  return NextResponse.json(scripts ?? {}, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
  });
}
