"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, UserCheck, UserPlus, X as CloseIcon } from "lucide-react";

import { LogoMark } from "@/components/logo-mark";
import { SERVICE_OPTIONS } from "@/lib/constants";
import LawyerRegisterModal from "@/components/lawyer-register-modal";
import { useIntakeModal } from "@/components/intake-modal-provider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [lawyerModalOpen, setLawyerModalOpen] = useState(false);
  const { openIntakeModal } = useIntakeModal();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
      <div className="animate-fade-in-down relative mx-auto flex max-w-330 items-center justify-between gap-4 rounded-2xl bg-white px-4 py-5 shadow-2xl shadow-black/30 sm:px-6">
        <Link
          href="#home"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5"
        >
          <LogoMark className="size-9 text-ink sm:size-10" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Pak Law
            </span>
            <span className="mt-0.5 text-[12px] font-medium uppercase tracking-[0.3em] text-muted">
              حق کی بات، پاک لاء کے ساتھ
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          <a
            href="#about"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
          >
            About Us
          </a>
          <span aria-hidden className="h-4 w-px bg-slate-200" />
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
            >
              Practice Areas
              <ChevronDown className="size-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-white p-2 opacity-0 shadow-2xl shadow-black/20 transition-all group-hover:visible group-hover:opacity-100">
              {SERVICE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={openIntakeModal}
                  className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-slate-50 hover:text-brand-600"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <span aria-hidden className="h-4 w-px bg-slate-200" />
          <a
            href="#testimonials"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
          >
            Testimonials
          </a>
          <span aria-hidden className="h-4 w-px bg-slate-200" />
          <a
            href="#footer"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
          >
            Contact Us
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <motion.button
            type="button"
            onClick={openIntakeModal}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { type: "spring", stiffness: 350, damping: 18 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            className="group relative hidden items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-[#328FF8] via-indigo-600 to-brand-800 bg-size-[200%_100%] bg-position-[0%_0%] px-4.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/30 transition-[background-position,box-shadow] duration-500 ease-out hover:bg-position-[100%_0%] hover:shadow-xl hover:shadow-brand-700/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/50 xl:flex"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-white/30 blur-[2px] transition-transform duration-700 ease-out translate-x-[-150%] group-hover:translate-x-[500%]" />
            <motion.span
              className="relative flex size-6.5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40"
              whileHover={{ rotate: [0, -18, 12, -6, 0], scale: [1, 1.15, 1.05, 1.1, 1] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <UserCheck className="size-3.5" />
            </motion.span>
            <span className="relative transition-all duration-300 group-hover:tracking-wide">
              Get a Free Consultation
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setLawyerModalOpen(true)}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { type: "spring", stiffness: 350, damping: 18 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }}
            className="group relative hidden items-center gap-2.5 overflow-hidden rounded-full border border-brand-200/70 bg-white px-4.5 py-2.5 text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(30,64,175,0.1)] transition-all duration-300 hover:border-brand-300 hover:shadow-[0_10px_26px_rgba(30,64,175,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/50 xl:flex"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-[#328FF8] via-indigo-400 to-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
            />
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-brand-50/80 blur-[2px] transition-transform duration-700 ease-out translate-x-[-150%] group-hover:translate-x-[500%]" />
            <motion.span
              className="relative flex size-6.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/40"
              whileHover={{ rotate: [0, -18, 12, -6, 0], scale: [1, 1.15, 1.05, 1.1, 1] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <UserPlus className="size-3.5" />
            </motion.span>
            <span className="relative transition-all duration-300 group-hover:tracking-wide">
              Register as a{" "}
              <span className="bg-linear-to-r from-[#328FF8] to-indigo-600 bg-clip-text font-extrabold text-transparent">
                Lawyer
              </span>
            </span>
          </motion.button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-brand-600 xl:hidden"
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30 xl:hidden"
          >
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 hover:text-brand-600"
              >
                About Us
              </a>

              <button
                type="button"
                onClick={() => setMobileServicesOpen((open) => !open)}
                aria-expanded={mobileServicesOpen}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 hover:text-brand-600"
              >
                Services
                <ChevronDown
                  className={`size-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-4"
                  >
                    {SERVICE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          openIntakeModal();
                        }}
                        className="block w-full rounded-xl px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-50 hover:text-brand-600"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <a
                href="#testimonials"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 hover:text-brand-600"
              >
                Testimonials
              </a>

              <a
                href="#footer"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 hover:text-brand-600"
              >
                Contact Us
              </a>
            </nav>

            <div className="flex flex-col gap-2.5 border-t border-slate-100 px-4 py-4">
              <motion.button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openIntakeModal();
                }}
                whileTap={{ scale: 0.96 }}
                className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-[#328FF8] via-indigo-600 to-brand-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/30"
              >
                <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/40">
                  <UserCheck className="size-3.5" />
                </span>
                Get a Free Consultation
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLawyerModalOpen(true);
                }}
                whileTap={{ scale: 0.96 }}
                className="group flex items-center justify-center gap-2.5 rounded-full border border-brand-200/70 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(30,64,175,0.1)] transition-colors hover:border-brand-300"
              >
                <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/40">
                  <UserPlus className="size-3.5 transition-transform duration-300 group-active:-rotate-12" />
                </span>
                Register as a{" "}
                <span className="bg-linear-to-r from-[#328FF8] to-indigo-600 bg-clip-text font-extrabold text-transparent">
                  Lawyer
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LawyerRegisterModal
        open={lawyerModalOpen}
        onClose={() => setLawyerModalOpen(false)}
      />
    </header>
  );
}
