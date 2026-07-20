"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

import { CONTACT } from "@/lib/constants";
import { WhatsappIcon } from "@/components/social-icons";

const WHATSAPP_HREF = "https://wa.me/923035521111";

const CONTACT_CARDS = [
  {
    Icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    Icon: Phone,
    label: "Phone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/\s+/g, "")}`,
  },
  {
    Icon: WhatsappIcon,
    label: "WhatsApp",
    value: "Message us directly",
    href: WHATSAPP_HREF,
    external: true,
  },
  {
    Icon: MapPin,
    label: "Office",
    value: CONTACT.address.join(", "),
    href: undefined,
  },
] as const;

export default function ContactSection() {
  return (
    <section id="contact-us" className="relative overflow-hidden bg-white px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            Get In Touch
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Prefer to reach out directly instead of filling out the form?
            Here&apos;s every way to find us.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ Icon, label, value, href, ...rest }, i) => {
            const external = "external" in rest && rest.external;
            const Wrapper = href ? "a" : "div";
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              >
                <Wrapper
                  {...(href
                    ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
                    : {})}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-xl hover:shadow-gold-500/10"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-50 to-gold-200/40 text-brand-700 transition-colors duration-300 group-hover:from-brand-600 group-hover:to-brand-700 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-muted">{label}</div>
                    <div className="mt-1 text-sm font-medium text-ink">{value}</div>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
