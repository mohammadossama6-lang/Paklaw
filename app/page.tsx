import { ArrowRight, Landmark, Shield } from "lucide-react";

import Footer from "@/components/footer";
import AboutSection from "@/components/about-section";
import PracticeAreas from "@/components/practice-areas";
import OurWorkSection from "@/components/our-work-section";
import ClientsSection from "@/components/clients-section";
import TestimonialsSection from "@/components/testimonials-section";
import FaqSection from "@/components/faq-section";
import { SOCIAL_LINKS, WhatsappIcon } from "@/components/social-icons";
import { WHATSAPP_PRIMARY_HREF } from "@/lib/constants";

const TRUST_POINTS = [
  {
    Icon: Shield,
    text: "Protecting and guiding people regarding their legal rights",
  },
  {
    Icon: Landmark,
    text: "Helping people engage effectively with public institution",
  },
];

export default function Home() {
  return (
    <>
      <div
        id="home"
        className="bg-star-field relative flex flex-1 flex-col overflow-hidden px-4 py-28 font-sans sm:py-36"
      >
        {/* ambient glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/3 size-96 rounded-full bg-indigo-500/20 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-sky-500/15 blur-[110px]"
        />

        <div className="pointer-events-none absolute inset-y-0 right-4 z-10 hidden items-center sm:right-6 lg:flex">
          <div
            style={{ animationDelay: "900ms" }}
            className="animate-fade-in pointer-events-auto flex flex-col items-center gap-5"
          >
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-md shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-115 hover:rotate-6 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/40"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <main className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-10 text-left">
          <div className="max-w-xl">
            <span className="animate-fade-in-up inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-sky-400">
              <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
              Pakistan&apos;s Trusted Legal Advisory
            </span>
            <h1
              style={{ animationDelay: "220ms" }}
              className="animate-fade-in-up mt-3 text-5xl uppercase leading-[1.05] tracking-tight text-white sm:text-6xl"
            >
              <span className="font-serif italic">Your Rights.</span>
              <br />
              <span className="bg-linear-to-r from-brand-500 to-sky-400 bg-clip-text font-sans font-extrabold text-transparent">
                Our Priority.
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-5">
              {TRUST_POINTS.map(({ Icon, text }, i) => (
                <div
                  key={text}
                  style={{ animationDelay: `${460 + i * 200}ms` }}
                  className="animate-fade-in-up flex items-center justify-start gap-4"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#328FF8] text-white shadow-lg shadow-[#328FF8]/40">
                    <Icon className="size-5" />
                  </span>
                  <p className="max-w-xs text-left text-lg leading-7 text-slate-200">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_PRIMARY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: "860ms" }}
              className="animate-fade-in-up group relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/5 py-2.5 pl-2.5 pr-6 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-white/10 hover:shadow-emerald-500/20"
            >
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60"
                />
                <WhatsappIcon className="relative size-5" />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                  Chat with us now
                </span>
                <span className="text-sm font-bold text-white transition-all duration-300 group-hover:tracking-wide">
                  Message us on WhatsApp
                </span>
              </span>
              <ArrowRight className="ml-1 size-4 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/4 translate-x-[-150%] -skew-x-12 bg-white/10 blur-[2px] transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
              />
            </a>
          </div>

          <div id="contact" style={{ animationDelay: "360ms" }} className="animate-fade-in-up">
            <div className="flex items-center justify-start gap-3 lg:hidden">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-md shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-115 hover:rotate-6 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/40"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
      <AboutSection />
      <PracticeAreas />
      <OurWorkSection />
      <ClientsSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </>
  );
}
