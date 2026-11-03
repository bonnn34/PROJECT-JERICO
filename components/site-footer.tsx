import Link from "next/link";
import { ProjectJericoWordmark } from "@/components/project-jerico-logo";
import { profile } from "@/data/portfolio";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-main"><div className="footer-brand-group"><Link href="/" className="footer-brand" aria-label="Project Jerico, home"><ProjectJericoWordmark className="footer-brand-lockup" /></Link><p className="footer-credit">Designed &amp; Developed by Jerico Ibalin</p></div><p>INDEPENDENT PORTFOLIO<br />DESIGN / DEVELOPMENT / SYSTEMS</p><nav aria-label="Footer navigation"><Link href="/">HOME</Link><Link href="/#work">WORK</Link><Link href="/resume">RESUME</Link><a href="#top">TOP ↑</a></nav></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span>BUILT WITH PURPOSE / PHILIPPINES</span></div></footer>;
}
