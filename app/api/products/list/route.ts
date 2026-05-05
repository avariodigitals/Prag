import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') ?? undefined;
  const min_price = searchParams.get('min_price') ?? undefined;
  const max_price = searchParams.get('max_price') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;
  const sort = searchParams.get('sort') ?? '';
  const page = Number(searchParams.get('page') ?? 2);
  const per_page = Number(searchParams.get('per_page') ?? 16);

  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;

  const { products, total } = await getProducts({
    category,
    min_price,
    max_price,
    tag,
    orderby,
    order,
    page,
    per_page,
  });

  const hasMore = page * per_page < total;

  return NextResponse.json(
    { products, hasMore },
    {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    }
  );
}
