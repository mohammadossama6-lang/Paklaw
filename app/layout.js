import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "PakLaw — Legal Help for Pakistan's Incident Victims & Beyond",
  description:
    "PakLaw connects you with trusted Pakistani lawyers. Compensation claims, property, family, corporate and immigration law. Book a consultation in 4 easy steps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
