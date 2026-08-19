import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import type { Role } from "@/lib/generated/prisma/enums";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Resolved on first use rather than at module load.
 *
 * `next build` evaluates every route's module scope to collect page data, so
 * throwing here failed the entire build — all fourteen routes, the static
 * marketing pages included — over a variable only the two session routes
 * actually need. That makes any environment missing one secret undeployable,
 * which is exactly the wrong time to find out.
 *
 * The check is not weakened: a missing secret still throws, just on the
 * request that needs it instead of at import time. Nothing signs or verifies a
 * session without a real key.
 */
let encodedKey: Uint8Array | undefined;

function sessionKey(): Uint8Array {
  if (!encodedKey) {
    const secretKey = process.env.SESSION_SECRET;
    if (!secretKey) throw new Error("SESSION_SECRET is not set.");
    encodedKey = new TextEncoder().encode(secretKey);
  }
  return encodedKey;
}

export type SessionPayload = {
  userId: string;
  role: Role;
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(sessionKey());
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, sessionKey(), { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
