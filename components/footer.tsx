import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { SOCIAL_LINKS, WhatsappIcon } from "@/components/social-icons";
import { CONTACT, WHATSAPP_PRIMARY_HREF } from "@/lib/constants";

const COLUMN_ONE = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#contact" },
  { label: "Contact Us", href: "#footer" },
];
const COLUMN_TWO = [
  { label: "Practice Areas", href: "#practice-areas" },
  { label: "FAQ", href: "#faq" },
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
              alt="Pak Law"
              width={612}
              height={511}
              className="size-9 object-contain sm:size-10"
            />
            <span className="flex flex-col leading-none">
              <span className="font-lora text-lg font-semibold uppercase tracking-tight text-ink sm:text-xl">
                Pak Law
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
                target="_blank"
                rel="noopener noreferrer"
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
            href={WHATSAPP_PRIMARY_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${CONTACT.phonePrimary}`}
            className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-brand-600"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <WhatsappIcon className="size-3.5" />
            </span>
            <span className="flex items-center gap-2">
              {CONTACT.phonePrimary}
              <span className="rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-600">
                Primary
              </span>
            </span>
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

      <div className="relative mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {year} Pak Law. All rights reserved.</span>
        {/* -my-2 py-2 gives these a finger-sized hit area on touch without
            adding visible height to the footer bar — at 16px tall they were
            well under the 44px guideline. */}
        <div className="-my-2 flex items-center gap-4">
          <Link href="/terms" className="py-2 transition-colors hover:text-brand-600">
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy" className="py-2 transition-colors hover:text-brand-600">
            Privacy Policy
          </Link>
          <span className="hidden font-serif italic text-slate-400 lg:inline">
            Your Rights. Our Priority.
          </span>
        </div>
      </div>
    </footer>
  );
}
