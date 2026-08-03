import { z } from "zod";

import { leadSchema } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import { syncLeadToGoHighLevel } from "@/lib/ghl";
import { findMatchingLawyer } from "@/lib/lawyer-matching";
import { checkRateLimit } from "@/lib/rate-limit";

// A genuine enquirer submits once, maybe twice if they mistype something.
// Five in ten minutes leaves room for that while stopping a script from
// filling the CRM.
const LEAD_RATE_LIMIT = 5;
const LEAD_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const rate = await checkRateLimit({
    request,
    scope: "lead",
    limit: LEAD_RATE_LIMIT,
    windowMs: LEAD_RATE_WINDOW_MS,
  });

  if (!rate.allowed) {
    return Response.json(
      { message: "You've sent several requests already. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Some fields are invalid. Please review the form and try again.",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.create({ data: parsed.data });

  // Best-effort: a failed lawyer match shouldn't fail the lead submission
  // itself, since the lead is already safely persisted above. Lawyer matching
  // is province-based, so it only applies to leads that have a province
  // (Pakistani citizens) — overseas / foreign leads skip it.
  const matchedLawyer = parsed.data.province
    ? await findMatchingLawyer({
        service: parsed.data.service,
        province: parsed.data.province,
        city: parsed.data.city,
      }).catch((err) => {
        console.error("Lawyer matching failed:", err);
        return null;
      })
    : null;

  if (matchedLawyer) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { matchedLawyerId: matchedLawyer.id },
    });
  }

  // Best-effort: a failed CRM sync shouldn't fail the lead submission itself,
  // since the lead is already safely persisted above.
  const {
    ok: synced,
    contactId,
    opportunityId,
  } = await syncLeadToGoHighLevel(parsed.data, matchedLawyer).catch((err) => {
    console.error("GoHighLevel sync failed:", err);
    return { ok: false, contactId: undefined, opportunityId: undefined };
  });

  if (synced) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        ghlNotifiedAt: new Date(),
        ghlContactId: contactId,
        ghlOpportunityId: opportunityId,
      },
    });
  }

  return Response.json({ ok: true }, { status: 201 });
}
