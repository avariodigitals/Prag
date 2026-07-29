import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isAllowedHost(host: string) {
  const normalized = host.toLowerCase();
  const allowed = (process.env.B2B_404_ALLOWED_HOSTS ?? 'localhost,127.0.0.1,prag.global').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.some((item) => normalized === item || normalized.endsWith(`.${item}`));
}

async function appendLocal404Audit(payload: { host: string; path: string; referrer?: string; userAgent?: string; redirect?: string }) {
  const localStorePath = path.resolve(process.cwd(), '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');
  const raw = await fs.readFile(localStorePath, 'utf8');
  const parsed = JSON.parse(raw) as {
    audit?: Array<{ id?: string; at?: string; actor?: string; action?: string; target?: string; details?: string; redirect?: string }>;
  };
  const audit = Array.isArray(parsed.audit) ? parsed.audit : [];

  const details = [`host=${payload.host}`, `path=${payload.path}`]
    .concat(payload.referrer ? [`referrer=${payload.referrer}`] : [])
    .concat(payload.userAgent ? [`ua=${payload.userAgent}`] : [])
    .join(' | ');

  const next = {
    ...parsed,
    audit: [
      {
        id: randomId(),
        at: new Date().toISOString(),
        actor: 'prag-b2c',
        action: '404.not-found',
        target: payload.path,
        details,
        redirect: payload.redirect || undefined,
      },
      ...audit,
    ].slice(0, 1000),
  };

  await fs.writeFile(localStorePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { path?: string; host?: string; referrer?: string; userAgent?: string; redirect?: string };
    const loggedPath = String(body.path ?? '').trim();
    const loggedHost = String(body.host ?? '').trim();

    if (!loggedPath.startsWith('/') || !loggedHost || !isAllowedHost(loggedHost)) {
      return NextResponse.json({ success: false, ignored: true });
    }

    const payload = {
      path: loggedPath,
      host: loggedHost,
      referrer: body.referrer ? String(body.referrer) : '',
      userAgent: body.userAgent ? String(body.userAgent) : '',
      redirect: body.redirect ? String(body.redirect) : '',
    };

    const adminUrl = process.env.ECOMMERCE_ADMIN_API_URL || process.env.NEXT_PUBLIC_ADMIN_API_URL;
    let synced = false;

    if (adminUrl) {
      try {
        const res = await fetch(`${adminUrl.replace(/\/$/, '')}/api/admin/404-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        synced = res.ok;
      } catch {
        synced = false;
      }
    }

    if (!synced) {
      await appendLocal404Audit(payload);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
