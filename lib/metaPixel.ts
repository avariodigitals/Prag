/**
 * Meta Pixel event helpers.
 *
 * The Meta Pixel base code is loaded by `components/TrackingLoader.tsx` using
 * the `metaPixelId` configured in Prag-Admin. These helpers fire standard
 * Meta Pixel events on meaningful user actions (button clicks, form
 * submissions) — never on passive page views.
 *
 * Every helper is safe to call even when the pixel is not loaded (e.g. in
 * development or when no Meta Pixel ID is configured): it silently no-ops.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Fire the Meta Pixel `Lead` event.
 *
 * Call this the instant a user performs a high-intent action that should be
 * counted as a lead — e.g. clicking "Get Recommendation" on the Power
 * Calculator, or successfully submitting a contact / distributor / support
 * form.
 *
 * @param data Optional extra data to attach (e.g. `{ content_name: 'Power Calculator' }`).
 */
export function trackLead(data?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Lead', data ?? {});
}

/**
 * Fire the Meta Pixel `Contact` event — a softer intent signal than `Lead`,
 * useful for general enquiry form submissions.
 */
export function trackContact(data?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Contact', data ?? {});
}
