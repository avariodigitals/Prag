/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * Required env vars:
 *   TURNSTILE_SECRET_KEY      - server secret key (never exposed to client)
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY - public site key (used by the widget)
 *
 * If TURNSTILE_SECRET_KEY is not set, verification is skipped (fail-open).
 * This keeps local dev working without keys; set the keys in production
 * to actually enforce the robot check.
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Cloudflare's official test secret (always passes validation for the dummy
// token). Paired with the test sitekey the client uses on Vercel preview
// deployments — the production secret rejects dummy tokens.
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

export interface TurnstileVerifyResult {
  success: boolean;
  /** When true, verification was skipped because no secret key is configured. */
  skipped: boolean;
  /** Error codes from Cloudflare when verification ran but failed. */
  'error-codes'?: string[];
}

export async function verifyTurnstileToken(
  token: unknown,
  remoteip?: string | null,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.VERCEL_ENV === 'preview'
    ? TEST_SECRET_KEY
    : process.env.TURNSTILE_SECRET_KEY;

  // Fail-open when not configured (local dev / not yet set up).
  if (!secret) {
    return { success: true, skipped: true };
  }

  if (typeof token !== 'string' || !token.trim()) {
    return { success: false, skipped: false, 'error-codes': ['missing-input-response'] };
  }

  try {
    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);
    if (remoteip) form.append('remoteip', remoteip);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: form,
      // siteverify is fast but give it a sane ceiling.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { success: false, skipped: false, 'error-codes': ['http-error'] };
    }

    const data = (await res.json()) as TurnstileVerifyResult;
    return {
      success: Boolean(data.success),
      skipped: false,
      'error-codes': data['error-codes'],
    };
  } catch {
    return { success: false, skipped: false, 'error-codes': ['verification-fetch-failed'] };
  }
}

/** Extract a best-effort client IP from a Next.js request. */
export function getClientIp(req: Request | { headers: Headers }): string {
  const headers = req instanceof Request ? req.headers : req.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // First hop is the client.
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
