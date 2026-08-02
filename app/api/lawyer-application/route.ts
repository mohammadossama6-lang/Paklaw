import { put } from "@vercel/blob";
import { z } from "zod";

import {
  ACCEPTED_CV_TYPES,
  lawyerApplicationSchema,
  MAX_CV_SIZE_BYTES,
} from "@/lib/lawyer-schema";
import { prisma } from "@/lib/prisma";
import { syncLawyerApplicationToGoHighLevel } from "@/lib/ghl";

export async function POST(request: Request) {
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

    const blob = await put(`lawyer-cvs/${Date.now()}-${safeName}`, cvFile, {
      access: "public",
      addRandomSuffix: true,
    });
    cvUrl = blob.url;
  }

  const application = await prisma.lawyerApplication.create({
    data: { ...parsed.data, cvUrl },
  });

  // Best-effort: a failed CRM sync shouldn't fail the submission itself,
  // since the application is already safely persisted above.
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

  return Response.json({ ok: true }, { status: 201 });
}
