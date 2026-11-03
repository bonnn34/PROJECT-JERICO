import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk } from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import { HeroIdentitySwitcher } from "@/components/hero-identity-switcher";
import { ProjectJericoMark } from "@/components/project-jerico-logo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeasurementOverlay } from "@/components/measurement-overlay";
import { competencies, experience, profile, projects } from "@/data/portfolio";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content">
        <section className="hero shell" aria-labelledby="hero-title" data-grid-spotlight>
          <div className="hero-role-block">
            <p className="micro-label hero-kicker">01 / INDEPENDENT PORTFOLIO</p>
            <HeroIdentitySwitcher />
            <div className="hero-tags" aria-label="Primary skills">
              <span>NEXT.JS</span><span>UI DESIGN</span><span>WORKFLOW SYSTEMS</span>
            </div>
            <div className="measurement-host portrait-measurement-host">
              <div className="hero-media">
                <Image src="/projects/project-jerico-hero.webp" alt="Illustrated portrait of Jerico Ibalin" fill priority quality={82} sizes="(max-width: 800px) calc(100vw - 38px), 44vw" />
                <span className="corner-mark corner-mark-top" aria-hidden="true" /><span className="corner-mark corner-mark-bottom" aria-hidden="true" />
              </div>
              <MeasurementOverlay variant="dimensions" targetSelector=".hero-media" />
            </div>
            <div className="hero-media-caption"><ArrowRight size={17} aria-hidden="true" /><p>BASED IN {profile.location.toUpperCase()}<br />DESIGNING FOR REAL PEOPLE & REAL USE</p></div>
          </div>

          <div className="hero-identity-block">
            <div className="hero-location"><span className="status-pill"><i /> WEB / DESIGN / SYSTEMS</span><p>FROM THE PHILIPPINES<br />WITH INTENTION</p></div>
            <div className="hero-intro"><p>I build thoughtful websites and practical digital systems.</p><span>WEB DEVELOPMENT / UI DESIGN /<br />WORKFLOW AUTOMATION</span></div>
            <div className="hero-brand-lockup"><ProjectJericoMark title="Project Jerico monogram" className="hero-brand-monogram" /><h2 className="hero-brand">PROJECT<br />JERICO</h2></div>
            <div className="hero-index"><span>2026 / PORTFOLIO</span><Link href="#work" className="pill-link">SELECTED WORK <ArrowDownRight size={14} /></Link></div>
          </div>
          <div className="hero-bottom-rail"><span><i /> BUILT WITH PURPOSE</span><Link href="#work">EXPLORE THE WORK <ArrowDown size={14} /></Link></div>
        </section>

        <section id="work" className="work-section ruled-section" aria-labelledby="work-heading" data-grid-spotlight>
          <div className="shell">
            <div className="section-masthead">
              <div><p className="micro-label">02 / PROJECT INDEX</p><h2 id="work-heading">SELECTED<br /><span>WORK.</span></h2></div>
              <div className="section-note"><strong>{String(projects.length).padStart(2, "0")} PROJECTS</strong><p>WEB EXPERIENCES, DIGITAL SYSTEMS,<br />INTERFACE CONCEPTS & PRACTICAL BUILDS.</p></div>
            </div>
            <ProjectGallery />
          </div>
        </section>

        <section id="about" className="about-section ruled-section" aria-labelledby="about-heading" data-grid-spotlight>
          <div className="shell about-layout">
            <div className="about-statement"><p className="micro-label">03 / PROFILE</p><h2 id="about-heading">DESIGNING<br />WITH INTENT.<br /><span>BUILDING<br />FOR USE.</span></h2><Link href="/resume" className="pill-link">VIEW RESUME <ArrowUpRight size={14} /></Link></div>
            <div className="about-details">
              <div className="about-monogram"><ProjectJericoMark construction precision interactive title="Toggle Project Jerico precision guides" className="about-brand-mark" /><div className="about-precision-labels" aria-hidden="true"><strong>PJ / 001</strong><span>PROJECT JERICO / WEB / DESIGN / SYSTEMS</span></div></div>
              <div className="about-copy"><p className="about-lead">I&apos;m {profile.firstName}, a developer and digital creative balancing how things look with how well they work.</p><p>My background in technical support, data organization, and administrative workflows taught me to understand the real problem before designing the interface around it.</p><p>I enjoy turning complex information into responsive websites, useful systems, and straightforward digital experiences.</p></div>
              <div className="about-meta-grid"><div><span>LOCATION</span><strong>{profile.location}</strong></div><div><span>FOCUS</span><strong>Web & digital systems</strong></div><div><span>APPROACH</span><strong>Clear, useful, considered</strong></div><div><span>STATUS</span><strong>Always learning</strong></div></div>
            </div>
          </div>
        </section>

        <section id="expertise" className="expertise-section ruled-section" aria-labelledby="expertise-heading" data-grid-spotlight>
          <div className="shell">
            <div className="section-masthead compact-masthead"><div><p className="micro-label">04 / CAPABILITIES</p><h2 id="expertise-heading">WHAT I<br /><span>BRING.</span></h2></div><div className="section-note"><p>A PRACTICAL TOOLKIT ACROSS<br />DESIGN, DEVELOPMENT & SUPPORT.</p></div></div>
            <div className="expertise-list">
              {competencies.map((competency) => <article className="expertise-item" key={competency.number}><span className="expertise-number">{competency.number}</span><div className="expertise-main"><h3>{competency.title}</h3><p>{competency.summary}</p></div><div className="skill-tags">{competency.items.map((item) => <span key={item}>{item}</span>)}</div><ArrowUpRight className="expertise-arrow" size={22} strokeWidth={1.5} /></article>)}
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section ruled-section" aria-labelledby="experience-heading" data-grid-spotlight>
          <div className="shell experience-layout">
            <div className="experience-title"><p className="micro-label">05 / EXPERIENCE</p><h2 id="experience-heading">WORK &<br /><span>CONTEXT.</span></h2><p>Hands-on support experience, system thinking, and creative digital projects.</p></div>
            <div className="experience-list">
              {experience.map((item, index) => <article className="experience-entry" key={item.title}><div className="exp-index">0{index + 1}</div><div><p className="micro-label">{item.period} / {item.category}</p><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
              <div className="experience-statement"><Asterisk size={18} /><p>CONTINUOUSLY LEARNING, BUILDING & REFINING.</p><span>ONGOING</span></div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-heading">
          <div className="shell">
            <div className="contact-rail"><span>06 / GET IN TOUCH</span><span>HAVE A PROJECT OR AN IDEA?</span></div>
            <div className="contact-heading-wrap"><h2 id="contact-heading">LET&apos;S BUILD<br /><span>SOMETHING<span className="contact-desktop-space"> </span><br className="contact-mobile-break" />USEFUL.</span></h2><ArrowUpRight size={72} strokeWidth={1.2} aria-hidden="true" /></div>
            <div className="contact-bottom">
              <p>GOOD PROJECTS START WITH<br />A CLEAR CONVERSATION.</p>
              {profile.email ? <a className="contact-email" href={`mailto:${profile.email}?subject=Let's%20work%20together`}>{profile.email}<ArrowUpRight size={24} /></a> : <span className="contact-pending">CONTACT DETAILS COMING SOON</span>}
              <div className="socials">{profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>}<Link href="/resume">RESUME ↗</Link></div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
