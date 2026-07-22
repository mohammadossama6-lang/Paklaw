"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Building2, Gavel, HeartHandshake, Landmark, Plane, ShieldCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { SERVICE_OPTIONS } from "@/lib/constants";
import type { ServiceKey } from "@/lib/schema";
import { WhatsappIcon } from "@/components/social-icons";
import { useIntakeModal } from "@/components/intake-modal-provider";

const WHATSAPP_HREF = "https://wa.me/923035521111";

const PRACTICE_AREA_ICONS: Record<ServiceKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  "public-institution-complaints": Landmark,
  "facilitation-center": Building2,
  "overseas-pakistani": Plane,
  "regulatory-government": ShieldCheck,
  "women-desk": HeartHandshake,
  litigation: Gavel,
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
};

const PRACTICE_AREA_DESCRIPTIONS: Record<ServiceKey, string> = {
  "public-institution-complaints":
    "Filing complaints with CDA, NADRA, FBR, PTA and other public bodies.",
  "facilitation-center":
    "Business registration, licensing, tax filing, and documentation support.",
  "overseas-pakistani":
    "Property, inheritance, and family law support for Pakistanis living abroad.",
  "regulatory-government":
    "Resolving regulatory delays and disputes with government departments.",
  "women-desk": "custody, maintenance and protection matters for women etc...",
  litigation: "Civil litigation, arbitration, and constitutional petitions.",
};
// Vertical distance from the last card's connector point to the button below
// it, and the flow space reserved after the cards so the absolutely-
// positioned button never overlaps the section that follows.
const BUTTON_GAP = 190;
const SPACER_HEIGHT = 260;

type Point = { x: number; y: number };

const buttonClass =
  "group inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 px-7 py-3.5 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/50 hover:brightness-105 active:scale-[0.98]";

// Scroll-linked zoom: as a card travels through the viewport it grows to a
// peak scale/opacity around the midpoint, then eases back down as the next
// card takes over — layered on top of the existing one-time fade-up entrance
// below, not replacing it.
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
  openIntakeModal: () => void;
}) {
  const localRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1.14, 0.86]);
  const zoomOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 1, 0.45]);

  return (
    <motion.button
      ref={(el) => {
        localRef.current = el;
        cardRef(el);
      }}
      type="button"
      onClick={openIntakeModal}
      style={{ scale, opacity: zoomOpacity }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative block w-full max-w-sm rounded-2xl border border-white/10 bg-white/3 p-6 text-left backdrop-blur-sm transition-colors duration-300 hover:border-gold-400/40 hover:bg-white/6 sm:w-80"
    >
      <span
        aria-hidden
        className={`absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#05070f] font-serif text-sm italic ring-1 ring-white/10 ${PRACTICE_AREA_ACCENTS[option.value as ServiceKey]}`}
      >
        {index + 1}
      </span>
      <span
        className={`relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105 ${PRACTICE_AREA_ACCENTS[option.value as ServiceKey]}`}
      >
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
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
        {option.label}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-slate-400">
        {PRACTICE_AREA_DESCRIPTIONS[option.value as ServiceKey]}
      </p>
    </motion.button>
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
    <section id="practice-areas" className="relative overflow-hidden bg-[#05070f] px-4 py-28 sm:px-6">
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
            Pakistan&apos;s leading legal platform, offering a Facilitation
            Center where we help raise your concerns with public
            institutions.
          </p>
          <p className="mt-3 text-base leading-7 text-slate-400">
            We are also a full-service legal advisory firm known for
            fearless advocacy and strategic legal excellence  providing
            comprehensive services in litigation, corporate advisory,
            regulatory compliance, and public authority matters.
          </p>
        </div>

        <div ref={trackRef} className="relative mt-20">
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
                <filter id="practice-zigzag-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
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

              {/* soft blurred halo behind the bright line, for a neon-tube glow */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#practice-zigzag-gradient)"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.5}
                filter="url(#practice-zigzag-blur)"
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
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth={1.5}
                    animate={{ r: [5, 13, 5], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
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
                <filter id="practice-mobile-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
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

              {/* soft blurred halo behind the bright line */}
              <motion.path
                d={mobilePathD}
                fill="none"
                stroke="url(#practice-mobile-gradient)"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.5}
                filter="url(#practice-mobile-blur)"
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
                  <motion.circle
                    cx={mobileCenterX}
                    cy={edge.top}
                    r={4}
                    fill="none"
                    stroke={PRACTICE_AREA_HEX[SERVICE_OPTIONS[i].value as ServiceKey]}
                    strokeWidth={1.5}
                    animate={{ r: [4, 11, 4], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
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

          <div className="space-y-16 sm:space-y-14">
            {SERVICE_OPTIONS.map((option, i) => {
              const Icon = PRACTICE_AREA_ICONS[option.value as ServiceKey];
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`relative flex sm:items-center ${isEven ? "sm:justify-start" : "sm:justify-end"}`}
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
                </motion.div>
              );
            })}
          </div>

          {/* reserved flow space for the absolutely-positioned button + its trailing line */}
          <div aria-hidden style={{ height: SPACER_HEIGHT }} className="hidden sm:block" />

          {/* mobile: no zigzag line, just the button in normal flow */}
          <div className="mt-12 flex justify-center sm:hidden">
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              <WhatsappIcon className="size-4" />
              WhatsApp Us
            </a>
          </div>

          {endPoint && (
            <div
              className="absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block"
              style={{ left: endPoint.x, top: endPoint.y }}
            >
              <motion.a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={buttonClass}
              >
                <WhatsappIcon className="size-4" />
                WhatsApp Us
              </motion.a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
