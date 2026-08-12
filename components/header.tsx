"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, UserCheck, UserPlus, X as CloseIcon } from "lucide-react";

import { SERVICE_OPTIONS, SUB_SERVICE_OPTIONS } from "@/lib/constants";
import type { ServiceKey } from "@/lib/schema";
import LawyerRegisterModal from "@/components/lawyer-register-modal";
import { useIntakeModal } from "@/components/intake-modal-provider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  // Which practice area's sub-services are expanded in the mobile panel —
  // one at a time, so the list doesn't become an unscrollable wall.
  const [mobileOpenService, setMobileOpenService] = useState<string | null>(null);
  const [lawyerModalOpen, setLawyerModalOpen] = useState(false);
  const { openIntakeModal } = useIntakeModal();

  /*
   * Tailwind gates hover variants behind `@media (hover: hover)`, so on a
   * touch device wide enough to show the desktop nav — an iPad Pro in
   * landscape is 1366pt — the fly-outs could never be opened. There the menus
   * become tap-to-open instead: the trigger toggles the list, and a practice
   * area toggles its own matters rather than jumping straight to the form.
   */
  const [isTouch, setIsTouch] = useState(false);
  const [tapMenuOpen, setTapMenuOpen] = useState(false);
  const [tapService, setTapService] = useState<string | null>(null);
  const practiceAreasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: none)");
    const sync = () => setIsTouch(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  function closeTapMenu() {
    setTapMenuOpen(false);
    setTapService(null);
  }

  // A tap anywhere outside the menu dismisses it, the way a hover menu closes
  // when the pointer leaves.
  useEffect(() => {
    if (!tapMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!practiceAreasRef.current?.contains(event.target as Node)) closeTapMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [tapMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
      <div className="animate-fade-in-down relative mx-auto flex max-w-330 items-center justify-between gap-4 rounded-2xl bg-white px-4 py-5 shadow-2xl shadow-black/30 sm:px-6">
        <Link
          href="#home"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5"
        >
          <Image
            src="/logo.png"
            alt="Pak Law"
            width={612}
            height={511}
            className="size-9 object-contain sm:size-10"
            priority
          />
          <span className="font-lora text-xl font-semibold leading-none tracking-tight text-ink sm:text-2xl">
            Pak Law
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
          <div className="group relative" ref={practiceAreasRef}>
            <button
              type="button"
              aria-expanded={isTouch ? tapMenuOpen : undefined}
              onClick={() => {
                if (!isTouch) return;
                setTapService(null);
                setTapMenuOpen((open) => !open);
              }}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
            >
              Practice Areas
              <ChevronDown className="size-3.5" />
            </button>
            {/* pt-3 rather than mt-3: the gap between the trigger and the panel
                has to be part of the hover target, or the menu closes as the
                pointer crosses it on its way down to a sub-menu. */}
            <div
              className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all ${
                isTouch && tapMenuOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              }`}
            >
              <div className="rounded-2xl bg-white p-2 shadow-2xl shadow-black/20">
                {SERVICE_OPTIONS.map((option) => {
                  const subServices = SUB_SERVICE_OPTIONS[option.value as ServiceKey];
                  // Facilitation Center alone has 16 matters. Splitting the
                  // long lists into two columns keeps every fly-out short
                  // enough to show whole, instead of capping the height and
                  // making people scroll inside a menu.
                  const wide = subServices.length > 8;
                  return (
                    <div key={option.value} className="group/svc relative">
                      <button
                        type="button"
                        aria-expanded={isTouch ? tapService === option.value : undefined}
                        onClick={() => {
                          if (isTouch) {
                            setTapService((current) =>
                              current === option.value ? null : option.value
                            );
                            return;
                          }
                          openIntakeModal({ service: option.value as ServiceKey });
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-slate-50 hover:text-brand-600 group-focus-within/svc:bg-slate-50"
                      >
                        {option.label}
                        <ChevronRight className="size-3.5 shrink-0 text-muted" />
                      </button>

                      {/* pl-2 keeps the pointer inside the hover target while it
                          travels from the parent row into the flyout. */}
                      <div
                        className={`absolute left-full top-0 ${wide ? "w-[36rem]" : "w-80"} pl-2 transition-all ${
                          isTouch && tapService === option.value
                            ? "visible opacity-100"
                            : "invisible opacity-0 group-hover/svc:visible group-hover/svc:opacity-100 group-focus-within/svc:visible group-focus-within/svc:opacity-100"
                        }`}
                      >
                        <div
                          className={`rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 ${wide ? "grid grid-cols-2 gap-x-1" : ""}`}
                        >
                          {subServices.map((sub) => (
                            <button
                              key={sub.value}
                              type="button"
                              onClick={() => {
                                closeTapMenu();
                                openIntakeModal({
                                  service: option.value as ServiceKey,
                                  subService: sub.value,
                                });
                              }}
                              className="block w-full rounded-xl px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-50 hover:text-brand-600"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

        {/* ml-auto keeps this hard against the right edge below xl, where the
            nav beside it is hidden and the logo is absolutely centred — without
            it justify-between drops the menu button on the far left and leaves
            the right side of the bar empty. */}
        <div className="ml-auto flex items-center gap-2.5">
          <motion.button
            type="button"
            onClick={() => openIntakeModal()}
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
              Book Free Consultation
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
            className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:text-brand-600 xl:hidden"
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
                Practice Areas
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
                    {SERVICE_OPTIONS.map((option) => {
                      const subServices = SUB_SERVICE_OPTIONS[option.value as ServiceKey];
                      const expanded = mobileOpenService === option.value;
                      return (
                        <div key={option.value}>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileOpenService((current) =>
                                current === option.value ? null : option.value
                              )
                            }
                            aria-expanded={expanded}
                            className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            {option.label}
                            <ChevronDown
                              className={`size-3.5 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                            />
                          </button>
                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {subServices.map((sub) => (
                                  <button
                                    key={sub.value}
                                    type="button"
                                    onClick={() => {
                                      setMenuOpen(false);
                                      openIntakeModal({
                                        service: option.value as ServiceKey,
                                        subService: sub.value,
                                      });
                                    }}
                                    className="block w-full rounded-xl px-4 py-2 text-left text-sm text-muted/80 transition-colors hover:bg-slate-50 hover:text-brand-600"
                                  >
                                    {sub.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
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
                Book Free Consultation
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
