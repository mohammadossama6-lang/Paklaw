import Funnel from "./Funnel";

/*
 * Hero collage: every tile is a square (1:1) image of an incident in
 * Pakistan — Gul Plaza, RJ Mall, Margalla Towers and similar tragedies.
 *
 * The images in /public/hero are locally generated artistic scenes of each
 * incident. To use real photographs instead, replace the corresponding file
 * in public/hero/ with a square (1:1) photo — same filename, .jpg or .svg —
 * and the collage picks it up automatically. See README for photo sources.
 */
const TILES = [
  { label: "Gul Plaza — 2026", img: "/hero/gul-plaza.svg" },
  { label: "RJ Mall — 2023", img: "/hero/rj-mall.svg" },
  { label: "Margalla Towers — 2005", img: "/hero/margalla-towers.svg" },
  { label: "Baldia Factory — 2012", img: "/hero/baldia-factory.svg" },
  { label: "Regent Plaza — 2016", img: "/hero/regent-plaza.svg" },
  { label: "Hafeez Centre — 2020", img: "/hero/hafeez-centre.svg" },
  { label: "Timber Market — 2021", img: "/hero/timber-market.svg" },
  { label: "Anarkali Bazaar — 2001", img: "/hero/anarkali.svg" },
  { label: "Ghakhar Plaza — 2013", img: "/hero/ghakhar-plaza.svg" },
  { label: "Mehran Town — 2021", img: "/hero/mehran-town.svg" },
  { label: "Ahmedpur Tanker — 2017", img: "/hero/ahmedpur-tanker.svg" },
  { label: "Lucky Plaza", img: "/hero/lucky-plaza.svg" },
];

// Repeat the list so the square tiles always cover the hero's full height.
const COLLAGE = [...TILES, ...TILES.slice(0, 6)];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-collage" aria-hidden="true">
        {COLLAGE.map((tile, i) => (
          <div
            key={`${tile.label}-${i}`}
            className="tile"
            style={{ backgroundImage: `url(${tile.img})` }}
          >
            <span>{tile.label}</span>
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
            From Gul Plaza to RJ Mall — we stand with the victims. Get expert legal help for
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
