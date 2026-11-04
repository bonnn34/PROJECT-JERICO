"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { ProjectJericoWordmark } from "@/components/project-jerico-logo";
import { ThemeControl } from "@/components/theme-control";
import { BuildAnimationControl } from "@/components/construction/construction-preferences";

const navItems = [
  { label: "Work", href: "/#work" }, { label: "About", href: "/#about" },
  { label: "Capabilities", href: "/#expertise" }, { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useLayoutEffect(() => {
    const scrollbarWidth = isOpen ? window.innerWidth - document.documentElement.clientWidth : 0;
    document.body.style.setProperty("--scrollbar-compensation", `${scrollbarWidth}px`);
    document.body.classList.toggle("nav-open", isOpen);
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("nav-open");
      document.body.style.removeProperty("--scrollbar-compensation");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" aria-label={`Project Jerico, ${profile.name} portfolio home`} className="wordmark" onClick={() => setOpen(false)}><ProjectJericoWordmark className="header-brand-lockup" /></Link>
        <div className="header-utilities"><span className="header-location"><i /> {profile.location}</span><ThemeControl /><Link className="header-resume" href="/resume">RESUME <ArrowUpRight size={13} /></Link><button type="button" className="menu-toggle" aria-controls="site-menu" aria-expanded={isOpen} aria-label={isOpen ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}><span>{isOpen ? "CLOSE" : "MENU"}</span>{isOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
      </div>
      <nav id="site-menu" className={`site-menu ${isOpen ? "is-open" : ""}`} aria-label="Main navigation" aria-hidden={!isOpen} inert={!isOpen} onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
        <div className="shell site-menu-inner">
          <p className="micro-label">NAVIGATION / INDEX</p>
          {navItems.map((item, index) => <Link href={item.href} onClick={() => setOpen(false)} key={item.label}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={24} /></Link>)}
          <Link href="/resume" onClick={() => setOpen(false)}><span>06</span>Resume<ArrowUpRight size={24} /></Link>
          <BuildAnimationControl />
        </div>
      </nav>
    </header>
  );
}
