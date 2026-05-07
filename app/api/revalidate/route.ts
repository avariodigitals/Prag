import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint for cache invalidation.
 * Called by admin when settings are updated to immediately refresh cached pages.
 *
 * Usage: POST /api/revalidate with { secret: "your-secret", path: "/" }
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Use a secret to prevent abuse
  if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET && secret !== 'dev-secret') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { path = '/' } = body;

    // Revalidate the specific path (e.g., '/' for homepage)
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate', revalidated: false },
      { status: 500 }
    );
  }
}
