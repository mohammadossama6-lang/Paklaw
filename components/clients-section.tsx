"use client";

import Image from "next/image";
import { motion } from "framer-motion";
const ROW_ONE = [
  { name: "MCB Bank", src: "/clients/mcb.webp" },
  { name: "ARY News", src: "/clients/ary-news.webp" },
  { name: "Audi", src: "/clients/audi.png" },
  { name: "NITB", src: "/clients/nitb.png" },
  { name: "PTCL", src: "/clients/ptcl.webp" },
  { name: "Askari Bank", src: "/clients/askari-bank.webp" },
  { name: "BOL News", src: "/clients/bol-news.webp" },
];
const ROW_TWO = [
  { name: "Ufone", src: "/clients/ufone.webp" },
  { name: "Ten Sports", src: "/clients/ten-sports.webp" },
  { name: "Quaid-i-Azam University", src: "/clients/qau.webp" },
  { name: "Tullow Oil", src: "/clients/tullow.webp" },
  { name: "Westminster Academy", src: "/clients/westminster.webp" },
  { name: "DHA", src: "/clients/dha.webp" },
];

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: { name: string; src: string }[];
  direction: "left" | "right";
  duration: number;
}) {
  const track = [...items, ...items];

  return (
    <div className="group/row relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max items-center gap-7 ${
          direction === "right" ? "animate-marquee-right" : "animate-marquee-left"
        } group-hover/row:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map(({ name, src }, i) => (
          <div
            key={`${name}-${i}`}
            className="group/card relative flex h-24 w-44 shrink-0 items-center justify-center"
          >
            <Image
              src={src}
              alt={name}
              fill
              sizes="176px"
              className="object-contain grayscale opacity-50 transition-all duration-500 ease-out group-hover/card:scale-110 group-hover/card:opacity-100 group-hover/card:grayscale-0"
            />
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

      <section className="relative overflow-hidden bg-slate-50/60 px-4 pb-14 pt-3 sm:px-6 sm:pb-16 sm:pt-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-brand-500/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-gold-400/15 blur-[120px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto max-w-xl text-center"
        >
          <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
            Together We&apos;ve Built Great Things
            <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-400" />
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
            Clients We&apos;ve Worked With
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            From national broadcasters and banks to global energy leaders and
            universities — organizations across Pakistan and abroad trust
            Pak Law with matters that matter.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto mt-10 sm:mt-14 flex max-w-5xl flex-col gap-8"
        >
          <MarqueeRow items={ROW_ONE} direction="right" duration={32} />
          <MarqueeRow items={ROW_TWO} direction="left" duration={30} />
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

