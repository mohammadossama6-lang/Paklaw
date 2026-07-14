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

The hero background is a grid of **square (1:1) tiles** (`TILES` in
`components/Hero.js`), one per incident in Pakistan — Gul Plaza (2026),
RJ Mall (2023), Margalla Towers (2005), Baldia Factory (2012) and others.

The images in `public/hero/` are locally generated artistic scenes of each
incident (news photographs are copyrighted, and this build environment blocks
image downloads). To use real photographs, replace a file in `public/hero/`
with a square-cropped photo and update the path in `components/Hero.js` if
you change the extension, e.g. `/hero/gul-plaza.jpg`.

Photo sources to pull from:

- Gul Plaza fire (2026): https://en.wikipedia.org/wiki/2026_Gul_Plaza_Shopping_Mall_fire
- 2005 Kashmir earthquake / Margalla Towers (freely licensed):
  https://commons.wikimedia.org/wiki/Category:2005_Kashmir_earthquake_damage
- Baldia Town factory fire (2012): https://en.wikipedia.org/wiki/2012_Pakistan_garment_factory_fires
- News archives (Dawn, Tribune, Geo) for RJ Mall, Regent Plaza, Hafeez Centre —
  note these photos are copyrighted; obtain permission or a license before
  publishing them.

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
