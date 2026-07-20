"use client";

import { motion } from "framer-motion";

// TODO: swap in real client names/logos once the firm shares them — these
// are clearly-labeled placeholders, not real clients, so this section isn't
// deployed with fabricated claims of who PakLaw has worked with.
const ROW_ONE = [
  "Client One",
  "Client Two",
  "Client Three",
  "Client Four",
  "Client Five",
  "Client Six",
];

const ROW_TWO = [
  "Client Seven",
  "Client Eight",
  "Client Nine",
  "Client Ten",
  "Client Eleven",
  "Client Twelve",
];

function MarqueeRow({
  items,
  direction,
  lift = false,
  duration,
}: {
  items: string[];
  direction: "left" | "right";
  lift?: boolean;
  duration: number;
}) {
  const track = [...items, ...items];

  return (
    <div className="group/row relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex w-max items-center gap-10 ${
          direction === "right" ? "animate-marquee-right" : "animate-marquee-left"
        } group-hover/row:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className={`flex h-16 w-40 shrink-0 items-center justify-center rounded-lg px-4 text-center text-base font-semibold text-slate-300 grayscale transition-all duration-300 ease-out hover:text-slate-600 hover:grayscale-0 ${
              lift
                ? "hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-600/10"
                : ""
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsSection() {
  return (
    <div className="relative bg-white">
      <svg
        aria-hidden
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        className="block h-28 w-full sm:h-36"
      >
        <defs>
          <linearGradient
            id="clients-wave-top"
            x1="0"
            y1="0"
            x2="400"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#34d399" />
            <stop offset="0.5" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#328FF8" />
          </linearGradient>
        </defs>
        <path
          d="M0,29 C120,55 280,15 400,34 L400,65 C280,46 120,86 0,60 Z"
          fill="url(#clients-wave-top)"
        />
        <path d="M0,0 L400,0 L400,36 C280,17 120,57 0,31 Z" fill="#05070f" />
      </svg>

      <section className="relative overflow-hidden px-4 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            Together We&apos;ve Built Great Things
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
            Clients We&apos;ve Worked With
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mt-12 flex max-w-5xl flex-col gap-8"
        >
          <MarqueeRow items={ROW_ONE} direction="right" duration={28} />
          <MarqueeRow items={ROW_TWO} direction="left" lift duration={34} />
        </motion.div>
      </section>

      <svg
        aria-hidden
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        className="block h-28 w-full sm:h-36"
      >
        <defs>
          <linearGradient
            id="clients-wave-bottom"
            x1="0"
            y1="0"
            x2="400"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#328FF8" />
            <stop offset="0.5" stopColor="#6366f1" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <path
          d="M0,29 C120,55 280,15 400,34 L400,65 C280,46 120,86 0,60 Z"
          fill="url(#clients-wave-bottom)"
        />
        <path d="M0,0 L400,0 L400,36 C280,17 120,57 0,31 Z" fill="#ffffff" />
      </svg>
    </div>
  );
}
