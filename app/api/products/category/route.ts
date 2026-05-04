import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export const runtime = 'nodejs';

const KNOWN_CATEGORY_IDS: Record<string, number> = {
  'inverters': Number(process.env.WC_CAT_INVERTERS ?? 0),
  'solar': Number(process.env.WC_CAT_SOLAR ?? 0),
  'batteries': Number(process.env.WC_CAT_BATTERIES ?? 0),
  'voltage-stabilizers': 144,
  'thyristor-stabilizers': 266,
  'relay-voltage-stabilizers': 167,
  'servo-voltage-stabilizers': 168,
  'advanced-stabilizers': 178,
  'hybrid-inverters': 171,
  'heavy-duty-inverters': 165,
  'pure-sine-inverters': 203,
  'solar-panels': 169,
  'solar-charge-controllers': 170,
  'protective-device': 261,
  'tubular-batteries': 220,
  'lithium-battery': 240,
  'battery-rack': 179,
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const categorySlug = searchParams.get('category') ?? '';
  const sub = searchParams.get('sub');
  const sort = searchParams.get('sort') ?? '';
  const page = Number(searchParams.get('page') ?? 2);
  const per_page = 24; // larger batch = fewer round trips

  const orderby = sort === 'price' || sort === 'price-desc' ? 'price' : sort || undefined;
  const order = sort === 'price-desc' ? 'desc' : sort ? 'asc' : undefined;

  const activeSlug = sub ?? categorySlug;
  const categoryId = KNOWN_CATEGORY_IDS[activeSlug];

  const { products, total } = await getProducts({
    category_id: categoryId,
    category: categoryId ? undefined : activeSlug,
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
