import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function resolveB2BAdminUrl() {
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

async function persistSupportLocally(body: Record<string, unknown>) {
  const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
  const raw = await fs.readFile(localStorePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    supportSubmissions?: Array<Record<string, unknown>>;
    audit?: Array<Record<string, unknown>>;
  };

  const record = {
    id: randomId(),
    kind: 'support',
    status: 'new',
    name: String(body?.name ?? ''),
    email: String(body?.email ?? ''),
    phone: body?.phone ? String(body.phone) : undefined,
    company: body?.company ? String(body.company) : undefined,
    subject: body?.enquiry_type ? String(body.enquiry_type) : 'Technical Support',
    message: String(body?.message ?? ''),
    source: 'public-form',
    route: '/technical-support',
    createdAt: new Date().toISOString(),
  };

  const supportSubmissions = Array.isArray(parsed.supportSubmissions) ? parsed.supportSubmissions : [];
  const audit = Array.isArray(parsed.audit) ? parsed.audit : [];

  const next = {
    ...parsed,
    supportSubmissions: [record, ...supportSubmissions].slice(0, 500),
    audit: [
      {
        id: randomId(),
        at: new Date().toISOString(),
        actor: record.email || 'public-form',
        action: 'create',
        target: 'support ticket',
        details: 'Received via /technical-support',
      },
      ...audit,
    ].slice(0, 1000),
  };

  await fs.writeFile(localStorePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ message: 'Name, email and message are required.' }, { status: 400 });
  }

  // Send to WordPress contact endpoint
  const wpRes = await fetch(`${WP_API}/prag-core/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...body,
      route: '/technical-support',
      subject: body.enquiry_type || 'Technical Support',
    }),
  });

  if (!wpRes.ok) {
    const data = await wpRes.json().catch(() => ({}));
    return NextResponse.json(
      { message: data?.message || 'Failed to send message. Please try again.' },
      { status: wpRes.status }
    );
  }

  // Sync to B2B admin intake (best-effort)
  const adminUrl = resolveB2BAdminUrl();
  if (adminUrl) {
    try {
      await fetch(`${adminUrl}/api/admin/b2b/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          kind: 'support',
          route: '/technical-support',
          subject: body.enquiry_type || 'Technical Support',
        }),
      });
    } catch {
      // Ignore remote sync failures; local fallback handles dev
    }
  }

  // Always persist locally in dev so local Prag-Admin sees submissions.
  // In production (Vercel) the intake API is the only path.
  if (!process.env.VERCEL) {
    try {
      await persistSupportLocally(body);
    } catch {
      // Ignore local persistence failures so public submission still succeeds
    }
  }

  return NextResponse.json({ success: true });
}
