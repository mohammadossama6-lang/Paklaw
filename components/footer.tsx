import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { SOCIAL_LINKS } from "@/components/social-icons";
import { CONTACT } from "@/lib/constants";

const COLUMN_ONE = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#contact" },
  { label: "Contact Us", href: "#footer" },
];
// TODO: wire these up once the corresponding pages/sections exist.
const COLUMN_TWO = [
  { label: "Practice Areas", href: "#practice-areas" },
  { label: "FAQ", href: "#" },
  { label: "Resources", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="animate-fade-in-up relative overflow-hidden bg-slate-50 px-6 pb-10 pt-16 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-400/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-indigo-200/50 via-rose-200/30 to-transparent blur-2xl"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
          <Link href="#home" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="PakLaw"
              width={612}
              height={511}
              className="size-9 object-contain sm:size-10"
            />
            <span className="flex flex-col leading-none">
              <span className="font-lora text-lg font-semibold uppercase tracking-tight text-ink sm:text-xl">
                PakLaw
              </span>
              <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.25em] text-muted">
                Advocates &amp; Legal Counsel
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-md hover:ring-brand-200"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Firm
          </span>
          {COLUMN_ONE.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="-my-1.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Learn More
          </span>
          {COLUMN_TWO.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="-my-1.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Get In Touch
          </span>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-brand-600"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Mail className="size-3.5" />
            </span>
            {CONTACT.email}
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
            className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-brand-600"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Phone className="size-3.5" />
            </span>
            {CONTACT.phone}
          </a>
          <div className="flex items-start gap-3 text-sm text-muted">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
              <MapPin className="size-3.5" />
            </span>
            <span className="pt-1.5">
              {CONTACT.address[0]}
              <br />
              {CONTACT.address[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-slate-200 pt-6 text-xs text-muted">
        <span>© {year} PakLaw. All rights reserved.</span>
        <span className="hidden font-serif italic text-slate-400 sm:inline">
          Your Rights. Our Priority.
        </span>
      </div>
    </footer>
  );
}
