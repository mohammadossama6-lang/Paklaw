import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCasesForLawyer } from "@/lib/dal";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { formatCaseDate } from "@/lib/format";

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label ?? value;
}

export default async function LawyerPortalPage() {
  const cases = await getCasesForLawyer();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-28">
      <div className="mb-8">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
          Lawyer Portal
        </span>
        <h1 className="mt-2 font-serif text-3xl italic tracking-tight text-ink">Your cases</h1>
        <p className="mt-1.5 text-sm text-muted">
          {cases.length === 0
            ? "No cases assigned yet."
            : `${cases.length} case${cases.length === 1 ? "" : "s"} assigned to you.`}
        </p>
      </div>

      {cases.length > 0 && (
        <ul className="space-y-3">
          {cases.map((lead, i) => (
            <li key={lead.id} style={{ animationDelay: `${i * 70}ms` }} className="animate-fade-in-up">
              <Link
                href={`/portal/lawyer/${lead.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 font-serif text-lg italic text-brand-700">
                  {lead.fullName.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-semibold text-ink">{lead.fullName}</span>
                    <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
                      {labelFor(SERVICE_OPTIONS, lead.service)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <span>{lead.city}</span>
                    <span aria-hidden>·</span>
                    <span
                      className={
                        lead.hearingDate
                          ? "rounded-full bg-gold-200/50 px-2 py-0.5 text-xs font-medium text-gold-700"
                          : "text-xs"
                      }
                    >
                      {lead.hearingDate ? formatCaseDate(lead.hearingDate) : "Hearing not set"}
                    </span>
                  </div>
                </div>

                <ArrowRight className="size-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
