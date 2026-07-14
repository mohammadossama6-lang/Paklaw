import Funnel from "./Funnel";

/*
 * Hero collage: each tile is a small image from incidents in Pakistan
 * (Gull Plaza, RJ Plaza, Margalla Towers, etc.).
 * Replace a tile's gradient with a real photograph by adding
 * `background-image: url(...)` for its class in globals.css — or swap the
 * <div> for a next/image component when the photos are available.
 */
const TILES = [
  "Gull Plaza",
  "RJ Plaza",
  "Margalla Towers",
  "Hafeez Centre",
  "Regent Plaza",
  "Baldia Factory",
  "Gulberg Fire",
  "Karachi Timber Mkt",
  "Lahore Anarkali",
  "Nishtar Park",
  "Faisalabad Mills",
  "Murree Highway",
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-collage" aria-hidden="true">
        {TILES.map((label, i) => (
          <div key={label} className={`tile t${i + 1}`}>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-copy">
          <p className="hero-eyebrow">Pakistan&apos;s Legal Claims &amp; Consultation Platform</p>
          <h1>
            When Tragedy Strikes,
            <br />
            Justice Shouldn&apos;t Wait.
          </h1>
          <p className="hero-sub">
            From Gull Plaza to RJ Plaza — we stand with the victims. Get expert legal help for
            compensation claims, property, family and corporate matters. Start below in 4 simple steps.
          </p>
          <ul className="hero-points">
            <li>Verified lawyers across Pakistan</li>
            <li>Fixed, transparent consultation fee</li>
            <li>Support for overseas Pakistanis</li>
          </ul>
        </div>

        <Funnel />
      </div>
    </section>
  );
}
