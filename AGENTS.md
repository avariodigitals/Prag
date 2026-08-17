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

