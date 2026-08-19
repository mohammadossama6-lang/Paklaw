import { Briefcase, GraduationCap, Landmark, Megaphone } from "lucide-react";

const TRUST_POINTS = [
  {
    Icon: Megaphone,
    label: "Freedom of Expression",
    body: "Defending freedom of expression. Standing with those who dare to speak.",
    accent: "from-gold-400 to-gold-600",
    glow: "hover:shadow-gold-500/20",
  },
  {
    Icon: Landmark,
    label: "Institutional Accountability",
    body: "Challenging unfairness and holding public institutions accountable to the law.",
    accent: "from-brand-600 to-brand-900",
    glow: "hover:shadow-brand-700/20",
  },
  {
    Icon: Briefcase,
    label: "Business & Investment",
    body: "Protecting innovation, businesses and investment in Pakistan.",
    accent: "from-emerald-500 to-emerald-700",
    glow: "hover:shadow-emerald-600/20",
  },
  {
    Icon: GraduationCap,
    label: "Legal Education & Empowerment",
    body: "Creating opportunities and building the next generation of legal professionals.",
    accent: "from-indigo-500 to-indigo-800",
    glow: "hover:shadow-indigo-600/20",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 px-4 py-14 sm:py-24 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-96 rounded-full bg-brand-500/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-1/4 size-96 rounded-full bg-gold-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-6xl -translate-x-1/2 bg-linear-to-r from-transparent via-gold-400/70 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="animate-reveal mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
            <span aria-hidden className="h-px w-6 bg-linear-to-r from-transparent to-gold-400" />
            About Pak Law
            <span aria-hidden className="h-px w-6 bg-linear-to-l from-transparent to-gold-400" />
          </span>
          <h2 className="mt-3 font-serif text-3xl italic tracking-tight text-ink sm:text-5xl">
            Who We Are
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Pak Law is a distinguished full-service law firm headed by
            Barrister Shoaib Razzaq, known for its fearless advocacy and
            strategic legal excellence. Our valued clients include leading
            corporate entities, financial institutions, media groups,
            government bodies, and prominent public figures across Pakistan.
          </p>
        </div>

        <div className="mx-auto mt-10 sm:mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map(({ Icon, label, body, accent, glow }, i) => (
            <div
              key={label}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`animate-reveal group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl ${glow}`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-5 select-none font-serif text-8xl font-black leading-none text-slate-100 transition-colors duration-500 group-hover:text-slate-50"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accent}`}
              />

              <span
                className={`relative flex size-12 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${accent}`}
              >
                <Icon className="size-5.5" />
              </span>
              <div className="relative mt-5 text-[13px] font-bold uppercase tracking-widest text-ink">
                {label}
              </div>
              <p className="relative mt-2 text-sm leading-6 text-muted">{body}</p>
              <span
                aria-hidden
                className={`relative mt-auto block h-px w-8 bg-linear-to-r transition-all duration-500 group-hover:w-14 ${accent}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
