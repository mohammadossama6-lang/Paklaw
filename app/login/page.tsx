"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-ink outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#328FF8] focus:bg-white focus:ring-4 focus:ring-[#328FF8]/10";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1.5 text-sm text-red-500";
const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-[#328FF8] p-2.5 font-semibold text-white shadow-lg shadow-[#328FF8]/30 transition-all hover:shadow-xl hover:shadow-[#328FF8]/60 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

type Step = "phone" | "code";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="relative flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-28">
      <Loader2 className="size-6 animate-spin text-muted" />
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestOtp(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setPending(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.message ?? "Something went wrong. Please try again.");
      return;
    }

    setStep("code");
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });

    const body = await res.json().catch(() => null);
    setPending(false);

    if (!res.ok) {
      setError(body?.message ?? "That code is invalid or has expired.");
      return;
    }

    router.push(searchParams.get("next") ?? body.redirectTo ?? "/");
  }

  return (
    <main className="relative flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden px-4 py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-gold-400/15 blur-[100px]"
      />

      <div className="animate-fade-in-up relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 shadow-2xl shadow-slate-900/15">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#328FF8] to-gold-400" />

        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="PakLaw"
            width={612}
            height={511}
            className="mb-3 size-10 object-contain"
          />
          <h1 className="font-serif text-2xl italic tracking-tight text-ink">
            {step === "phone" ? "Client & Lawyer Login" : "Enter your code"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {step === "phone"
              ? "One login for both — enter your phone number and we'll send a one-time code to your WhatsApp."
              : `We sent a 6-digit code to ${phone}.`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className={inputClass}
                placeholder="+92 3xx xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {error && <p className={errorClass}>{error}</p>}
            </div>
            <button type="submit" disabled={pending} className={buttonClass}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="code" className={labelClass}>
                6-digit code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className={inputClass}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <p className={errorClass}>{error}</p>}
            </div>
            <button type="submit" disabled={pending} className={buttonClass}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify
            </button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-sm text-muted transition-colors hover:text-ink"
            >
              Use a different number
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
