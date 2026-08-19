import { after } from "next/server";
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

  /*
   * Everything past this point is bookkeeping the enquirer has no stake in:
   * picking a lawyer, and pushing the lead into GoHighLevel across four or
   * five sequential calls to their API. All of it used to run before the
   * response, so someone on a phone in Karachi held a spinner through a
   * round trip to the CRM and back for work that is explicitly best-effort —
   * and the lead is already safely persisted above either way.
   *
   * `after` hands the response back now and finishes the rest on the same
   * invocation. Failures still land in the logs; they just no longer cost the
   * person a wait, and a CRM outage can no longer look like a broken form.
   */
  after(async () => {
    // Lawyer matching is province-based, so it only applies to leads that have
    // a province (Pakistani citizens) — overseas / foreign leads skip it.
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
  });

  return Response.json({ ok: true }, { status: 201 });
}
