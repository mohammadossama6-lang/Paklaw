"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Compass, Globe, Shield, ShieldCheck } from "lucide-react";

import { WhatsappIcon } from "@/components/social-icons";

const ABOUT_TABS = [
  {
    id: "mission",
    label: "Our Mission",
    Icon: Shield,
    body: "PakLaw exists to make quality legal representation reachable for every Pakistani — at home or abroad. We protect and guide people regarding their legal rights, and help them engage effectively with public institutions that too often feel out of reach.",
  },
  {
    id: "approach",
    label: "Our Approach",
    Icon: Compass,
    body: "Every matter is matched to a licensed advocate suited to your case — not a call centre. From there, you deal directly with your lawyer, over WhatsApp or in person, with our team staying involved until it's resolved.",
  },
  {
    id: "reach",
    label: "Our Reach",
    Icon: Globe,
    body: "Our network of registered advocates reaches clients across Pakistan and abroad, so wherever you are and whatever your matter, the right person is already within reach.",
  },
] as const;

const TRUST_POINTS = [
  {
    Icon: ShieldCheck,
    label: "Licensed & Vetted",
    body: "Every advocate is verified before we ever introduce you.",
    accent: "from-brand-700 to-brand-900 shadow-brand-800/40",
  },
  {
    Icon: Clock,
    label: "1 Business Day",
    body: "The average time it takes our team to get back to you.",
    accent: "from-brand-700 to-brand-900 shadow-brand-800/40",
  },
  {
    Icon: WhatsappIcon,
    label: "Direct Access",
    body: "Message your lawyer yourself — no call centre in between.",
    accent: "from-emerald-400 to-emerald-600 shadow-emerald-500/30",
  },
] as const;

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<(typeof ABOUT_TABS)[number]["id"]>("mission");
  const active = ABOUT_TABS.find((tab) => tab.id === activeTab)!;

  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 px-4 py-24 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-96 rounded-full bg-brand-500/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-1/4 size-96 rounded-full bg-gold-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-6xl -translate-x-1/2 bg-linear-to-r from-transparent via-gold-400/70 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
            About PakLaw
            <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-400" />
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-5xl">
            Who We Are
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Pakistan&apos;s No.1 law firm platform — connecting clients directly
            with vetted, licensed advocates, and staying with you from the
            first message to the last hearing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {TRUST_POINTS.map(({ Icon, label, body, accent }) => (
            <div
              key={label}
              className="group rounded-2xl border border-slate-200/70 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/10"
            >
              <span
                className={`mx-auto flex size-11 items-center justify-center rounded-full bg-linear-to-br text-white shadow-md ${accent}`}
              >
                <Icon className="size-5" />
              </span>
              <div className="mt-3 font-serif text-lg italic text-ink">{label}</div>
              <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="flex flex-wrap justify-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
            {ABOUT_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "bg-linear-to-r from-brand-800 via-brand-900 to-indigo-900 text-white shadow-md shadow-brand-900/40"
                    : "text-muted hover:bg-slate-100 hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-3xl bg-ink p-8 shadow-2xl shadow-slate-900/25 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-14 select-none font-serif text-[11rem] italic leading-none text-white/4"
            >
              &rdquo;
            </span>
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-brand-800/25 blur-[100px]"
            />

            <div className="relative flex flex-col items-start gap-5 sm:flex-row">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-300 to-gold-500 text-pine-900 shadow-lg shadow-gold-500/30">
                <active.Icon className="size-5.5" />
              </span>
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-gold-300">
                  {active.label}
                </div>
                <motion.p
                  key={active.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2 font-serif text-lg italic leading-8 text-slate-100 sm:text-xl"
                >
                  {active.body}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
