import type { SVGProps } from "react";

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 48" fill="none" aria-hidden="true" {...props}>
      {/* shield outline, with a thin inset line for a layered crest feel */}
      <path
        d="M22 2 40 8.5V22c0 11-7.5 19.5-18 24C11.5 41.5 4 33 4 22V8.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M22 5.4 36.4 10.6V22c0 8.9-5.9 15.9-14.4 19.8C13.5 37.9 7.6 30.9 7.6 22V10.6z"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* scales of justice */}
      <circle cx="22" cy="11.4" r="1.15" fill="currentColor" />
      <line
        x1="22"
        y1="12.6"
        x2="22"
        y2="31.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="11.5"
        y1="17.6"
        x2="32.5"
        y2="17.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.5 17.6 9 23a2.6 2.6 0 0 0 5.2 0z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32.5 17.6 30 23a2.6 2.6 0 0 0 5.2 0z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="33.5"
        x2="27.5"
        y2="33.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
