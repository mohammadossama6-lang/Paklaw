import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCaseForLawyer } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SERVICE_OPTIONS, SUB_SERVICE_OPTIONS } from "@/lib/constants";
import CaseUpdateForm from "@/components/case-update-form";
import { formatCaseDate } from "@/lib/format";

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label ?? value;
}

export default async function LawyerCasePage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = await getCaseForLawyer(leadId);
  if (!lead) notFound();

  const updates = await prisma.caseUpdate.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-28">
      <Link
        href="/portal/lawyer"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand-600"
      >
        <ArrowLeft className="size-3.5" />
        Back to cases
      </Link>

      <div className="mb-8">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">Case</span>
        <h1 className="mt-2 font-serif text-3xl italic tracking-tight text-ink">{lead.fullName}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {labelFor(SERVICE_OPTIONS, lead.service)}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-muted">
            {labelFor(SUB_SERVICE_OPTIONS[lead.service as keyof typeof SUB_SERVICE_OPTIONS], lead.subService)}
          </span>
          <span className="text-xs font-medium text-muted">{lead.city}</span>
        </div>
      </div>

      <div className="mb-10">
        <CaseUpdateForm
          leadId={lead.id}
          currentHearingDate={lead.hearingDate ? lead.hearingDate.toISOString().slice(0, 10) : null}
        />
      </div>

      {updates.length > 0 && (
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">History</h2>
          <ul className="relative space-y-4 border-l border-slate-200 pl-6">
            {updates.map((update) => (
              <li key={update.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-gold-400 ring-4 ring-gold-100"
                />
                <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm shadow-sm">
                  <div className="text-xs text-slate-400">{update.createdAt.toLocaleString()}</div>
                  {update.hearingDate && (
                    <div className="mt-1 font-medium text-ink">
                      Hearing set to {formatCaseDate(update.hearingDate)}
                    </div>
                  )}
                  {update.note && <div className="mt-1 text-muted">{update.note}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
