"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Globe, IdCard, Loader2, Plane } from "lucide-react";

import {
  DETAILS_SUB_STEP_FIELDS,
  leadSchema,
  STEP_FIELDS,
  type LeadFormValues,
} from "@/lib/schema";
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  PROVINCE_OPTIONS,
  SERVICE_OPTIONS,
  SUB_SERVICE_OPTIONS,
} from "@/lib/constants";

const STEP_LABELS = ["Your Details", "Service"];
const TOTAL_STEPS = STEP_LABELS.length;

const NATIONALITY_ICONS: Record<string, typeof IdCard> = {
  "pakistani-national": IdCard,
  "overseas-pakistani": Plane,
  "foreign-national": Globe,
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-ink outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#328FF8] focus:bg-white focus:ring-4 focus:ring-[#328FF8]/10";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1.5 text-sm text-red-500";

const DETAILS_STEP = 0;
const DETAILS_SUB_STEPS = DETAILS_SUB_STEP_FIELDS.length;

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [detailsSubStep, setDetailsSubStep] = useState(0);
  const [detailsSlideDirection, setDetailsSlideDirection] = useState(1);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      message: "",
      consent: false,
    },
  });

  // subscribe to individual fields with useWatch instead of `watch` — `watch` can't be
  // memoized safely and makes React Compiler skip this component
  const selectedService = useWatch({ control, name: "service" });
  const consentChecked = useWatch({ control, name: "consent" });
  const isLastStep = step === TOTAL_STEPS - 1;
  const isFirstScreen = step === DETAILS_STEP && detailsSubStep === 0;

  async function goNext() {
    if (step === DETAILS_STEP && detailsSubStep < DETAILS_SUB_STEPS - 1) {
      const valid = await trigger(DETAILS_SUB_STEP_FIELDS[detailsSubStep]);
      if (valid) {
        setDetailsSlideDirection(1);
        setDetailsSubStep((s) => s + 1);
      }
      return;
    }

    const fieldsForStep = STEP_FIELDS[step];
    const valid = await trigger(fieldsForStep as (keyof LeadFormValues)[]);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setServerError(null);

    if (step === DETAILS_STEP && detailsSubStep > 0) {
      setDetailsSlideDirection(-1);
      setDetailsSubStep((s) => s - 1);
      return;
    }

    if (step === DETAILS_STEP + 1) {
      setDetailsSlideDirection(-1);
      setDetailsSubStep(DETAILS_SUB_STEPS - 1);
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitState("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Something went wrong. Please try again.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-white p-10 text-center shadow-2xl shadow-slate-900/15">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#328FF8] shadow-lg shadow-[#328FF8]/40">
          <Check className="size-8 text-white" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-ink">
          Thank you — we&apos;ve received your request
        </h3>
        <p className="text-muted">
          A member of our team will reach out shortly. If your matter is
          urgent, feel free to message us directly on WhatsApp in the
          meantime.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/15 sm:p-7">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-[#328FF8]" />
      <h2 className="mb-4 text-center font-sans text-xl font-black tracking-tight text-ink sm:text-2xl">
        Schedule Your{" "}
        <span className="bg-linear-to-r from-[#328FF8] to-sky-500 bg-clip-text text-transparent">
          Legal Consultation
        </span>
      </h2>
      <ol className="mb-6 flex items-center" aria-label="Form progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={i === step ? "step" : undefined}
                className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  i < step
                    ? "bg-[#328FF8] text-white shadow-md shadow-[#328FF8]/30"
                    : i === step
                      ? "bg-[#328FF8] text-white shadow-lg shadow-[#328FF8]/40 ring-4 ring-[#328FF8]/20"
                      : "bg-slate-100 text-muted"
                }`}
              >
                {i < step ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </div>
              <span className="hidden text-xs text-muted sm:block">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#328FF8] transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      i < step
                        ? 100
                        : i === DETAILS_STEP && i === step
                          ? (detailsSubStep / (DETAILS_SUB_STEPS - 1)) * 100
                          : 0
                    }%`,
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1 — Your details: nationality, then personal, then location */}
            {step === 0 && (
              <fieldset>
                <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                  {detailsSubStep === 0 ? "What is your nationality?" : "Your details"}
                </legend>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={detailsSubStep}
                    initial={{ opacity: 0, x: detailsSlideDirection * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: detailsSlideDirection * -24 }}
                    transition={{ duration: 0.2 }}
                  >
                    {detailsSubStep === 0 ? (
                      <div>
                        <div className="grid grid-cols-3 gap-3">
                          {NATIONALITY_OPTIONS.map((opt) => {
                            const Icon = NATIONALITY_ICONS[opt.value];
                            return (
                              <label
                                key={opt.value}
                                className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 p-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#328FF8]/40 hover:shadow-md hover:shadow-[#328FF8]/10 has-checked:border-[#328FF8] has-checked:bg-[#328FF8]/5 has-checked:shadow-lg has-checked:shadow-[#328FF8]/15"
                              >
                                <span className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors has-checked:bg-[#328FF8] has-checked:text-white">
                                  <input
                                    type="radio"
                                    value={opt.value}
                                    {...register("nationality")}
                                    className="sr-only"
                                  />
                                  <Icon className="size-5" />
                                </span>
                                <span className="text-sm font-medium text-ink">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                        {errors.nationality && (
                          <p className={errorClass} role="alert">
                            {errors.nationality.message}
                          </p>
                        )}
                      </div>
                    ) : detailsSubStep === 1 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="fullName" className={labelClass}>
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            {...register("fullName")}
                            className={inputClass}
                          />
                          {errors.fullName && (
                            <p className={errorClass}>{errors.fullName.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className={labelClass}>
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            className={inputClass}
                          />
                          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="phone" className={labelClass}>
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            autoComplete="tel"
                            {...register("phone")}
                            className={inputClass}
                          />
                          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="gender" className={labelClass}>
                            Gender
                          </label>
                          <select id="gender" {...register("gender")} className={inputClass}>
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="dob" className={labelClass}>
                            Date of Birth
                          </label>
                          <input
                            id="dob"
                            type="date"
                            {...register("dob")}
                            className={inputClass}
                          />
                          {errors.dob && <p className={errorClass}>{errors.dob.message}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="province" className={labelClass}>
                            Province
                          </label>
                          <select
                            id="province"
                            {...register("province")}
                            className={inputClass}
                          >
                            <option value="">Select province</option>
                            {PROVINCE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.province && (
                            <p className={errorClass}>{errors.province.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="city" className={labelClass}>
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            autoComplete="address-level2"
                            {...register("city")}
                            className={inputClass}
                          />
                          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="address" className={labelClass}>
                            Address
                          </label>
                          <input
                            id="address"
                            type="text"
                            autoComplete="street-address"
                            {...register("address")}
                            className={inputClass}
                          />
                          {errors.address && (
                            <p className={errorClass}>{errors.address.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </fieldset>
            )}

            {/* STEP 2 — Service + dependent sub-service, then message/consent/submit */}
            {step === 1 && (
              <>
                <fieldset>
                  <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                    Which service do you need?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="service" className={labelClass}>
                        Service
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        onChange={(e) => {
                          setValue(
                            "service",
                            e.target.value as LeadFormValues["service"],
                            { shouldValidate: true }
                          );
                          setValue("subService", "");
                        }}
                        className={inputClass}
                      >
                        <option value="">Select a service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.service && <p className={errorClass}>{errors.service.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="subService" className={labelClass}>
                        Sub-service
                      </label>
                      <select
                        id="subService"
                        {...register("subService")}
                        disabled={!selectedService}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-muted`}
                      >
                        <option value="">
                          {selectedService ? "Select a sub-service" : "Choose a service first"}
                        </option>
                        {selectedService &&
                          SUB_SERVICE_OPTIONS[selectedService].map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                      {errors.subService && (
                        <p className={errorClass}>{errors.subService.message}</p>
                      )}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                    Tell us about your matter
                  </legend>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        {...register("message")}
                        className={inputClass}
                        placeholder="Briefly describe your situation..."
                      />
                      {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                    </div>

                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) =>
                          setValue("consent", e.target.checked, { shouldValidate: true })
                        }
                        className="mt-1 size-4 accent-[#328FF8]"
                      />
                      <span className="text-sm text-muted">
                        I agree to be contacted by Pak Law regarding my inquiry.
                      </span>
                    </label>
                    {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

                    {submitState === "error" && serverError && (
                      <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                        {serverError}
                      </p>
                    )}
                  </div>
                </fieldset>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          {isFirstScreen ? (
            <span aria-hidden />
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl px-4 py-2.5 font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            >
              Back
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 rounded-xl bg-[#328FF8] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#328FF8]/30 transition-all hover:shadow-xl hover:shadow-[#328FF8]/60 hover:brightness-110 active:scale-[0.98]"
            >
              Next Step
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="flex items-center gap-2 rounded-xl bg-[#328FF8] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#328FF8]/30 transition-all hover:shadow-xl hover:shadow-[#328FF8]/60 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "submitting" && <Loader2 className="size-4 animate-spin" />}
              {submitState === "submitting" ? "Submitting..." : "Submit request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
