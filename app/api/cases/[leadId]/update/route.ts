import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifySession, getCaseForLawyer } from "@/lib/dal";
import { updateCaseHearingDate } from "@/lib/ghl";

const caseUpdateSchema = z.object({
  hearingDate: z.iso.date("Please enter a valid date."),
  note: z.string().max(2000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const session = await verifySession();
  const { leadId } = await params;

  const lead = await getCaseForLawyer(leadId);
  if (!lead) {
    return Response.json({ message: "Case not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = caseUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "Invalid request.", errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const hearingDate = new Date(parsed.data.hearingDate);

  await prisma.$transaction([
    prisma.lead.update({ where: { id: lead.id }, data: { hearingDate } }),
    prisma.caseUpdate.create({
      data: {
        leadId: lead.id,
        authorUserId: session.userId,
        hearingDate,
        note: parsed.data.note,
      },
    }),
  ]);

  // Best-effort: the update is already durably recorded above.
  if (lead.ghlContactId) {
    await updateCaseHearingDate(lead.ghlContactId, hearingDate).catch((err) => {
      console.error("GoHighLevel hearing-date sync failed:", err);
    });
  }

  return Response.json({ ok: true });
}
