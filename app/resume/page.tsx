import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PrintButton } from "@/components/print-button";
import { competencies, experience, profile, projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Resume",
  description: `A print-friendly overview of ${profile.name}'s skills, experience, and selected projects.`,
};

export default function ResumePage() {
  return (
    <div id="top" className="resume-page">
      <SiteHeader />
      <main id="main-content" className="shell resume-main" data-grid-spotlight>
        <div className="resume-controls"><Link href="/" className="back-link"><ArrowLeft size={16}/> Portfolio</Link><div className="resume-control-actions">{profile.cvPdf && <a className="button button-outline" href={profile.cvPdf} download>Download PDF <ArrowUpRight size={17}/></a>}<PrintButton/></div></div>
        <article className="resume-paper">
          <div className="resume-paper-heading"><div><p className="section-eyebrow">CURRICULUM VITAE / 2026</p><h1>{profile.name}</h1><p className="resume-role">{profile.role}</p></div><div className="resume-contact-meta"><p><MapPin size={14}/>{profile.location}</p>{profile.email && <a href={`mailto:${profile.email}`}><Mail size={14}/>{profile.email}</a>}{profile.github && <a href={profile.github}>GitHub <ArrowUpRight size={14}/></a>}{profile.linkedin && <a href={profile.linkedin}>LinkedIn <ArrowUpRight size={14}/></a>}</div></div>
          <section className="resume-paper-section"><h2>Profile</h2><p>{profile.introduction}</p></section>
          <section className="resume-paper-section"><h2>Experience</h2>{experience.map((item) => <div className="resume-item" key={item.title}><div className="resume-item-heading"><h3>{item.title}</h3><span>{item.period}</span></div><p className="resume-item-category">{item.category}</p><p>{item.description}</p></div>)}</section>
          <section className="resume-paper-section"><h2>Selected projects</h2>{projects.slice(0, 4).map((project) => <div className="resume-item" key={project.slug}><div className="resume-item-heading"><h3>{project.title}</h3><span>{project.category}</span></div><p>{project.overview}</p></div>)}</section>
          <section className="resume-paper-section"><h2>Skills & tools</h2><div className="resume-skills">{competencies.map((group) => <div key={group.number}><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></div>)}</div></section>
          <div className="resume-footnote">Add your verified education details, dates, employer names, and contact links in <code>data/portfolio.ts</code> before sharing this as a formal job application.</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
