import { put } from "@vercel/blob";
import { after } from "next/server";
import { z } from "zod";

import {
  ACCEPTED_CV_TYPES,
  lawyerApplicationSchema,
  MAX_CV_SIZE_BYTES,
} from "@/lib/lawyer-schema";
import { prisma } from "@/lib/prisma";
import { syncLawyerApplicationToGoHighLevel } from "@/lib/ghl";
import { checkRateLimit, clientIpFrom, phoneKey } from "@/lib/rate-limit";

/*
 * This endpoint had no limit at all, while accepting a file upload — see
 * /api/lead for why the per-person tier is keyed on the phone rather than the
 * address. Applying is a rarer act than enquiring, so the per-person ceiling is
 * lower.
 */
const APPLICATION_PHONE_LIMIT = 2;
const APPLICATION_IP_BURST_LIMIT = 40;
const APPLICATION_RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const ipRate = await checkRateLimit({
    identifier: clientIpFrom(request),
    scope: "lawyer-application:ip",
    limit: APPLICATION_IP_BURST_LIMIT,
    windowMs: APPLICATION_RATE_WINDOW_MS,
  });

  if (!ipRate.allowed) {
    return Response.json(
      { message: "You've sent several requests already. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ message: "Invalid form submission." }, { status: 400 });
  }

  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    province: formData.get("province"),
    barCouncilNumber: formData.get("barCouncilNumber"),
    yearsOfExperience: formData.get("yearsOfExperience"),
    practiceAreas: formData.getAll("practiceAreas"),
    lawDegree: formData.get("lawDegree"),
    university: formData.get("university"),
    graduationYear: formData.get("graduationYear"),
    bio: formData.get("bio"),
  };

  const parsed = lawyerApplicationSchema.safeParse(raw);

  if (!parsed.success) {
    return Response.json(
      {
        message: "Some fields are invalid. Please review the form and try again.",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  // Before the upload, so a repeat submission cannot spend blob storage.
  const phoneRate = await checkRateLimit({
    identifier: phoneKey(parsed.data.phone),
    scope: "lawyer-application:phone",
    limit: APPLICATION_PHONE_LIMIT,
    windowMs: APPLICATION_RATE_WINDOW_MS,
  });

  if (!phoneRate.allowed) {
    return Response.json(
      {
        message:
          "We've already received your application. Our team will review it and get back to you.",
      },
      { status: 429, headers: { "Retry-After": String(phoneRate.retryAfterSeconds) } }
    );
  }

  const cvFile = formData.get("cv");
  let cvUrl: string | undefined;

  if (cvFile instanceof File && cvFile.size > 0) {
    if (!ACCEPTED_CV_TYPES.includes(cvFile.type)) {
      return Response.json(
        { message: "CV must be a PDF or Word document." },
        { status: 400 }
      );
    }
    if (cvFile.size > MAX_CV_SIZE_BYTES) {
      return Response.json({ message: "CV must be under 5MB." }, { status: 400 });
    }

    // cvFile.name is attacker-controlled, so it never goes into the blob key
    // as-is: strip directory separators and anything outside a safe set, and
    // cap the length so the key stays predictable.
    const safeName =
      cvFile.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/^[.-]+/, "")
        .slice(-80) || "cv";

    // Best-effort, like the CRM sync below: losing the attachment should not
    // lose the application. `put` throws when BLOB_READ_WRITE_TOKEN is absent,
    // which would have turned a fully valid submission into a 500 and no
    // record of the applicant at all — the one part of this we cannot ask them
    // to send again.
    try {
      const blob = await put(`lawyer-cvs/${Date.now()}-${safeName}`, cvFile, {
        access: "public",
        addRandomSuffix: true,
      });
      cvUrl = blob.url;
    } catch (err) {
      console.error("CV upload failed — saving the application without it:", err);
    }
  }

  const application = await prisma.lawyerApplication.create({
    data: { ...parsed.data, cvUrl },
  });

  /*
   * Best-effort: a failed CRM sync shouldn't fail the submission itself, since
   * the application is already safely persisted above. It is also several
   * sequential calls to GoHighLevel, which the applicant was made to wait
   * through for no benefit — `after` returns the response first and finishes
   * the sync on the same invocation.
   */
  after(async () => {
    const { ok: synced, recordId } = await syncLawyerApplicationToGoHighLevel(
      parsed.data,
      cvUrl
    ).catch((err) => {
      console.error("GoHighLevel sync failed:", err);
      return { ok: false, recordId: undefined };
    });

    if (synced) {
      await prisma.lawyerApplication.update({
        where: { id: application.id },
        data: { ghlNotifiedAt: new Date(), ghlRecordId: recordId },
      });
    }
  });

  return Response.json({ ok: true }, { status: 201 });
}
