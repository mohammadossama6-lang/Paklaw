import { Scale } from "lucide-react";

import { getCasesForClient } from "@/lib/dal";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { formatCaseDate } from "@/lib/format";

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label ?? value;
}

export default async function ClientPortalPage() {
  const cases = await getCasesForClient();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-28">
      <div className="mb-8">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
          Client Portal
        </span>
        <h1 className="mt-2 font-serif text-3xl italic tracking-tight text-ink">
          Your case{cases.length === 1 ? "" : "s"}
        </h1>
      </div>

      {cases.length === 0 ? (
        <p className="text-muted">No cases found for this account.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((lead, i) => (
            <li
              key={lead.id}
              style={{ animationDelay: `${i * 70}ms` }}
              className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#328FF8] to-gold-400" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">{labelFor(SERVICE_OPTIONS, lead.service)}</span>
                <span
                  className={
                    lead.status === "open"
                      ? "rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700"
                      : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-muted"
                  }
                >
                  {lead.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <span
                  className={
                    lead.hearingDate
                      ? "rounded-full bg-gold-200/50 px-2.5 py-1 text-xs font-medium text-gold-700"
                      : "text-xs"
                  }
                >
                  Hearing date: {lead.hearingDate ? formatCaseDate(lead.hearingDate) : "Not yet scheduled"}
                </span>
              </div>

              {lead.matchedLawyer && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Scale className="size-3.5 text-brand-600" />
                  {lead.matchedLawyer.fullName}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
