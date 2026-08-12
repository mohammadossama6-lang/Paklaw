"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Quote } from "lucide-react";

type Testimonial = {
  company: string;
  name?: string;
  title?: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    company: "ARY Communications (Pvt) Ltd",
    name: "Amad Yousuf",
    title: "CEO",
    quote:
      "During a time of political unrest our institution, ARY Communications PVT LTD, and our valued employees and prominent journalists, such as Arshad Sharif, Kashif Abbasi, Khawar Ghuman etc, had fallen v...",
  },
  {
    company: "China National Petroleum Company (CNPC)",
    name: "Houliang Dai",
    title: "Executive Chairman",
    quote:
      "We are a Chinese Petroleum Company; we had been engaged by Pakistan to provide Drilling services to tap into the natural resources of Pakistan. During the course of carrying out our obligations, we we...",
  },
  {
    company: "Senior Journalist",
    name: "Sabir Shakir",
    title: "Journalist",
    quote:
      "I engaged Barrister Shoaib Razzaq and A.R. & Co. in several highly sensitive and politically charged legal matters, including proceedings before the superior courts, representations before state insti...",
  },
  {
    company: "Senior Journalist",
    name: "Hamid Mir",
    title: "Journalist",
    quote:
      "I have great respect for barrister Shoaib. Whensoever I have found myself in a situation where I need his help, he always delivered. He has great understanding of the law, situational awareness and so...",
  },
  {
    company: "David Game College London",
    name: "David Game",
    title: "Director",
    quote:
      "I was faced with a situation where my intellectual property was being unlawfully used, and my rights were being infringed with no apparent remedy. I approached A.R.& Co., who acted promptly and strate...",
  },
  {
    company: "Easy Home Movers, UAE",
    name: "Dr. Dosist",
    quote:
      "A.R. & Co. was an effective advocate for us. Together, we achieved a rapid, successful transaction that served both the seller's interests and our own, with an exceptional level of skill and professio...",
  },
  {
    company: "Safa Gold Mall",
    quote:
      "A.R. & Co. has been our go to law firm for nearly a decade, they handle all our legal matters, whether it be dealing with regulatory authorities, tenants or internal corporate matters. Their work has ...",
  },
  {
    company: "Centaurus Mall",
    quote:
      "Barrister Shoaib Razzaq represented us during the inception of our business venture, He and along with his team represented our interests before different regulatory institutions and negotiated on our...",
  },
  {
    company: "KMS (Pvt) LTD",
    name: "Saqib Saffdar",
    quote:
      "In a complex dispute over the NPT Building in F-8 involving multiple partners, the firm represented us with exceptional precision and authority. Their handling of the suit for specific performance, de...",
  },
  {
    company: "Senior Journalist",
    name: "Akbar Hussain",
    title: "Journalist",
    quote:
      "Barrister Shoaib Razzaq and A.R. & Co. represented me in several complex and sensitive legal matters, including proceedings before the superior courts, engagements with state authorities, and cases be...",
  },
];

function initials(text: string) {
  const cleaned = text.replace(/\(.*?\)/g, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const ACCENTS = [
  { bar: "from-gold-400 to-gold-600", ring: "ring-gold-400/30", text: "text-gold-500", tint: "from-amber-50" },
  { bar: "from-brand-600 to-brand-900", ring: "ring-brand-500/30", text: "text-brand-600", tint: "from-brand-50" },
  { bar: "from-emerald-500 to-emerald-700", ring: "ring-emerald-500/30", text: "text-emerald-600", tint: "from-emerald-50" },
  { bar: "from-indigo-500 to-indigo-800", ring: "ring-indigo-500/30", text: "text-indigo-600", tint: "from-indigo-50" },
];

/**
 * How many bars to show on a phone before the "show more" button. All twelve
 * stacked ran to roughly four and a half screens, burying the FAQ and footer
 * beneath them. Desktop lays them out far more compactly, so the cap is
 * mobile-only — from `sm` up every testimonial renders as before.
 */
const MOBILE_VISIBLE = 4;

export default function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);
  const hiddenOnMobile = TESTIMONIALS.length - MOBILE_VISIBLE;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#f7f8fc] px-4 py-14 sm:py-24 sm:px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 45% at 12% 8%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(ellipse 55% 40% at 88% 15%, rgba(209,175,106,0.14), transparent 60%), radial-gradient(ellipse 60% 45% at 50% 100%, rgba(16,185,129,0.08), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
            Testimonials
            <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-400" />
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            From national media houses to multinational corporations —
            hear directly from the people Pak Law has stood beside.
          </p>
        </motion.div>

        {/* Horizontal testimonial bars — the client's name sits prominently on
            the left panel, with their words running alongside it. */}
        <div className="mt-10 sm:mt-14 flex flex-col gap-4">
          {TESTIMONIALS.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const label = t.name ?? t.company;
            return (
              <motion.article
                key={`${t.company}-${i}`}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.04 * (i % 6) }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-transparent hover:shadow-xl sm:flex-row ${
                  // Hidden on mobile until expanded; always visible from sm up.
                  i >= MOBILE_VISIBLE && !showAll ? "hidden sm:flex" : ""
                }`}
              >
                {/* prominent accent bar running down the left edge */}
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1.5 bg-linear-to-b ${accent.bar}`}
                />

                {/* name panel */}
                <div
                  className={`relative flex shrink-0 items-center gap-4 bg-linear-to-r ${accent.tint} to-transparent py-5 pl-7 pr-6 sm:w-72 sm:flex-col sm:items-start sm:justify-center sm:gap-3`}
                >
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-md ring-4 ${accent.bar} ${accent.ring}`}
                  >
                    {initials(label)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-serif text-xl italic leading-tight tracking-tight text-ink sm:text-2xl">
                      {t.name ?? t.company}
                    </div>
                    <div
                      className={`mt-1 text-[11px] font-bold uppercase tracking-[0.12em] ${accent.text}`}
                    >
                      {t.name ? [t.title, t.company].filter(Boolean).join(" · ") : "Client"}
                    </div>
                  </div>
                </div>

                {/* the words */}
                <div className="relative flex flex-1 items-center border-t border-slate-100 px-7 py-5 sm:border-l sm:border-t-0">
                  <Quote
                    aria-hidden
                    className="absolute -top-1 left-5 size-8 text-slate-100 transition-colors duration-500 group-hover:text-gold-200 sm:left-6"
                  />
                  <p className="relative text-[15px] leading-7 text-slate-700">
                    {t.quote}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile only — desktop already shows every bar without the scroll cost. */}
        {!showAll && hiddenOnMobile > 0 && (
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              Read {hiddenOnMobile} more testimonials
              <ChevronDown aria-hidden className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
