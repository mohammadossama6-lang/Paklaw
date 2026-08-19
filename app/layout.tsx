import type { Metadata } from "next";
import { Geist, Jost, Lora, Noto_Nastaliq_Urdu, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { MotionConfig } from "framer-motion";
import Header from "@/components/header";
import { IntakeModalProvider } from "@/components/intake-modal-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

/**
 * Jost and Lora are accent faces used on a handful of elements. They were
 * preloaded alongside the two faces that render the bulk of the page, so four
 * woff2 files (~130 KB) competed with the stylesheet and the hero image for
 * the first round trips. `preload: false` keeps them off the critical path;
 * `display: swap` means their text paints in a fallback until they land.
 */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * Nastaliq is by far the heaviest asset on the site — the variable font was
 * 234 KB, more than every other font put together, for the single Urdu line in
 * the header. Pinning one weight avoids shipping the whole axis range, and
 * preload:false keeps it from competing with the CSS and JS needed to paint;
 * display:swap means the line shows in a fallback until it arrives.
 */
const nastaleeq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaleeq",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  preload: false,
});

/**
 * Meta (Facebook) Pixel. The ID is not a secret — it ships in the client
 * bundle by design and is visible to anyone viewing source.
 *
 * `lazyOnload` defers it to idle time after load, rather than injecting it the
 * moment hydration finishes. The pixel pulls ~683 KB of decoded JS across
 * fbevents.js and its config, which on a mid-range Android is a long main-
 * thread block landing right where we are trying to get the page usable.
 * PageView still fires — a few hundred ms later — so attribution is intact for
 * everything except a bounce faster than the page could be read anyway.
 *
 * Note this fires PageView on the initial document load only: moving between
 * routes here is client-side navigation, which the base snippet does not see.
 */
const META_PIXEL_ID = "2154588512126816";

export const metadata: Metadata = {
  title: "Pak Law — Legal Services in Pakistan",
  description:
    "Tell us about your legal matter and a Pak Law team member will get back to you within one business day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfairDisplay.variable} ${jost.variable} ${lora.variable} ${nastaleeq.variable} h-full antialiased`}
    >
      <head>
        {/* The hero image is a CSS background, so the browser only discovers it
            after parsing the stylesheet and building the render tree — it was
            starting 2.3s in, on the largest thing above the fold. Preloading
            starts it with the document. The media attributes mean each device
            fetches only its own variant. */}
        <link
          rel="preload"
          as="image"
          href="/hero-bg-mobile.webp"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href="/hero-bg-tablet.webp"
          media="(min-width: 768px) and (max-width: 1279px)"
        />
        <link rel="preload" as="image" href="/hero-bg.webp" media="(min-width: 1280px)" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        <MotionConfig reducedMotion="user">
          <IntakeModalProvider>
            <Header />
            {children}
          </IntakeModalProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
