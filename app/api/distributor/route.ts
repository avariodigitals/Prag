import { NextResponse } from 'next/server';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

function resolveAdminUrl() {
  const candidates = [
    process.env.B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_B2B_ADMIN_PUBLIC_URL,
    process.env.ECOMMERCE_ADMIN_API_URL,
  ];
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate.replace(/\/$/, '');
  }
  return null;
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email || !body.business) {
    return NextResponse.json({ message: 'Name, email and business name are required.' }, { status: 400 });
  }

  const res = await fetch(`${WP_API}/prag-core/v1/distributor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || 'Submission failed. Please try again.' },
      { status: res.status }
    );
  }

  const adminUrl = resolveAdminUrl();
  if (adminUrl) {
    try {
      await fetch(`${adminUrl}/api/admin/b2b/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          kind: 'distributor',
          route: '/distributor',
          company: body.business,
        }),
      });
    } catch {
      // Best-effort sync; ignore failures
    }
  }

  return NextResponse.json({ success: true });
}
