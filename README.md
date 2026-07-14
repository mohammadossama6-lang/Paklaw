# PakLaw — Law Firm Funnel Website

A static funnel website for PakLaw, a legal services platform for Pakistan.

## Pages

- `index.html` — landing page: header (logo + social icons), hero collage, 4-step funnel, footer
- `terms.html` — Terms & Conditions
- `privacy.html` — Privacy Policy

## The 4-step funnel

1. **Nationality** — Pakistani citizen / Overseas Pakistani / Foreign national
2. **Personal details** — name, email, phone, city (validated)
3. **Service → sub-service** — 6 practice areas, each with specific matters
4. **Payment & booking** — summary, fee, payment method, appointment date/time, plus a "continue to main website" divert link

On completion a confirmation screen is shown. Payment is currently a front-end
mock — integrate a real gateway (e.g. Stripe, PayFast, JazzCash) and a backend
before going live.

## Hero collage images

The hero background is a grid of tiles (`.hero-collage .tile` in `index.html`)
representing incidents in Pakistan (Gull Plaza, RJ Plaza, Margalla Towers, …).
They currently use placeholder gradients. To use real photographs, drop images
into `assets/hero/` and set each tile's background in `css/style.css`, e.g.:

```css
.t1 { background-image: url("../assets/hero/gull-plaza.jpg"); }
```

## Running locally

No build step — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```
