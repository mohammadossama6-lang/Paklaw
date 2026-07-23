import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost, Lora, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { MotionConfig } from "framer-motion";
import Header from "@/components/header";
import { IntakeModalProvider } from "@/components/intake-modal-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

const nastaleeq = localFont({
  src: "./fonts/JameelNooriNastaleeqKasheeda.ttf",
  variable: "--font-nastaleeq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PakLaw — Legal Services in Pakistan",
  description:
    "Tell us about your legal matter and a PakLaw team member will get back to you within one business day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${jost.variable} ${lora.variable} ${nastaleeq.variable} h-full antialiased`}
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
