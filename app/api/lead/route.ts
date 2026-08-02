import { z } from "zod";

import { leadSchema } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import { syncLeadToGoHighLevel } from "@/lib/ghl";
import { findMatchingLawyer } from "@/lib/lawyer-matching";

export async function POST(request: Request) {
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
