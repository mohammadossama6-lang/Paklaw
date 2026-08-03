import type { Metadata } from "next";
import { Geist, Jost, Lora, Noto_Nastaliq_Urdu, Playfair_Display } from "next/font/google";
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

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
