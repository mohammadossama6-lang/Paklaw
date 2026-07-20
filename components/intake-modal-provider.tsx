"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import ClientRegisterModal from "@/components/client-register-modal";

type IntakeModalContextValue = {
  openIntakeModal: () => void;
};

const IntakeModalContext = createContext<IntakeModalContextValue | null>(null);

export function IntakeModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openIntakeModal = useCallback(() => setOpen(true), []);
  const closeIntakeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openIntakeModal }), [openIntakeModal]);

  return (
    <IntakeModalContext.Provider value={value}>
      {children}
      <ClientRegisterModal open={open} onClose={closeIntakeModal} />
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
