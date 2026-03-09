const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_HITS = 5;

export function rateLimit(key: string): { limited: boolean } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false };
  }

  entry.count++;
  if (entry.count > MAX_HITS) {
    return { limited: true };
  }

  return { limited: false };
}
