import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Lightweight session probe used by the client shell (TopBar) so the root
// layout does not need to read cookies() — which would force every page into
// dynamic rendering and prevent CDN caching of the HTML.
export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    { user: session?.user ?? null },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
