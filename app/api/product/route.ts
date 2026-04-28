import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(product);
}
