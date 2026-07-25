import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

export const runtime = 'nodejs';

const KNOWN_CATEGORY_IDS: Record<string, number> = {
  'inverters': Number(process.env.WC_CAT_INVERTERS ?? 314),
  'solar': Number(process.env.WC_CAT_SOLAR ?? 320),
  'batteries': Number(process.env.WC_CAT_BATTERIES ?? 327),
  'voltage-stabilizers': 322,
  'all-prag-stabilizers': 321,
  'thyristor-stabilizers': 349,
  'relay-voltage-stabilizers': 323,
  'servo-voltage-stabilizers': 324,
  'advanced-stabilizers': 338,
  'hybrid-inverters': 319,
  'heavy-duty-inverters': 315,
  'solar-panels': 326,
  'solar-charge-controllers': 325,
  'protective-device': 340,
  'tubular-batteries': 348,
  'lithium-batteries': 344,
  'battery-rack': 339,
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const categorySlug = searchParams.get('category') ?? '';
  const sub = searchParams.get('sub');
  const page = Number(searchParams.get('page') ?? 2);
  const per_page = Number(searchParams.get('per_page') ?? 16);

  const activeSlug = sub ?? categorySlug;
  const categoryId = KNOWN_CATEGORY_IDS[activeSlug];

  const { products, total } = await getProducts({
    category_id: categoryId,
    category: categoryId ? undefined : activeSlug,
    page,
    per_page,
  });

  const hasMore = page * per_page < total;

  return NextResponse.json(
    { products, hasMore },
    {
      headers: {
        'Cache-Control': 's-maxage=600, stale-while-revalidate=120',
      },
    }
  );
}
