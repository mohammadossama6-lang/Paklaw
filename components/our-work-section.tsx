"use client";

import { useState } from "react";
import { Briefcase, Building2, ChevronDown, Gavel, Landmark, Scale, ShieldCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type WorkItem = {
  title: string;
  category: string;
  client: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const WORK_ITEMS: WorkItem[] = [
  {
    title: "Defending Press Freedom During Political Unrest",
    category: "Media & Constitutional Law",
    client: "ARY Communications (Pvt) Ltd",
    description:
      "Represented ARY Communications and its journalists through a period of escalating political unrest, defending the network's editorial independence and safeguarding its staff.",
    Icon: ShieldCheck,
  },
  {
    title: "Advising CNPC on Drilling Operations in Pakistan",
    category: "Business & Regulatory",
    client: "China National Petroleum Company (CNPC)",
    description:
      "Provided legal and regulatory counsel to CNPC as it carried out drilling operations to help tap into Pakistan's natural resources.",
    Icon: Landmark,
  },
  {
    title: "Halting Unlawful Use of Intellectual Property",
    category: "Intellectual Property",
    client: "David Game College London",
    description:
      "Moved quickly to stop the unlawful use of the client's intellectual property, securing an effective and strategic remedy.",
    Icon: Scale,
  },
  {
    title: "Resolving a Multi-Partner Dispute Over the NPT Building, F-8",
    category: "Civil Litigation",
    client: "KMS (Pvt) Ltd",
    description:
      "Represented KMS in a specific-performance suit arising from a complex ownership dispute among multiple partners in a commercial building in F-8, Islamabad.",
    Icon: Gavel,
  },
  {
    title: "Long-Term Corporate & Regulatory Counsel",
    category: "Corporate Advisory",
    client: "Safa Gold Mall",
    description:
      "Serving as the mall's trusted legal advisor for nearly a decade, handling matters spanning regulatory authorities, tenants, and internal corporate affairs.",
    Icon: Building2,
  },
  {
    title: "Structuring a New Business Venture from Inception",
    category: "Corporate & Regulatory",
    client: "Centaurus Mall",
    description:
      "Guided the client through regulatory approvals and negotiations with public institutions during the founding of their business venture.",
    Icon: Briefcase,
  },
];

/**
 * Cards shown on a phone before the "view more" button. The grid is one column
 * on mobile, so all six ran to nearly three screens; from sm up it is two or
 * three columns and every card renders without the scroll cost.
 */
const MOBILE_VISIBLE = 3;

export default function OurWorkSection() {
  const [showAll, setShowAll] = useState(false);
  const hiddenOnMobile = WORK_ITEMS.length - MOBILE_VISIBLE;

  return (
    <section className="relative overflow-hidden bg-[#05070f] px-4 py-16 sm:py-28 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 size-96 rounded-full bg-gold-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-brand-500/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="animate-reveal mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-sky-400">
            Our Work
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-white sm:text-4xl">
            Matters We&apos;re Proud Of
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            A selection of the work behind the testimonials — real matters
            handled for real clients, across media, business, and civil
            litigation.
          </p>
        </div>

        <div className="mx-auto mt-10 sm:mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_ITEMS.map(({ title, category, client, description, Icon }, i) => (
            <div
              key={title}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`animate-reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/6 ${
                // Hidden on mobile until expanded; always visible from sm up.
                i >= MOBILE_VISIBLE && !showAll ? "hidden sm:flex" : ""
              }`}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-gold-400 via-brand-600 to-indigo-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/5 text-gold-300 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                <Icon className="size-5" />
              </span>
              <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-400">
                {category}
              </span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
              <span className="mt-auto pt-5 text-xs font-bold uppercase tracking-widest text-slate-500">
                {client}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile only — from sm up the grid shows every card without the scroll cost. */}
        {!showAll && hiddenOnMobile > 0 && (
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-gold-400/40 hover:bg-white/10"
            >
              View {hiddenOnMobile} more matters
              <ChevronDown aria-hidden className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
