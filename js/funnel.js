/* ============================================================
   PakLaw — 4-Step Funnel Logic
   Step 1: Nationality
   Step 2: Personal details
   Step 3: Service → Sub-service
   Step 4: Payment & appointment booking (or divert to website)
   ============================================================ */

(function () {
  "use strict";

  // ---------- Service catalogue ----------
  const SERVICES = [
    {
      id: "compensation",
      emoji: "⚖️",
      title: "Incident & Compensation Claims",
      desc: "Gull Plaza, RJ Plaza & other tragedies",
      subservices: [
        "Fire / building collapse compensation",
        "Wrongful death claim",
        "Personal injury claim",
        "Insurance dispute",
        "Class action / group claim",
      ],
    },
    {
      id: "property",
      emoji: "🏠",
      title: "Property & Real Estate",
      desc: "Transfers, disputes, verification",
      subservices: [
        "Title verification",
        "Property transfer / registry",
        "Illegal possession / land grabbing",
        "Builder & developer dispute",
        "Tenancy dispute",
      ],
    },
    {
      id: "family",
      emoji: "👨‍👩‍👧",
      title: "Family Law",
      desc: "Divorce, custody, inheritance",
      subservices: [
        "Divorce / Khula",
        "Child custody & maintenance",
        "Court marriage / Nikah",
        "Inheritance & succession certificate",
        "Domestic violence protection",
      ],
    },
    {
      id: "corporate",
      emoji: "🏢",
      title: "Corporate & Business",
      desc: "Registration, contracts, tax",
      subservices: [
        "Company registration (SECP)",
        "Contract drafting & review",
        "Trademark & IP",
        "Tax matters (FBR)",
        "Employment dispute",
      ],
    },
    {
      id: "immigration",
      emoji: "🛫",
      title: "Immigration & Overseas",
      desc: "Visas, POA, overseas Pakistanis",
      subservices: [
        "Power of Attorney (overseas)",
        "Visa refusal / appeal",
        "NICOP / POC / documentation",
        "Overseas property protection",
        "Citizenship matters",
      ],
    },
    {
      id: "criminal",
      emoji: "🛡️",
      title: "Criminal & Civil Litigation",
      desc: "Bail, FIR, recovery suits",
      subservices: [
        "Bail application",
        "FIR registration / quashing",
        "Cyber crime (PECA)",
        "Money recovery suit",
        "Appeals (High Court / Supreme Court)",
      ],
    },
  ];

  // ---------- State ----------
  const state = {
    step: 1,
    nationality: null,
    fullName: "",
    email: "",
    phone: "",
    city: "",
    service: null,
    subservice: null,
  };

  const TOTAL_STEPS = 4;

  // ---------- Elements ----------
  const form = document.getElementById("funnelForm");
  const steps = form.querySelectorAll(".funnel-step");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressFill = document.getElementById("progressFill");
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const funnelNav = document.getElementById("funnelNav");

  // ---------- Helpers ----------
  function showError(id, show) {
    document.getElementById(id).classList.toggle("show", show);
  }

  function goToStep(n) {
    state.step = n;

    steps.forEach((el) => {
      el.classList.toggle("active", Number(el.dataset.step) === n);
    });

    progressSteps.forEach((el) => {
      const s = Number(el.dataset.step);
      el.classList.toggle("active", s === Math.min(n, TOTAL_STEPS));
      el.classList.toggle("done", s < n);
    });

    progressFill.style.width = (Math.min(n, TOTAL_STEPS) / TOTAL_STEPS) * 100 + "%";

    backBtn.hidden = n === 1 || n > TOTAL_STEPS;
    // Step 4 has its own submit button; success step has no nav.
    nextBtn.hidden = n >= TOTAL_STEPS;
    funnelNav.hidden = n > TOTAL_STEPS;

    if (n === TOTAL_STEPS) renderSummary();

    document.getElementById("funnel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---------- Step 1: nationality ----------
  document.querySelectorAll("#nationalityOptions .option-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#nationalityOptions .option-card")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.nationality = btn.dataset.value;
      showError("err-nationality", false);
    });
  });

  // ---------- Step 3: services ----------
  const serviceGrid = document.getElementById("serviceOptions");
  const subWrap = document.getElementById("subserviceWrap");
  const subGrid = document.getElementById("subserviceOptions");
  const subTitle = document.getElementById("subserviceTitle");

  SERVICES.forEach((svc) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-card";
    btn.dataset.id = svc.id;
    btn.innerHTML =
      '<span class="opt-emoji">' + svc.emoji + "</span>" +
      '<span class="opt-title">' + svc.title + "</span>" +
      '<span class="opt-desc">' + svc.desc + "</span>";
    btn.addEventListener("click", () => selectService(svc, btn));
    serviceGrid.appendChild(btn);
  });

  function selectService(svc, btn) {
    serviceGrid.querySelectorAll(".option-card").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    state.service = svc.title;
    state.subservice = null;
    showError("err-service", false);

    subTitle.textContent = "Select the specific matter — " + svc.title;
    subGrid.innerHTML = "";
    svc.subservices.forEach((name) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = name;
      chip.addEventListener("click", () => {
        subGrid.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        state.subservice = name;
        showError("err-service", false);
      });
      subGrid.appendChild(chip);
    });
    subWrap.hidden = false;
  }

  // ---------- Validation per step ----------
  function validateStep(n) {
    if (n === 1) {
      const ok = Boolean(state.nationality);
      showError("err-nationality", !ok);
      return ok;
    }

    if (n === 2) {
      const name = document.getElementById("fullName");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const city = document.getElementById("city");

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const phoneOk = phone.value.replace(/[^\d]/g, "").length >= 9;

      name.classList.toggle("invalid", !name.value.trim());
      email.classList.toggle("invalid", !emailOk);
      phone.classList.toggle("invalid", !phoneOk);
      city.classList.toggle("invalid", !city.value.trim());

      const ok = Boolean(name.value.trim()) && emailOk && phoneOk && Boolean(city.value.trim());
      showError("err-details", !ok);

      if (ok) {
        state.fullName = name.value.trim();
        state.email = email.value.trim();
        state.phone = phone.value.trim();
        state.city = city.value.trim();
      }
      return ok;
    }

    if (n === 3) {
      const ok = Boolean(state.service && state.subservice);
      showError("err-service", !ok);
      return ok;
    }

    return true;
  }

  // ---------- Step 4: summary + booking ----------
  function renderSummary() {
    const box = document.getElementById("summaryBox");
    box.innerHTML = [
      ["Client", state.fullName],
      ["Nationality", state.nationality],
      ["City", state.city],
      ["Service", state.service],
      ["Matter", state.subservice],
    ]
      .map(function (row) {
        return "<div><dt>" + row[0] + "</dt><dd>" + escapeHtml(row[1] || "—") + "</dd></div>";
      })
      .join("");

    // Earliest bookable date = tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    document.getElementById("apptDate").min = d.toISOString().split("T")[0];
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Navigation ----------
  nextBtn.addEventListener("click", () => {
    if (validateStep(state.step)) goToStep(state.step + 1);
  });

  backBtn.addEventListener("click", () => {
    if (state.step > 1) goToStep(state.step - 1);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (state.step !== TOTAL_STEPS) return;

    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const ok = Boolean(date && time);
    showError("err-payment", !ok);
    if (!ok) return;

    const method = form.querySelector('input[name="payMethod"]:checked').value;

    // NOTE: integrate a real payment gateway + backend here.
    document.getElementById("successMsg").textContent =
      "Thank you, " + state.fullName.split(" ")[0] + "! Your consultation for “" +
      state.subservice + "” is booked for " + date + " at " + time +
      " (payment via " + method + "). We'll confirm shortly by email and WhatsApp.";

    goToStep(TOTAL_STEPS + 1);
  });

  // Init
  goToStep(1);
})();
