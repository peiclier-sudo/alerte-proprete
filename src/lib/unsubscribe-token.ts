import { createHmac } from "crypto";

const SECRET = process.env.CRON_SECRET || "fallback-secret";

export function generateUnsubscribeToken(subscriberId: string): string {
  return createHmac("sha256", SECRET).update(subscriberId).digest("hex");
}

export function verifyUnsubscribeToken(subscriberId: string, token: string): boolean {
  const expected = generateUnsubscribeToken(subscriberId);
  return token === expected;
}
