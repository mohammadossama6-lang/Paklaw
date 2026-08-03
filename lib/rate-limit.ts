import "server-only";
import { createHash } from "node:crypto";

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

/** Never store the raw address. The salt stops the hash being reversed via a rainbow table of the IPv4 space. */
function hashIp(ip: string, scope: string): string {
  const salt = process.env.SESSION_SECRET ?? "paklaw";
  return createHash("sha256").update(`${salt}:${scope}:${ip}`).digest("hex");
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
  request: Request;
  /** Distinguishes endpoints so they don't share a budget. */
  scope: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const { request, scope, limit, windowMs } = options;
  const key = hashIp(clientIpFrom(request), scope);
  const windowStart = new Date(Date.now() - windowMs);

  try {
    // Drop this key's expired rows so the table can't grow without bound.
    await prisma.rateLimitHit.deleteMany({
      where: { key, createdAt: { lt: windowStart } },
    });

    const hits = await prisma.rateLimitHit.count({
      where: { key, createdAt: { gte: windowStart } },
    });

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
