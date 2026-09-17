# Prag (brand-site) — Project Notes

## Commands
- `npm run dev` — start dev server (webpack)
- `npm run build` — production build
- `npm run lint` — eslint

## Bot Protection (Cloudflare Turnstile + Rate Limiting)
All public-facing lead-capture forms are protected by Cloudflare Turnstile
plus per-IP server-side rate limiting (5 submissions / 10 min / IP / route).

### Required env vars (in `.env.local`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — public site key (used by the client widget)
- `TURNSTILE_SECRET_KEY` — server secret key (used to verify tokens)

Get both from https://dash.cloudflare.com -> Turnstile -> Add site.
When left blank, verification is skipped (fail-open) so dev/forms keep working.
**Set real keys in production** to actually enforce the robot check.
The same Cloudflare site/secret keys can be reused across Prag and prag-b2b,
or register a separate site per domain.

### How it's wired
- Client widget: `components/Turnstile.tsx`
- Server verify: `lib/turnstile.ts` (`verifyTurnstileToken`, `getClientIp`)
- Rate limiter: `lib/rateLimit.ts` (in-memory, per-route buckets)

### Protected forms / routes
- `components/ContactForm.tsx` -> `app/api/contact/route.ts`
- `components/DistributorForm.tsx` -> `app/api/distributor/route.ts`
- `components/TechnicalSupportForm.tsx` -> `app/api/technical-support/route.ts`

Each route: (1) rate-limit check -> 429, (2) Turnstile verify -> 400, then
existing logic. The captcha token is stripped before forwarding to
WordPress / Prag-Admin.

## Performance / Rendering (do not regress)
- Pages are static/ISR by default. Only query- or session-dependent routes
  stay dynamic (`/products`, `/search`, `/checkout/*`, `/account/*`,
  `/wishlist`, `/knowledge-center`, `/resources`, `order-*`). Do NOT add
  `export const dynamic = 'force-dynamic'` to content pages.
- The root layout (`app/layout.tsx`) must stay free of `headers()`,
  `cookies()`, and uncached/`no-store` fetches — any of those force every
  page to render on-demand and defeat CDN caching.
- Session is resolved client-side: `TopBar` calls `GET /api/auth/session`
  after mount and on navigation while logged out.
- Tracking is loaded client-side by `components/TrackingLoader.tsx` via
  `GET /api/tracking?host=...` (GA, GTM, Meta/TikTok pixels, custom scripts).
  Server-side lookup is `unstable_cache`d for 5 min in
  `lib/ecommerceConfig.ts` with a 3s timeout — do not remove the cache or
  the timeout.
- Google Search Console HTML-tag verification needs the meta in static HTML:
  set `GOOGLE_SITE_VERIFICATION` in env (the admin-configured value is also
  injected client-side, but GSC does not execute JS).
- `images.minimumCacheTTL` is 86400 (1 day). Do not set it to 0 — that
  disables the image-optimizer cache and re-processes every image request.

## On-Demand Revalidation (Prag-Admin -> frontend)
Prag-Admin calls `POST /api/revalidate?secret=...` with `{paths, tags}` after
every save (`lib/revalidateFrontend.ts`, a `'use server'` module — keep it
server-only; calling it from the browser is CORS-blocked and fails silently).
- `app/api/revalidate/route.ts` uses `revalidateTag(tag, { expire: 0 })` so
  tags expire immediately (the `'max'` profile serves stale for ~5 min).
- Contract: any `fetch()` inside an `unstable_cache` in `lib/woocommerce.ts`
  must set `next.tags` matching the wrapper's tag — otherwise `revalidateTag`
  busts the memoized result but the underlying fetch cache keeps serving
  stale data. Tag names must match what Prag-Admin sends
  (`revalidateFrontend.ts`).

## Trust Signal — Installation Showcase
The "Buy With Confidence" section (`components/TrustSignal.tsx`) shows a
gallery of real PRAG installation photos with location labels beside the
trust stats.

### Settings (served from Prag-Admin `/prag-core/v1/settings`)
- `trust_signal_installations` (array) — list of installation photos:
  - `image` (string URL) — photo of the installation
  - `location` (string) — city/state label (e.g. "Lagos", "Abuja")
  - `caption` (string) — short description (e.g. "5KVA solar hybrid — Lekki home")
- The installation count is pulled from `trust_signal_stats` (the stat whose
  label contains "install").

### How it's wired
- `components/InstallationShowcase.tsx` — renders a featured large photo + a
  2x2 grid of smaller photos, each with a location pin overlay and caption.
- `components/TrustSignal.tsx` — passes settings to `InstallationShowcase`.

