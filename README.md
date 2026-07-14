# PakLaw — Law Firm Funnel Website

A funnel website for PakLaw, a legal services platform for Pakistan.
Built with **Next.js** (App Router) and a black & gold theme.

## Pages

- `/` — landing page: header (logo + social icons), hero collage, 4-step funnel, footer
- `/terms` — Terms & Conditions
- `/privacy` — Privacy Policy

## The 4-step funnel

1. **Nationality** — Pakistani citizen / Overseas Pakistani / Foreign national
2. **Personal details** — name, email, phone, city (validated)
3. **Service → sub-service** — 6 practice areas, each with specific matters
4. **Payment & booking** — summary, fee, payment method, appointment date/time, plus a "continue to main website" divert link

On completion a confirmation screen is shown. Payment is currently a front-end
mock — integrate a real gateway (e.g. Stripe, PayFast, JazzCash) and a backend
before going live.

## Project structure

```
app/
  layout.js         # root layout: header + footer, global metadata
  page.js           # landing page
  globals.css       # black & gold theme
  terms/page.js     # Terms & Conditions
  privacy/page.js   # Privacy Policy
components/
  Header.js  Footer.js  Logo.js  SocialLinks.js
  Hero.js           # hero collage + copy
  Funnel.js         # 4-step funnel (client component)
  TrustStrip.js
lib/
  services.js       # service catalogue, nationalities, time slots, fee
```

## Hero collage images

The hero background is a grid of tiles (`TILES` in `components/Hero.js`)
representing incidents in Pakistan (Gull Plaza, RJ Plaza, Margalla Towers, …).
They currently use placeholder gradients (`.t1`–`.t12` in `app/globals.css`).
To use real photographs, drop images into `public/hero/` and set each tile's
background, e.g.:

```css
.t1 { background-image: url("/hero/gull-plaza.jpg"); }
```

## Development

```bash
npm install
npm run dev     # http://localhost:3000
```

## Production

```bash
npm run build
npm start
```
