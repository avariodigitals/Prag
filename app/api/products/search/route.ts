import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/woocommerce';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json({ products: [] });
  const result = await searchProducts(q, undefined, 1, 10);
  return NextResponse.json(result);
}
