import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { decrypt, getSessionCookie } from "@/lib/session";
import { Role } from "@/lib/generated/prisma/enums";

export const verifySession = cache(async () => {
  const session = await decrypt(await getSessionCookie());
  if (!session) redirect("/login");
  return session;
});

export const getLawyerApplication = cache(async () => {
  const session = await verifySession();
  if (session.role !== Role.LAWYER) redirect("/login");

  const lawyer = await prisma.lawyerApplication.findUnique({ where: { userId: session.userId } });
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

export async function getCasesForClient() {
  const session = await verifySession();
  if (session.role !== Role.CLIENT) redirect("/login");

  return prisma.lead.findMany({
    where: { clientUserId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { matchedLawyer: true },
  });
}
