"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
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
// instead of one repeated treatment across all six.
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

// Same accents as hex, for the SVG connector gradient — each stretch of line
// picks up the color of the card it's leaving, like the reference's
// differently-colored segments, instead of one flat blue-to-gold gradient.
const PRACTICE_AREA_HEX: Record<ServiceKey, string> = {
  "public-institution-complaints": "#6ee7b7",
  "facilitation-center": "#fdba74",
  "overseas-pakistani": "#7dd3fc",
  "regulatory-government": "#e3c98a",
  "women-desk": "#fda4af",
  litigation: "#c4b5fd",
  "due-diligence": "#67e8f9",
  "ip-trademark": "#f0abfc",
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
// Vertical distance from the last card's connector point to the button below
// it, and the flow space reserved after the cards so the absolutely-
// positioned button never overlaps the section that follows.
const BUTTON_GAP = 190;
const SPACER_HEIGHT = 260;

type Point = { x: number; y: number };

const buttonClass =
  "group inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 px-7 py-3.5 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.98]";

/**
 * A practice-area card.
 *
 * This used to run a `useScroll` + `useTransform` pair *per card* — eight
 * scroll subscriptions writing scale and opacity on every frame — and it left
 * every card parked at 45% opacity whenever the JS had not run yet. The accent
 * each area already owns now does the work instead: it tints the icon, blooms
 * behind the top edge and picks out the call to action on hover. Everything
 * here is compositor-only (transform + opacity) and idle until you point at
 * it, so eight cards cost nothing to scroll past.
 */
function PracticeCard({
  option,
  index,
  Icon,
  cardRef,
  openIntakeModal,
}: {
  option: (typeof SERVICE_OPTIONS)[number];
  index: number;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  cardRef: (el: HTMLButtonElement | null) => void;
  openIntakeModal: (preset?: IntakePreset) => void;
}) {
  const key = option.value as ServiceKey;

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => openIntakeModal({ service: key })}
      /* The accent class sits on the root so every `currentColor` below picks
         it up — one source for the icon, the rule, the bloom and the CTA. */
      className={`group relative block w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 text-left transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/8 focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-80 ${PRACTICE_AREA_ACCENTS[key]}`}
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
        className="pointer-events-none absolute -top-1 right-4 select-none font-serif text-6xl font-black italic leading-none text-white/5 transition-colors duration-500 group-hover:text-white/10"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:ring-white/25">
        <span
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
        <Icon className="relative size-5.5" />
      </span>

      <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-white">
        {option.label}
      </h3>
      <p className="relative mt-1.5 text-sm leading-6 text-slate-400">
        {PRACTICE_AREA_DESCRIPTIONS[key]}
      </p>

      {/* Nothing previously said these cards were clickable. Kept legible at
          rest rather than revealed on hover, since a touch device never
          hovers. */}
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 transition-colors duration-300 group-hover:text-current">
        Start your case
        <ArrowRight
          aria-hidden
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}

type Edge = { top: number; bottom: number };

export default function PracticeAreas() {
  const { openIntakeModal } = useIntakeModal();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [trackSize, setTrackSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const nextPoints = cardRefs.current.map((card) => {
        if (!card) return { x: 0, y: 0 };
        const cardRect = card.getBoundingClientRect();
        const isLeft = cardRect.left - trackRect.left < trackRect.width / 2;
        return {
          x: (isLeft ? cardRect.right : cardRect.left) - trackRect.left,
          y: cardRect.top - trackRect.top + cardRect.height / 2,
        };
      });
      const nextEdges = cardRefs.current.map((card) => {
        if (!card) return { top: 0, bottom: 0 };
        const cardRect = card.getBoundingClientRect();
        const top = cardRect.top - trackRect.top;
        return { top, bottom: top + cardRect.height };
      });

      setPoints(nextPoints);
      setEdges(nextEdges);
      setTrackSize({ width: trackRect.width, height: trackRect.height });
    }

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  // Wide sweep (used for the card-to-card connector): each segment swings
  // almost all the way to the track's outer edge before curling back into the
  // next point — a big, lazy loop rather than a tidy lean between the cards.
  function buildWideCurvePath(pts: Point[], trackWidth: number): string {
    return pts.reduce((d, curr, i) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = pts[i - 1];
      const midY = (prev.y + curr.y) / 2;
      const edgeX = curr.x > prev.x ? trackWidth * 0.96 : trackWidth * 0.04;
      const c1x = prev.x + (edgeX - prev.x) * 0.6;
      const c2x = edgeX;
      return `${d} C ${c1x} ${midY}, ${c2x} ${midY}, ${curr.x} ${curr.y}`;
    }, "");
  }

  const lastPoint = points[points.length - 1];
  const endPoint: Point | null = lastPoint
    ? { x: trackSize.width / 2, y: lastPoint.y + BUTTON_GAP }
    : null;

  const zigzagPoints = endPoint ? [...points, endPoint] : points;
  const pathD = buildWideCurvePath(zigzagPoints, trackSize.width);

  // Gradient stops placed at each card's actual position, colored to match
  // that card's accent — so the line's color shifts card by card instead of
  // running one flat gradient top to bottom.
  const gradientStops =
    trackSize.height > 0
      ? SERVICE_OPTIONS.map((option, i) => ({
          offset: (points[i]?.y ?? 0) / trackSize.height,
          color: PRACTICE_AREA_HEX[option.value as ServiceKey],
        })).concat(endPoint ? [{ offset: endPoint.y / trackSize.height, color: "#d4af37" }] : [])
      : [];

  // Mobile: cards stack full-width in one column, so the wide zigzag sweep
  // doesn't apply. Instead, a straight line runs through the GAPS between
  // cards only (never through a card's own body) — one disconnected M/L
  // subpath per gap, still revealed with the same scroll-linked pathLength.
  function buildMobileGapPath(edgs: Edge[], centerX: number): string {
    let d = "";
    for (let i = 0; i < edgs.length - 1; i++) {
      d += ` M ${centerX} ${edgs[i].bottom} L ${centerX} ${edgs[i + 1].top}`;
    }
    return d.trim();
  }

  const mobileCenterX = trackSize.width / 2;
  const mobilePathD = buildMobileGapPath(edges, mobileCenterX);

  const mobileGradientStops =
    trackSize.height > 0
      ? SERVICE_OPTIONS.map((option, i) => ({
          offset: (edges[i]?.top ?? 0) / trackSize.height,
          color: PRACTICE_AREA_HEX[option.value as ServiceKey],
        }))
      : [];

  return (
    <section id="practice-areas" className="relative overflow-hidden bg-[#05070f] px-4 py-16 sm:py-28 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 size-96 rounded-full bg-brand-600/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-gold-400/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl">
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

        <div ref={trackRef} className="relative mt-12 sm:mt-20">
          {pathD && (
            <svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 hidden sm:block"
              width={trackSize.width}
              height={trackSize.height}
              viewBox={`0 0 ${trackSize.width} ${trackSize.height}`}
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient
                  id="practice-zigzag-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={trackSize.height}
                >
                  {gradientStops.map((stop, i) => (
                    <stop key={i} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              </defs>

              {/* dim dotted track, always visible */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1.5}
                strokeDasharray="1 7"
                strokeLinecap="round"
              />

              {/* Wide translucent stroke under the bright line for the neon-tube
                  read. This was the same path pushed through an feGaussianBlur,
                  which the browser had to re-rasterise on every scroll frame
                  because `pathLength` is scroll-linked. A second stroke costs
                  nothing and reads the same at this width. */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#practice-zigzag-gradient)"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.22}
                style={{ pathLength: scrollYProgress }}
              />

              {/* gradient zigzag that draws in as you scroll */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#practice-zigzag-gradient)"
                strokeWidth={2}
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />

              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth={1.5}
                    className="animate-ping-ring"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <circle cx={p.x} cy={p.y} r={5} fill="#d4af37" className="drop-shadow-[0_0_6px_rgba(212,175,55,0.7)]" />
                </g>
              ))}
            </svg>
          )}

          {mobilePathD && (
            <svg
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 block sm:hidden"
              width={trackSize.width}
              height={trackSize.height}
              viewBox={`0 0 ${trackSize.width} ${trackSize.height}`}
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient
                  id="practice-mobile-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={trackSize.height}
                >
                  {mobileGradientStops.map((stop, i) => (
                    <stop key={i} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              </defs>

              {/* dim dotted track, always visible */}
              <path
                d={mobilePathD}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={1.5}
                strokeDasharray="1 6"
                strokeLinecap="round"
              />

              {/* Wide translucent stroke under the bright line — see the desktop
                  track above for why this is not an feGaussianBlur. */}
              <motion.path
                d={mobilePathD}
                fill="none"
                stroke="url(#practice-mobile-gradient)"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.22}
                style={{ pathLength: scrollYProgress }}
              />

              {/* gradient line that draws in as you scroll */}
              <motion.path
                d={mobilePathD}
                fill="none"
                stroke="url(#practice-mobile-gradient)"
                strokeWidth={2}
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />

              {edges.map((edge, i) => (
                <g key={i}>
                  <circle
                    cx={mobileCenterX}
                    cy={edge.top}
                    r={4}
                    fill="none"
                    stroke={PRACTICE_AREA_HEX[SERVICE_OPTIONS[i].value as ServiceKey]}
                    strokeWidth={1.5}
                    className="animate-ping-ring"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <circle
                    cx={mobileCenterX}
                    cy={edge.top}
                    r={4}
                    fill={PRACTICE_AREA_HEX[SERVICE_OPTIONS[i].value as ServiceKey]}
                    className="drop-shadow-[0_0_6px_rgba(209,175,106,0.7)]"
                  />
                </g>
              ))}
            </svg>
          )}

          <div className="space-y-10 sm:space-y-14">
            {SERVICE_OPTIONS.map((option, i) => {
              const Icon = PRACTICE_AREA_ICONS[option.value as ServiceKey];
              const isEven = i % 2 === 0;
              return (
                <div
                  key={option.value}
                  className={`animate-reveal relative flex sm:items-center ${isEven ? "sm:justify-start" : "sm:justify-end"}`}
                >
                  <PracticeCard
                    option={option}
                    index={i}
                    Icon={Icon}
                    openIntakeModal={openIntakeModal}
                    cardRef={(el) => {
                      cardRefs.current[i] = el;
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* reserved flow space for the absolutely-positioned button + its trailing line */}
          <div aria-hidden style={{ height: SPACER_HEIGHT }} className="hidden sm:block" />

          {/* mobile: no zigzag line, just the button in normal flow */}
          <div className="mt-12 flex justify-center sm:hidden">
            <a href={WHATSAPP_PRIMARY_HREF} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              <WhatsappIcon className="size-4" />
              WhatsApp Us
            </a>
          </div>

          {endPoint && (
            <div
              className="absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block"
              style={{ left: endPoint.x, top: endPoint.y }}
            >
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
          )}
        </div>
      </div>
    </section>
  );
}
