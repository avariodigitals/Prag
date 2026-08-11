'use client';

/**
 * Cloudflare Turnstile widget (client side).
 *
 * Renders the Turnstile challenge and reports the resulting token up via
 * onVerify. When NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (e.g. local dev),
 * the widget renders nothing and immediately calls onVerify('') so the form
 * remains submittable; the server also fails open without a secret key.
 */

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

// Cloudflare's official test sitekey (always passes, works on any domain).
// Used on Vercel preview deployments, where the production sitekey's
// hostname allow-list does not authorize *.vercel.app URLs (error 110200).
const TEST_SITE_KEY = '1x00000000000000000000AA';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed')), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Turnstile script failed'));
    document.head.appendChild(s);
  });
  return scriptLoadPromise;
}

interface Props {
  onVerify: (token: string) => void;
  /** Reset the widget when this value changes (e.g. after a failed submit). */
  resetKey?: unknown;
  className?: string;
}

export default function Turnstile({ onVerify, resetKey, className }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? TEST_SITE_KEY
    : process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [error, setError] = useState(false);

  // No site key configured: fail open so dev/forms keep working.
  useEffect(() => {
    if (siteKey) return;
    onVerify('');
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        // Clear any previous widget before re-rendering.
        if (widgetIdRef.current) {
          try { window.turnstile.remove(widgetIdRef.current); } catch {}
          widgetIdRef.current = null;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          size: 'normal',
          callback: (token) => {
            setError(false);
            onVerify(token);
          },
          'expired-callback': () => {
            onVerify('');
          },
          'error-callback': () => {
            setError(true);
            onVerify('');
          },
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
    // Re-render when resetKey changes (e.g. after a failed submit to clear stale token).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, resetKey]);

  if (!siteKey) return null;

  return (
    <div className={className}>
      <div ref={containerRef} />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-['Space_Grotesk']">
          The security check failed to load. Please refresh the page and try again.
        </p>
      )}
    </div>
  );
}
