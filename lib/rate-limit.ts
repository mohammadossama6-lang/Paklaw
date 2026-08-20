import "server-only";
import { createHash } from "node:crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { prisma } from "@/lib/prisma";

/**
 * Rate limiting for public, unauthenticated endpoints.
 *
 * /api/lead writes to the database AND creates a GoHighLevel contact,
 * opportunity and note, so an unthrottled flood doesn't just fill a table —
 * it lands in the CRM the team works out of.
 *
 * Counting happens in Postgres rather than in memory because serverless
 * instances are ephemeral and there are many of them; an in-process counter
 * would reset constantly and limit almost nothing.
 */

/**
 * Never store the raw identifier — an address or a phone number. The salt stops
 * the hash being reversed via a rainbow table of the IPv4 space, or of the
 * (much smaller) space of Pakistani mobile numbers.
 */
function hashIdentifier(value: string, scope: string): string {
  const salt = process.env.SESSION_SECRET ?? "paklaw";
  return createHash("sha256").update(`${salt}:${scope}:${value}`).digest("hex");
}

/**
 * The key for a per-person limit.
 *
 * Normalising first is the whole point: "0300 1234567", "+92 300 1234567" and
 * "03001234567" are one person, and hashing them as typed would produce three
 * separate budgets and limit nothing. The intake form already sends E.164, but
 * this endpoint is public and can be called with anything.
 */
export function phoneKey(phone: string): string {
  const trimmed = phone.trim();
  try {
    // A number that already carries a dialling code is parsed by that code, so
    // the default only applies to one typed in local form. Without it,
    // "03001234567" and "+923001234567" hash to two different budgets and the
    // same person gets two — verified: with "PK" both collapse to
    // +923001234567, while +44 and +971 numbers are untouched.
    const parsed = parsePhoneNumberFromString(trimmed, "PK");
    if (parsed && parsed.isPossible()) return parsed.number;
  } catch {
    /* fall through to the digit-only form */
  }
  return trimmed.replace(/\D/g, "") || trimmed;
}

/**
 * Vercel puts the client address at the head of x-forwarded-for. Everything
 * after it is proxy hops and is attacker-controllable, so only the first entry
 * is used.
 */
export function clientIpFrom(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window frees up — for the Retry-After header. */
  retryAfterSeconds: number;
};

export async function checkRateLimit(options: {
  /**
   * The raw value the budget belongs to — an IP for a flood backstop, a phone
   * number for a per-person limit. Hashed before it is stored.
   */
  identifier: string;
  /** Distinguishes endpoints and tiers so they don't share a budget. */
  scope: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const { identifier, scope, limit, windowMs } = options;
  const key = hashIdentifier(identifier, scope);
  const windowStart = new Date(Date.now() - windowMs);

  try {
    // The prune and the count touch disjoint rows — one is strictly older than
    // `windowStart`, the other strictly newer — so they can go together rather
    // than as two sequential round trips. Every trip to Neon is paid at the
    // distance between the function and the database, on the path a visitor
    // waits on before their enquiry is accepted.
    const [, hits] = await Promise.all([
      // Drop this key's expired rows so the table can't grow without bound.
      prisma.rateLimitHit.deleteMany({
        where: { key, createdAt: { lt: windowStart } },
      }),
      prisma.rateLimitHit.count({
        where: { key, createdAt: { gte: windowStart } },
      }),
    ]);

    if (hits >= limit) {
      const oldest = await prisma.rateLimitHit.findFirst({
        where: { key, createdAt: { gte: windowStart } },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      const freesAt = (oldest?.createdAt.getTime() ?? Date.now()) + windowMs;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((freesAt - Date.now()) / 1000)),
      };
    }

    await prisma.rateLimitHit.create({ data: { key } });
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    // A limiter that fails closed would take the lead form down with the
    // database hiccup that broke it. Let the request through and record it.
    console.error("Rate limit check failed — allowing the request:", err);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
