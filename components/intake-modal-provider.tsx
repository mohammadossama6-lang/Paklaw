"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import type { ServiceKey } from "@/lib/schema";

/**
 * The intake form drags in the country, state and Pakistani-city datasets plus
 * libphonenumber's metadata — well over 100 KB that every visitor was
 * downloading up front for a modal most of them never open. Loading it on
 * demand keeps it out of the first paint.
 */
const loadModal = () => import("@/components/client-register-modal");

const ClientRegisterModal = dynamic(loadModal, { ssr: false });

/**
 * What the caller already knows about the visitor's intent. Opening the modal
 * from a specific menu entry ("Copyright") should land on a form that already
 * has that picked, rather than making them find it again.
 */
export type IntakePreset = {
  service: ServiceKey;
  subService?: string;
};

type IntakeModalContextValue = {
  openIntakeModal: (preset?: IntakePreset) => void;
};

const IntakeModalContext = createContext<IntakeModalContextValue | null>(null);

export function IntakeModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<IntakePreset | undefined>(undefined);

  const openIntakeModal = useCallback((next?: IntakePreset) => {
    setPreset(next);
    setOpen(true);
  }, []);
  const closeIntakeModal = useCallback(() => setOpen(false), []);

  // Warm the chunk once the page has gone quiet, so the form is already there
  // when someone taps the CTA — on demand, but without a visible wait.
  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => void loadModal());
    const timer = idle === undefined ? window.setTimeout(() => void loadModal(), 2000) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const value = useMemo(() => ({ openIntakeModal }), [openIntakeModal]);

  return (
    <IntakeModalContext.Provider value={value}>
      {children}
      {/* Not mounted until first opened — keeps the chunk off the critical path. */}
      {open && <ClientRegisterModal open={open} onClose={closeIntakeModal} preset={preset} />}
    </IntakeModalContext.Provider>
  );
}

export function useIntakeModal() {
  const ctx = useContext(IntakeModalContext);
  if (!ctx) {
    throw new Error("useIntakeModal must be used within an IntakeModalProvider");
  }
  return ctx;
}
