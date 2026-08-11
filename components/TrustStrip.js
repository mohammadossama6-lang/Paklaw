const STATS = [
  { value: "2,500+", label: "Cases handled" },
  { value: "150+", label: "Verified lawyers" },
  { value: "25", label: "Cities covered" },
  { value: "4.8★", label: "Client rating" },
];

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-inner">
        {STATS.map((s) => (
          <div key={s.label} className="trust-item">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
