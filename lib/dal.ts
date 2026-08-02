import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { decrypt, getSessionCookie } from "@/lib/session";
import { Role } from "@/lib/generated/prisma/enums";

/**
 * Non-redirecting session read. Route handlers must use this: `redirect()`
 * inside a route handler produces a 307 that `fetch` transparently follows to
 * the login page, which answers 200 HTML — so the caller sees `res.ok` and
 * reports success for a request that never ran. Pages use verifySession().
 */
export const getSession = cache(async () => decrypt(await getSessionCookie()));

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
});

/** Returns null instead of redirecting — for route handlers. */
export const getLawyerApplicationOrNull = cache(async () => {
  const session = await getSession();
  if (!session || session.role !== Role.LAWYER) return null;
  return prisma.lawyerApplication.findUnique({ where: { userId: session.userId } });
});

export const getLawyerApplication = cache(async () => {
  const lawyer = await getLawyerApplicationOrNull();
  if (!lawyer) redirect("/login");
  return lawyer;
});

export async function getCasesForLawyer() {
  const lawyer = await getLawyerApplication();
  return prisma.lead.findMany({
    where: { matchedLawyerId: lawyer.id },
    orderBy: { createdAt: "desc" },
  });
}

/** Fetches a case only if it belongs to the signed-in lawyer — the ownership check every route/page must go through. */
export async function getCaseForLawyer(leadId: string) {
  const lawyer = await getLawyerApplication();
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.matchedLawyerId !== lawyer.id) return null;
  return lead;
}

/** Same ownership check as getCaseForLawyer, but never redirects. */
export async function getCaseForLawyerOrNull(leadId: string) {
  const lawyer = await getLawyerApplicationOrNull();
  if (!lawyer) return null;
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.matchedLawyerId !== lawyer.id) return null;
  return lead;
}

export async function getCasesForClient() {
  const session = await verifySession();
  if (session.role !== Role.CLIENT) redirect("/login");

  return prisma.lead.findMany({
    where: { clientUserId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { matchedLawyer: true },
  });
}
