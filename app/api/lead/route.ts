import { after } from "next/server";
import { z } from "zod";

import { leadSchema } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import { syncLeadToGoHighLevel } from "@/lib/ghl";
import { findMatchingLawyer } from "@/lib/lawyer-matching";
import { checkRateLimit, clientIpFrom, phoneKey } from "@/lib/rate-limit";

/*
 * Two tiers, because they answer different questions.
 *
 * This budget used to be per-IP alone, which assumes one address is one
 * person. On the networks this site's traffic actually arrives from — Jazz,
 * Zong, Telenor, Ufone — carrier-grade NAT puts thousands of subscribers
 * behind a single public IPv4. Five submissions per ten minutes across all of
 * them meant that during an ad push the sixth genuine enquirer was turned away
 * because five strangers on the same carrier had got there first. Paid traffic,
 * rejected at the form.
 *
 * So the per-person limit is keyed on the phone number instead: two people on
 * one carrier IP have different numbers and never collide, while the case the
 * limit exists for — the same person, or a script reusing one identity — is
 * still caught. The IP tier stays purely as a flood backstop, with a ceiling
 * far above what a shared carrier address produces in normal traffic but well
 * below what one machine hammering the endpoint would.
 */
const LEAD_PHONE_LIMIT = 4;
const LEAD_IP_BURST_LIMIT = 80;
const LEAD_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  // The backstop runs first: it needs nothing from the body, so a flood is
  // turned away before any parsing happens.
  const ipRate = await checkRateLimit({
    identifier: clientIpFrom(request),
    scope: "lead:ip",
    limit: LEAD_IP_BURST_LIMIT,
    windowMs: LEAD_RATE_WINDOW_MS,
  });

  if (!ipRate.allowed) {
    return Response.json(
      { message: "You've sent several requests already. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
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

  // The per-person limit can only run once the body has been validated, since
  // it is keyed on the phone number. Parsing first costs nothing — it is in
  // memory, and the backstop above already stopped any flood.
  const phoneRate = await checkRateLimit({
    identifier: phoneKey(parsed.data.phone),
    scope: "lead:phone",
    limit: LEAD_PHONE_LIMIT,
    windowMs: LEAD_RATE_WINDOW_MS,
  });

  if (!phoneRate.allowed) {
    return Response.json(
      {
        message:
          "We've already received your enquiry. Our team will be in touch shortly.",
      },
      { status: 429, headers: { "Retry-After": String(phoneRate.retryAfterSeconds) } }
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
