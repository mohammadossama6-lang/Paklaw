"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { useIntakeModal } from "@/components/intake-modal-provider";

export default function HeroCtaCard() {
  const { openIntakeModal } = useIntakeModal();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl shadow-slate-900/15 sm:p-9">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#328FF8] to-sky-500"
      />
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-linear-to-br from-[#328FF8] to-indigo-600 text-white shadow-lg shadow-brand-600/30">
        <Sparkles className="size-6" />
      </span>
      <h2 className="mt-5 font-sans text-2xl font-black tracking-tight text-ink">
        Schedule Your{" "}
        <span className="bg-linear-to-r from-[#328FF8] to-sky-500 bg-clip-text text-transparent">
          Legal Consultation
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-muted">
        Tell us a bit about your matter in two quick steps and a member of
        our team will reach out within one business day.
      </p>
      <button
        type="button"
        onClick={openIntakeModal}
        className="group relative mx-auto mt-6 flex items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-[#328FF8] via-indigo-600 to-brand-800 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-700/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-700/50 active:scale-[0.98]"
      >
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-white/25 blur-[2px] transition-transform duration-700 ease-out translate-x-[-150%] group-hover:translate-x-[500%]" />
        <span className="relative">Register as a Client</span>
        <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
