import { NextRequest, NextResponse } from 'next/server';
import { getTechDocuments } from '@/lib/woocommerce';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ docs: [] });
  const docs = await getTechDocuments(Number(id));
  return NextResponse.json({ docs });
}
