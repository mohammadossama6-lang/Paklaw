"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Upload, X as CloseIcon } from "lucide-react";

import {
  lawyerApplicationSchema,
  MAX_CV_SIZE_BYTES,
  ACCEPTED_CV_TYPES,
  type LawyerApplicationInput,
} from "@/lib/lawyer-schema";
import { PRACTICE_AREA_OPTIONS } from "@/lib/lawyer-constants";
import { PROVINCE_OPTIONS } from "@/lib/constants";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-ink outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#328FF8] focus:bg-white focus:ring-4 focus:ring-[#328FF8]/10";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1.5 text-sm text-red-500";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function LawyerRegisterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LawyerApplicationInput>({
    resolver: zodResolver(lawyerApplicationSchema),
    mode: "onTouched",
  });

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

  function handleClose() {
    onClose();
    if (submitState === "success") {
      reset();
      setCvFile(null);
      setSubmitState("idle");
    }
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setCvError(null);
    if (!file) {
      setCvFile(null);
      return;
    }
    if (!ACCEPTED_CV_TYPES.includes(file.type)) {
      setCvError("Please upload a PDF or Word document.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError("File must be under 5MB.");
      e.target.value = "";
      return;
    }
    setCvFile(file);
  }

  const onSubmit = async (values: LawyerApplicationInput) => {
    setSubmitState("submitting");
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("city", values.city);
      formData.append("province", values.province);
      formData.append("barCouncilNumber", values.barCouncilNumber);
      formData.append("yearsOfExperience", String(values.yearsOfExperience));
      values.practiceAreas.forEach((area) => formData.append("practiceAreas", area));
      formData.append("lawDegree", values.lawDegree);
      formData.append("university", values.university);
      formData.append("graduationYear", String(values.graduationYear));
      formData.append("bio", values.bio);
      if (cvFile) formData.append("cv", cvFile);

      const res = await fetch("/api/lawyer-application", {
        method: "POST",
        body: formData,
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
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl bg-white p-6 shadow-2xl shadow-black/30 sm:p-8"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            >
              <CloseIcon className="size-5" />
            </button>

            {submitState === "success" ? (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#328FF8] shadow-lg shadow-[#328FF8]/40">
                  <Check className="size-8 text-white" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-ink">
                  Application received
                </h3>
                <p className="max-w-sm text-muted">
                  Thank you for registering with PakLaw. Our team will review your
                  application and reach out shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-1 font-sans text-xl font-black tracking-tight text-ink sm:text-2xl">
                  Register as a{" "}
                  <span className="bg-linear-to-r from-[#328FF8] to-sky-500 bg-clip-text text-transparent">
                    Lawyer
                  </span>
                </h2>
                <p className="mb-6 text-sm text-muted">
                  Join the PakLaw network. Tell us about your practice and we&apos;ll be
                  in touch.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <fieldset>
                    <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                      Contact details
                    </legend>
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
                        <label htmlFor="lawyer-email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="lawyer-email"
                          type="email"
                          autoComplete="email"
                          {...register("email")}
                          className={inputClass}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="lawyer-phone" className={labelClass}>
                          Phone Number
                        </label>
                        <input
                          id="lawyer-phone"
                          type="tel"
                          autoComplete="tel"
                          {...register("phone")}
                          className={inputClass}
                        />
                        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="lawyer-city" className={labelClass}>
                          City
                        </label>
                        <input
                          id="lawyer-city"
                          type="text"
                          autoComplete="address-level2"
                          {...register("city")}
                          className={inputClass}
                        />
                        {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="lawyer-province" className={labelClass}>
                          Province
                        </label>
                        <select
                          id="lawyer-province"
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
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                      Credentials &amp; education
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="barCouncilNumber" className={labelClass}>
                          Bar Council Registration Number
                        </label>
                        <input
                          id="barCouncilNumber"
                          type="text"
                          {...register("barCouncilNumber")}
                          className={inputClass}
                        />
                        {errors.barCouncilNumber && (
                          <p className={errorClass}>{errors.barCouncilNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="yearsOfExperience" className={labelClass}>
                          Years of Experience
                        </label>
                        <input
                          id="yearsOfExperience"
                          type="number"
                          min={0}
                          max={70}
                          {...register("yearsOfExperience")}
                          className={inputClass}
                        />
                        {errors.yearsOfExperience && (
                          <p className={errorClass}>{errors.yearsOfExperience.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lawDegree" className={labelClass}>
                          Law Degree
                        </label>
                        <input
                          id="lawDegree"
                          type="text"
                          placeholder="e.g. LLB, LLM"
                          {...register("lawDegree")}
                          className={inputClass}
                        />
                        {errors.lawDegree && (
                          <p className={errorClass}>{errors.lawDegree.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="university" className={labelClass}>
                          University
                        </label>
                        <input
                          id="university"
                          type="text"
                          {...register("university")}
                          className={inputClass}
                        />
                        {errors.university && (
                          <p className={errorClass}>{errors.university.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="graduationYear" className={labelClass}>
                          Graduation Year
                        </label>
                        <input
                          id="graduationYear"
                          type="number"
                          min={1950}
                          max={new Date().getFullYear()}
                          {...register("graduationYear")}
                          className={inputClass}
                        />
                        {errors.graduationYear && (
                          <p className={errorClass}>{errors.graduationYear.message}</p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                      Practice areas
                    </legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {PRACTICE_AREA_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-ink transition-all hover:border-[#328FF8]/40 has-checked:border-[#328FF8] has-checked:bg-[#328FF8]/5"
                        >
                          <input
                            type="checkbox"
                            value={opt.value}
                            {...register("practiceAreas")}
                            className="size-4 accent-[#328FF8]"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    {errors.practiceAreas && (
                      <p className={errorClass}>{errors.practiceAreas.message}</p>
                    )}
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-base font-semibold tracking-tight text-ink">
                      CV &amp; bio
                    </legend>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="cv" className={labelClass}>
                          CV / Bar License (optional, PDF or Word, max 5MB)
                        </label>
                        <label
                          htmlFor="cv"
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3 text-sm text-muted transition-colors hover:border-[#328FF8]/50 hover:bg-[#328FF8]/5"
                        >
                          <Upload className="size-4 shrink-0" />
                          {cvFile ? cvFile.name : "Choose a file"}
                        </label>
                        <input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvChange}
                          className="sr-only"
                        />
                        {cvError && <p className={errorClass}>{cvError}</p>}
                      </div>

                      <div>
                        <label htmlFor="bio" className={labelClass}>
                          Short Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={3}
                          {...register("bio")}
                          className={inputClass}
                          placeholder="Tell us about your practice and experience..."
                        />
                        {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
                      </div>

                      {submitState === "error" && serverError && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                          {serverError}
                        </p>
                      )}
                    </div>
                  </fieldset>

                  <div className="flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="submit"
                      disabled={submitState === "submitting"}
                      className="flex items-center gap-2 rounded-xl bg-[#328FF8] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#328FF8]/30 transition-all hover:shadow-xl hover:shadow-[#328FF8]/60 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitState === "submitting" && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      {submitState === "submitting" ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
