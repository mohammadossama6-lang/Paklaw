"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

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
    name: "Moeed Pirzada",
    title: "Journalist",
    quote:
      "Barrister Shoaib Razzaq and A.R. & Co. represented me in several highly sensitive and politically motivated matters, including proceedings before the superior courts and representations before state i...",
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
  {
    company: "Senior Journalist",
    name: "Moeed Pirzada",
    title: "Journalist",
    quote:
      "I was represented by Barrister Shoaib Razzaq and A.R. & Co. in multiple high-stakes and politically sensitive matters, spanning litigation before the superior judiciary, proceedings involving state in...",
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
  "from-gold-400 to-gold-600",
  "from-brand-600 to-brand-900",
  "from-emerald-500 to-emerald-700",
  "from-indigo-500 to-indigo-800",
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8fc] px-4 py-24 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 45% at 12% 8%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(ellipse 55% 40% at 88% 15%, rgba(209,175,106,0.14), transparent 60%), radial-gradient(ellipse 60% 45% at 50% 100%, rgba(16,185,129,0.08), transparent 60%)",
        }}
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
            Client Voices
            <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-400" />
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            From national media houses to multinational corporations —
            hear directly from the people PakLaw has stood beside.
          </p>
        </motion.div>

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={`${t.company}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 * (i % 6) }}
                className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accent}`}
                />
                <Quote
                  aria-hidden
                  className="size-7 text-slate-200 transition-colors duration-500 group-hover:text-gold-300"
                />
                <p className="mt-3 text-[15px] leading-7 text-slate-700">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold text-white shadow-md ${accent}`}
                  >
                    {initials(t.name ?? t.company)}
                  </span>
                  <div className="min-w-0">
                    {t.name && (
                      <div className="truncate font-serif text-base italic text-ink">
                        {t.name}
                        {t.title && (
                          <span className="font-sans text-sm not-italic text-muted"> · {t.title}</span>
                        )}
                      </div>
                    )}
                    <div className="truncate text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
