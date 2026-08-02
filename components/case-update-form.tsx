"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-ink outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#328FF8] focus:bg-white focus:ring-4 focus:ring-[#328FF8]/10";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1.5 text-sm text-red-500";

export default function CaseUpdateForm({
  leadId,
  currentHearingDate,
}: {
  leadId: string;
  currentHearingDate: string | null;
}) {
  const router = useRouter();
  const [hearingDate, setHearingDate] = useState(currentHearingDate ?? "");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    const res = await fetch(`/api/cases/${leadId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hearingDate, note: note || undefined }),
    });

    const body = await res.json().catch(() => null);
    setPending(false);

    if (!res.ok) {
      setError(body?.message ?? "Something went wrong. Please try again.");
      // An expired session can't be recovered from in place — send them to
      // sign in again rather than leaving the update stuck.
      if (res.status === 401) router.push("/login");
      return;
    }

    setNote("");
    setSuccess(true);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-4 overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 sm:p-6"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#328FF8] to-gold-400" />
      <div>
        <label htmlFor="hearingDate" className={labelClass}>
          Hearing date
        </label>
        <input
          id="hearingDate"
          type="date"
          required
          className={inputClass}
          value={hearingDate}
          onChange={(e) => setHearingDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="note" className={labelClass}>
          Note (optional)
        </label>
        <textarea
          id="note"
          rows={3}
          className={inputClass}
          placeholder="e.g. adjourned due to judge's leave"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {error && <p className={errorClass}>{error}</p>}
      {success && <p className="mt-1.5 text-sm font-medium text-emerald-600">Case updated.</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#328FF8] px-5 py-2.5 font-semibold text-white shadow-lg shadow-[#328FF8]/30 transition-all hover:shadow-xl hover:shadow-[#328FF8]/60 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Update hearing date
      </button>
    </form>
  );
}
