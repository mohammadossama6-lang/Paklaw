import Link from "next/link";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <Logo />
          <nav className="footer-links" aria-label="Legal pages">
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </nav>
          <p className="footer-copy">© 2026 PakLaw. All rights reserved.</p>
        </div>
        <SocialLinks className="footer-social" />
      </div>
    </footer>
  );
}
