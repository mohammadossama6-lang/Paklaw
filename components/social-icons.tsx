import type { ComponentType, SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M17 2.5h-2.5C12.01 2.5 10 4.51 10 7v2.5H7.5V13H10v8.5h3.5V13h2.5l.5-3.5h-3V7c0-.55.45-1 1-1H17V2.5z"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="8.2" r="1.3" fill="currentColor" />
      <rect x="6.8" y="11" width="2.4" height="7" fill="currentColor" />
      <path
        fill="currentColor"
        d="M12 11h2.3v1.2c.5-.8 1.4-1.4 2.6-1.4 2 0 3.1 1.3 3.1 3.7V18h-2.4v-3c0-1-.4-1.7-1.4-1.7-1 0-1.5.7-1.5 1.7v3H12z"
      />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        d="M5 5l14 14M19 5L5 19"
      />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M15.5 3c.3 2.1 1.6 3.7 3.5 4V9.5c-1.3 0-2.5-.4-3.5-1.1V14a5 5 0 1 1-5-5c.2 0 .3 0 .5.02V11.6a2.5 2.5 0 1 0 2 2.45V3h2.5z"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.3 28.3 0 0 0 2 12a28.3 28.3 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.3 28.3 0 0 0 22 12a28.3 28.3 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"
      />
    </svg>
  );
}

export const SOCIAL_LINKS: {
  name: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { name: "Facebook", href: "https://www.facebook.com/paklawofficial", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/thepaklawofficial", Icon: InstagramIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/pak-law-official", Icon: LinkedinIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@pak.law.official", Icon: TiktokIcon },
  { name: "YouTube", href: "https://www.youtube.com/@paklawofficial", Icon: YoutubeIcon },
];

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5c-5.25 0-9.5 4.14-9.5 9.25 0 1.7.48 3.29 1.31 4.66L2.5 21.5l5.3-1.29a9.7 9.7 0 0 0 4.2.99c5.25 0 9.5-4.14 9.5-9.25S17.25 2.5 12 2.5Zm3.35 11.9c-.19.5-1.1 1-1.53 1.06-.4.06-.9.08-1.45-.09a13 13 0 0 1-1.32-.49c-2.33-1-3.85-3.34-3.97-3.5-.11-.16-.95-1.26-.95-2.4 0-1.14.6-1.7.81-1.93.21-.24.46-.3.61-.3h.44c.14 0 .33-.02.51.4.19.44.65 1.5.7 1.61.06.11.1.25.02.4-.08.15-.12.24-.24.37l-.32.37c-.1.11-.2.24-.09.44.11.2.5.85 1.08 1.38.75.68 1.38.9 1.58.99.2.1.32.08.44-.05l.44-.53c.16-.2.29-.16.49-.09l1.4.66c.2.1.34.14.39.22.05.09.05.5-.14 1.01Z"
      />
    </svg>
  );
}
