import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json({ products: [], hasMore: false, total: 0 });

  const sort = req.nextUrl.searchParams.get('sort') ?? undefined;
  const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
  const per_page = Number(req.nextUrl.searchParams.get('per_page') ?? 16);

  const result = await searchProducts(q, sort, page, per_page);
  const hasMore = page * per_page < result.total;

  return NextResponse.json({ ...result, hasMore });
}
