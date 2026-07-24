"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { useIntakeModal } from "@/components/intake-modal-provider";

type Faq = {
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    question: "Is the first consultation really free, and how do I book it?",
    answer:
      "Yes. Your initial consultation with Pak Law is completely free and carries no obligation. Simply tap “Book Free Consultation”, share a few details about your matter, and a member of our team will reach out to understand your situation and guide you on the best way forward.",
  },
  {
    question: "Can Pak Law help overseas Pakistanis with matters back home?",
    answer:
      "Absolutely. A large part of our practice is dedicated to Pakistanis living abroad. We handle property verification and transfers, inheritance and succession, power of attorney, wills, and family matters on your behalf — so you can protect your interests in Pakistan without needing to travel.",
  },
  {
    question: "Will my case and personal information be kept confidential?",
    answer:
      "Always. Every matter is handled with strict confidentiality and legal privilege. Your information is shared only with the advocates working on your case, and we have earned the trust of leading corporations, media groups, and public figures precisely because discretion is at the heart of how we work.",
  },
  {
    question: "What areas of law does Pak Law handle?",
    answer:
      "As a full-service firm, we advise on litigation, corporate and regulatory matters, public institution complaints, women’s legal rights, and services for local and overseas Pakistanis. If you are unsure which area your matter falls under, book a free consultation and we will point you in the right direction.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { openIntakeModal } = useIntakeModal();

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#05070f] px-4 py-24 sm:px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-brand-600/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full bg-gold-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-6xl -translate-x-1/2 bg-linear-to-r from-transparent via-gold-400/50 to-transparent"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left — intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-sky-400">
            <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
            Need To Know
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-white sm:text-5xl">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">
            Clear answers to the questions clients ask us most. Still unsure?
            Our team is one message away.
          </p>
          <button
            type="button"
            onClick={openIntakeModal}
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-[#328FF8] via-indigo-600 to-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-700/50"
          >
            Book Free Consultation
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </motion.div>

        {/* Right — accordion */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 * i }}
                className={`group relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? "border-gold-400/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b from-gold-400 to-brand-600 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`font-serif text-lg italic transition-colors duration-300 ${
                      isOpen ? "text-gold-300" : "text-slate-500"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base font-semibold tracking-tight text-white sm:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                      isOpen
                        ? "bg-gold-400 text-[#05070f] ring-gold-400"
                        : "bg-white/5 text-slate-300 ring-white/15 group-hover:ring-white/30"
                    }`}
                  >
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pl-16 text-[15px] leading-7 text-slate-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
