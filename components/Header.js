import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <SocialLinks />
      </div>
    </header>
  );
}
