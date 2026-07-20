"use client";

import { ArrowRight } from "lucide-react";

import { LogoMark } from "@/components/logo-mark";
import { WhatsappIcon } from "@/components/social-icons";
import { useIntakeModal } from "@/components/intake-modal-provider";

const WHATSAPP_HREF = "https://wa.me/923035521111";

export default function CtaBanner() {
  const { openIntakeModal } = useIntakeModal();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-pine-900 via-pine-800 to-pine-700 px-4 py-20 sm:px-6">
      <LogoMark
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 size-80 text-white/5 sm:size-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-gold-400/10 blur-[110px]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-gold-300">
          Ready when you are
        </span>
        <h2 className="font-serif text-3xl italic tracking-tight text-white sm:text-4xl">
          Speak with a lawyer, on your terms.
        </h2>
        <p className="max-w-lg text-base leading-7 text-slate-300">
          Book a consultation in two quick steps, or message us directly on
          WhatsApp and we&apos;ll take it from there.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openIntakeModal}
            className="group flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-pine-900 shadow-lg shadow-gold-500/30 transition-all hover:shadow-xl hover:shadow-gold-500/50 hover:brightness-105 active:scale-[0.98]"
          >
            Book a Consultation
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <WhatsappIcon className="size-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
