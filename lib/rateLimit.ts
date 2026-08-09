/**
 * Lightweight in-memory IP rate limiter for form submission API routes.
 *
 * Not suitable for multi-instance/serverless deployments that don't share
 * memory — but for a single Next.js server process it's an effective
 * first line of defense against form flooding. Each route gets its own
 * bucket so a flood on /contact doesn't block /careers.
 */

interface Bucket {
  /** Timestamps (ms) of recent submissions from this key. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

// Periodically purge expired entries so the map doesn't grow unbounded.
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

function sweepNow(windowMs: number) {
  const cutoff = Date.now() - windowMs;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((t) => t > cutoff);
    if (bucket.hits.length === 0) buckets.delete(key);
  }
  lastSweep = Date.now();
}

export interface RateLimitOptions {
  /** Max submissions allowed within the window. */
  max: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Number of submissions in the current window (including this attempt). */
  count: number;
  /** Max submissions allowed in the window. */
  max: number;
  /** Ms until the oldest hit falls out of the window (retry-after hint). */
  retryAfterMs: number;
}

/**
 * Records an attempt for `key` and returns whether it's within the limit.
 * Always records the hit (even rejected ones) so repeat offenders stay
 * throttled.
 */
export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  if (Date.now() - lastSweep > SWEEP_INTERVAL_MS) sweepNow(opts.windowMs);

  const now = Date.now();
  const cutoff = now - opts.windowMs;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  bucket.hits = bucket.hits.filter((t) => t > cutoff);
  bucket.hits.push(now);

  const count = bucket.hits.length;
  const allowed = count <= opts.max;
  const retryAfterMs = bucket.hits.length > 0
    ? Math.max(0, bucket.hits[0]! + opts.windowMs - now)
    : 0;

  return { allowed, count, max: opts.max, retryAfterMs };
}

/** Default limits used by the public form routes. */
export const FORM_RATE_LIMIT: RateLimitOptions = {
  max: 5,
  windowMs: 10 * 60 * 1000, // 5 submissions per 10 minutes per IP per route
};
