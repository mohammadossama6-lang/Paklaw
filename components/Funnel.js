"use client";

import { useRef, useState } from "react";
import {
  SERVICES,
  NATIONALITIES,
  TIME_SLOTS,
  CONSULTATION_FEE,
  PAYMENT_METHODS,
  MAIN_WEBSITE_URL,
} from "../lib/services";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Nationality", "Your Details", "Service", "Payment"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function minBookingDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function Funnel() {
  const [step, setStep] = useState(1);
  const [nationality, setNationality] = useState(null);
  const [details, setDetails] = useState({ fullName: "", email: "", phone: "", city: "" });
  const [service, setService] = useState(null);
  const [subservice, setSubservice] = useState(null);
  const [booking, setBooking] = useState({ date: "", time: "", payMethod: PAYMENT_METHODS[0].value });
  const [error, setError] = useState(false);
  const [booked, setBooked] = useState(false);
  const cardRef = useRef(null);

  const detailsValid = {
    fullName: details.fullName.trim().length > 0,
    email: EMAIL_RE.test(details.email.trim()),
    phone: details.phone.replace(/[^\d]/g, "").length >= 9,
    city: details.city.trim().length > 0,
  };

  function validateStep(n) {
    if (n === 1) return Boolean(nationality);
    if (n === 2) return Object.values(detailsValid).every(Boolean);
    if (n === 3) return Boolean(service && subservice);
    return true;
  }

  function goToStep(n) {
    setStep(n);
    setError(false);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function next() {
    if (!validateStep(step)) {
      setError(true);
      return;
    }
    goToStep(step + 1);
  }

  function back() {
    if (step > 1) goToStep(step - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!booking.date || !booking.time) {
      setError(true);
      return;
    }
    // NOTE: integrate a real payment gateway + backend here.
    setBooked(true);
    setError(false);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const stepErrors = {
    1: "Please select an option to continue.",
    2: "Please fill in all fields with valid information.",
    3: "Please choose a service and a specific matter.",
    4: "Please choose a date and time for your appointment.",
  };

  return (
    <div className="funnel-card" id="funnel" ref={cardRef} aria-label="Book a legal consultation">
      <div className="funnel-progress">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const current = booked ? TOTAL_STEPS : step;
          return (
            <div
              key={label}
              className={`progress-step${n === Math.min(current, TOTAL_STEPS) ? " active" : ""}${n < current || booked ? " done" : ""}`}
            >
              <span className="dot">{n}</span>
              <span className="plabel">{label}</span>
            </div>
          );
        })}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(Math.min(booked ? TOTAL_STEPS : step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {booked ? (
          <div className="funnel-step active">
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h2>Appointment Booked!</h2>
              <p>
                Thank you, {details.fullName.split(" ")[0]}! Your consultation for &ldquo;{subservice}&rdquo; is
                booked for {booking.date} at {booking.time} (payment via {booking.payMethod}). We&apos;ll
                confirm shortly by email and WhatsApp.
              </p>
              <a className="btn btn-outline" href={MAIN_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                Visit Our Main Website
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: Nationality */}
            {step === 1 && (
              <div className="funnel-step active">
                <h2>Where are you based?</h2>
                <p className="step-hint">This helps us assign the right lawyer and jurisdiction.</p>
                <div className="option-grid">
                  {NATIONALITIES.map((nat) => (
                    <button
                      key={nat.value}
                      type="button"
                      className={`option-card${nationality === nat.value ? " selected" : ""}`}
                      onClick={() => {
                        setNationality(nat.value);
                        setError(false);
                      }}
                    >
                      <span className="opt-emoji">{nat.emoji}</span>
                      <span className="opt-title">{nat.title}</span>
                      <span className="opt-desc">{nat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Personal details */}
            {step === 2 && (
              <div className="funnel-step active">
                <h2>Tell us about yourself</h2>
                <p className="step-hint">Your information is kept strictly confidential.</p>
                <div className="form-row">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="e.g. Ahmed Khan"
                    autoComplete="name"
                    className={error && !detailsValid.fullName ? "invalid" : ""}
                    value={details.fullName}
                    onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
                  />
                </div>
                <div className="form-row two-col">
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={error && !detailsValid.email ? "invalid" : ""}
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+92 3XX XXXXXXX"
                      autoComplete="tel"
                      className={error && !detailsValid.phone ? "invalid" : ""}
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    placeholder="e.g. Karachi, Lahore, Dubai…"
                    className={error && !detailsValid.city ? "invalid" : ""}
                    value={details.city}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Service + sub-service */}
            {step === 3 && (
              <div className="funnel-step active">
                <h2>What do you need help with?</h2>
                <p className="step-hint">Choose a service, then pick the specific matter.</p>
                <div className="option-grid services">
                  {SERVICES.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      className={`option-card${service?.id === svc.id ? " selected" : ""}`}
                      onClick={() => {
                        setService(svc);
                        setSubservice(null);
                        setError(false);
                      }}
                    >
                      <span className="opt-emoji">{svc.emoji}</span>
                      <span className="opt-title">{svc.title}</span>
                      <span className="opt-desc">{svc.desc}</span>
                    </button>
                  ))}
                </div>
                {service && (
                  <div className="subservice-wrap">
                    <h3>Select the specific matter — {service.title}</h3>
                    <div className="chip-grid">
                      {service.subservices.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className={`chip${subservice === name ? " selected" : ""}`}
                          onClick={() => {
                            setSubservice(name);
                            setError(false);
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Payment & booking */}
            {step === 4 && (
              <div className="funnel-step active">
                <h2>Book your consultation</h2>
                <div className="summary-box">
                  {[
                    ["Client", details.fullName],
                    ["Nationality", nationality],
                    ["City", details.city],
                    ["Service", service?.title],
                    ["Matter", subservice],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value || "—"}</dd>
                    </div>
                  ))}
                </div>

                <div className="form-row two-col">
                  <div>
                    <label htmlFor="apptDate">Preferred date</label>
                    <input
                      type="date"
                      id="apptDate"
                      min={minBookingDate()}
                      value={booking.date}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="apptTime">Preferred time</label>
                    <select
                      id="apptTime"
                      value={booking.time}
                      onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    >
                      <option value="">Select time…</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pay-fee">
                  <span>Consultation fee</span>
                  <strong>{CONSULTATION_FEE}</strong>
                </div>

                <fieldset className="pay-methods">
                  <legend>Payment method</legend>
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.value} className="pay-option">
                      <input
                        type="radio"
                        name="payMethod"
                        value={m.value}
                        checked={booking.payMethod === m.value}
                        onChange={() => setBooking({ ...booking, payMethod: m.value })}
                      />{" "}
                      <span>{m.label}</span>
                    </label>
                  ))}
                </fieldset>

                {error && <div className="field-error show">{stepErrors[4]}</div>}

                <button type="submit" className="btn btn-primary btn-block" id="bookBtn">
                  Pay &amp; Book Appointment
                </button>
                <a className="divert-link" href={MAIN_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                  Not ready to book? Continue to our main website →
                </a>
              </div>
            )}

            {error && step < 4 && <div className="field-error show">{stepErrors[step]}</div>}

            <div className="funnel-nav">
              {step > 1 && (
                <button type="button" className="btn btn-ghost" onClick={back}>
                  ← Back
                </button>
              )}
              {step < TOTAL_STEPS && (
                <button type="button" className="btn btn-primary" id="nextBtn" onClick={next}>
                  Continue →
                </button>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}
