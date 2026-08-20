"use client";

import {
  ArrowRight,
  Building2,
  Copyright,
  FileSearch,
  Gavel,
  HeartHandshake,
  Landmark,
  Plane,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { SERVICE_OPTIONS, WHATSAPP_PRIMARY_HREF } from "@/lib/constants";
import type { ServiceKey } from "@/lib/schema";
import { WhatsappIcon } from "@/components/social-icons";
import { useIntakeModal, type IntakePreset } from "@/components/intake-modal-provider";

const PRACTICE_AREA_ICONS: Record<ServiceKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  "public-institution-complaints": Landmark,
  "facilitation-center": Building2,
  "overseas-pakistani": Plane,
  "regulatory-government": ShieldCheck,
  "women-desk": HeartHandshake,
  litigation: Gavel,
  "due-diligence": FileSearch,
  "ip-trademark": Copyright,
};

// A distinct accent per card, echoing the reference's varied icon colors
// instead of one repeated treatment across all eight.
const PRACTICE_AREA_ACCENTS: Record<ServiceKey, string> = {
  "public-institution-complaints": "text-emerald-300",
  "facilitation-center": "text-orange-300",
  "overseas-pakistani": "text-sky-300",
  "regulatory-government": "text-gold-300",
  "women-desk": "text-rose-300",
  litigation: "text-violet-300",
  "due-diligence": "text-cyan-300",
  "ip-trademark": "text-fuchsia-300",
};

const PRACTICE_AREA_DESCRIPTIONS: Record<ServiceKey, string> = {
  "public-institution-complaints":
    "Filing complaints with CDA, NADRA, FBR, PTA and other public bodies.",
  "facilitation-center":
    "Business registration, licensing, tax filing, and documentation support.",
  "overseas-pakistani":
    "Property, inheritance, wills and family law support for Pakistanis at home and abroad.",
  "regulatory-government":
    "Resolving regulatory delays and disputes with government departments.",
  "women-desk": "custody, maintenance and protection matters for women etc...",
  litigation: "Civil litigation, arbitration, and constitutional petitions.",
  "due-diligence":
    "Title, corporate and background verification before you invest or sign.",
  "ip-trademark":
    "Trademark and copyright registration, protection and enforcement.",
};

const buttonClass =
  "group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 px-7 py-3.5 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.98]";

/**
 * A practice-area card.
 *
 * The accent each area owns does all the decorative work: it tints the icon,
 * blooms behind the top edge and picks out the call to action on hover.
 * Everything here is compositor-only (transform + opacity) and idle until you
 * point at it, so eight cards cost nothing to scroll past.
 */
function PracticeCard({
  option,
  index,
  Icon,
  openIntakeModal,
}: {
  option: (typeof SERVICE_OPTIONS)[number];
  index: number;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  openIntakeModal: (preset?: IntakePreset) => void;
}) {
  const key = option.value as ServiceKey;

  return (
    <button
      type="button"
      onClick={() => openIntakeModal({ service: key })}
      /* The accent class sits on the root so every `currentColor` below picks
         it up — one source for the icon, the rule, the bloom and the CTA. */
      className={`group animate-reveal relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-4 text-left sm:p-6 transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/8 focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${PRACTICE_AREA_ACCENTS[key]}`}
    >
      {/* accent bloom behind the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(60% 100% at 50% 0%, currentColor, transparent 72%)",
        }}
      />
      {/* accent hairline along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-80"
      />
      {/* oversized ghost numeral, echoing the About cards */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1 right-3 select-none font-serif text-4xl font-black italic leading-none text-white/5 transition-colors duration-500 group-hover:text-white/10 sm:right-4 sm:text-6xl"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:ring-white/25 sm:size-12">
        <span
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
        <Icon className="relative size-4.5 sm:size-5.5" />
      </span>

      <h3 className="relative mt-3 text-sm font-semibold tracking-tight text-white sm:mt-4 sm:text-lg">
        {option.label}
      </h3>
      <p className="relative mt-1 line-clamp-4 text-xs leading-5 text-slate-400 sm:mt-1.5 sm:line-clamp-none sm:text-sm sm:leading-6">
        {PRACTICE_AREA_DESCRIPTIONS[key]}
      </p>

      {/* `mt-auto` pins this to the bottom so the label sits on one line across
          a row of cards whose descriptions differ in length. Kept legible at
          rest rather than revealed on hover, since a touch device never
          hovers. */}
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 transition-colors duration-300 group-hover:text-current sm:pt-5 sm:text-[11px] sm:tracking-[0.14em]">
        Start your case
        <ArrowRight
          aria-hidden
          className="size-3 transition-transform duration-300 group-hover:translate-x-1 sm:size-3.5"
        />
      </span>
    </button>
  );
}

/**
 * Practice areas.
 *
 * This used to lay the cards out in an alternating zigzag joined by an SVG
 * connector. Drawing that line meant measuring every card with
 * `getBoundingClientRect` in an effect, holding the results in state, and
 * redoing all of it through a `ResizeObserver` on every resize — then emitting
 * ~44 paths and a gradient whose stops were positioned from those
 * measurements. The WhatsApp button hung off the end of the line, absolutely
 * positioned from the same numbers, above a 212px spacer reserved to stop it
 * overlapping the next section.
 *
 * None of that survives here. The cards are a plain CSS grid and the button
 * sits in normal flow, so the section renders from HTML and CSS alone with no
 * measurement, no layout thrash on resize, and nothing that can put the button
 * in the wrong place on a slow device.
 */
export default function PracticeAreas() {
  const { openIntakeModal } = useIntakeModal();

  return (
    <section
      id="practice-areas"
      className="relative overflow-hidden bg-[#05070f] px-4 py-16 sm:px-6 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-64 left-[calc(25%-8rem)] size-160"
            style={{
              backgroundImage:
                "radial-gradient(closest-side, rgba(37,99,235,0.25), transparent)",
            }}
            />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 right-[calc(25%-8rem)] size-160"
            style={{
              backgroundImage:
                "radial-gradient(closest-side, rgba(212,175,55,0.10), transparent)",
            }}
            />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-sky-400">
            What We Do
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-white sm:text-4xl">
            Practice Areas
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            We are also a full-service legal advisory firm known for
            fearless advocacy and strategic legal excellence  providing
            comprehensive services in litigation, corporate advisory,
            regulatory compliance, and public authority matters.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 lg:grid-cols-4">
          {SERVICE_OPTIONS.map((option, i) => (
            <PracticeCard
              key={option.value}
              option={option}
              index={i}
              Icon={PRACTICE_AREA_ICONS[option.value as ServiceKey]}
              openIntakeModal={openIntakeModal}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <a
            href={WHATSAPP_PRIMARY_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={`animate-reveal ${buttonClass}`}
          >
            <WhatsappIcon className="size-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
