import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="PakLaw home">
      <svg
        className="logo-mark"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M24 4v40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 12h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 12 5 26h10L10 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M38 12 33 26h10L38 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5 26c0 3 2.2 5 5 5s5-2 5-5" stroke="currentColor" strokeWidth="2" />
        <path d="M33 26c0 3 2.2 5 5 5s5-2 5-5" stroke="currentColor" strokeWidth="2" />
        <path d="M16 44h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="9" r="2.5" fill="currentColor" />
      </svg>
      <span className="logo-text">
        Pak<span className="logo-accent">Law</span>
      </span>
    </Link>
  );
}
