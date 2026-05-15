import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function isAuthorized(secret: string | null) {
  const configured = process.env.REVALIDATE_SECRET || process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
  if (!configured) return secret === 'dev-secret';
  return secret === configured;
}

/**
 * On-demand revalidation endpoint for cache invalidation.
 * Called by admin when settings are updated to immediately refresh cached pages.
 *
 * Usage: POST /api/revalidate with { secret: "your-secret", path: "/" }
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Use a secret to prevent abuse
  if (!isAuthorized(secret)) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const paths = Array.isArray(body?.paths) ? body.paths : [body?.path || '/'];
    const tags = Array.isArray(body?.tags)
      ? body.tags
      : ['wordpress-content', 'wc-products', 'wc-settings', 'wc-stores'];

    for (const path of paths) {
      if (typeof path === 'string' && path.startsWith('/')) {
        revalidatePath(path);
      }
    }

    for (const tag of tags) {
      if (typeof tag === 'string' && tag.trim()) {
        revalidateTag(tag.trim());
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to revalidate', revalidated: false },
      { status: 500 }
    );
  }
}
