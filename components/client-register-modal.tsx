"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X as CloseIcon } from "lucide-react";

import IntakeForm from "@/components/intakeform";

export default function ClientRegisterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            /* max-h uses calc, not a dvh percentage: the overlay adds p-4
               either side, so a plain 90dvh cap left the card shorter than the
               space actually available and forced a scrollbar it didn't need.
               The scrollbar chrome is hidden — the form fits on ordinary
               screens now, and a bar cutting through the card looked broken —
               but the element still scrolls by wheel, touch and keyboard, and
               failed validation scrolls the offending field into view. */
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white text-muted shadow-md transition-colors hover:bg-slate-100 hover:text-ink"
            >
              <CloseIcon className="size-5" />
            </button>

            <IntakeForm />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
