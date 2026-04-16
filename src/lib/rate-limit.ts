/**
 * Simple in-memory rate limiter.
 * Tracks requests by IP address with automatic cleanup of expired entries.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp in ms
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

/** Remove expired entries periodically */
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  // Run cleanup at most once per minute
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Check if the request is rate-limited.
 * Returns `null` if allowed, or a Response (429) if the limit is exceeded.
 */
export function checkRateLimit(ip: string): Response | null {
  cleanup();

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    // Start a new window
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_REQUESTS) {
    return Response.json(
      {
        success: false,
        error: "Trop de requêtes. Veuillez réessayer dans quelques minutes.",
      },
      { status: 429 }
    );
  }

  entry.count++;
  return null;
}

/**
 * Validate email format using a regex.
 * Returns `null` if valid, or a Response (400) if invalid.
 */
export function validateEmail(email: string): Response | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return Response.json(
      {
        success: false,
        error: "Le format de l'adresse email est invalide.",
      },
      { status: 400 }
    );
  }
  return null;
}
