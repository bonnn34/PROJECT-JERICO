import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PrintButton } from "@/components/print-button";
import { atsResume, profile, projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name}'s ATS-friendly resume covering inventory control, ERP operations, accounting reconciliation, data analysis, and technical support.`,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: "/resume",
    title: `${profile.name} — Resume`,
    description: `${profile.name}'s professional experience, technical skills, education, and selected projects.`,
    images: ["/og-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Resume`,
    description: `${profile.name}'s professional experience, technical skills, education, and selected projects.`,
    images: ["/og-preview.png"],
  },
};

export default function ResumePage() {
  const selectedProjects = projects.filter((project) =>
    ["digital-wedding-invitations", "project-monitoring-system", "wedding-website-monitoring"].includes(project.slug),
  );

  return (
    <div id="top" className="resume-page">
      <SiteHeader />
      <main id="main-content" className="shell resume-main" data-grid-spotlight>
        <div className="resume-controls">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Portfolio</Link>
          <div className="resume-control-actions">
            {profile.cvPdf && (
              <a className="button button-outline" href={profile.cvPdf} download>
                Download PDF <ArrowUpRight size={17} />
              </a>
            )}
            <PrintButton />
          </div>
        </div>

        <article className="resume-paper" aria-label={`${profile.name} resume`}>
          <header className="resume-paper-heading">
            <div>
              <p className="resume-document-label">RESUME</p>
              <h1>{profile.name}</h1>
              <p className="resume-role">{profile.resumeHeadline}</p>
            </div>
            <address className="resume-contact-meta">
              <span>{profile.resumeLocation}</span>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/bonnn34</a>}
              {profile.behance && <a href={profile.behance} target="_blank" rel="noopener noreferrer">behance.net/jericoibalin1</a>}
              {profile.facebook && <a href={profile.facebook} target="_blank" rel="noopener noreferrer">facebook.com/jerico.ibalin</a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            </address>
          </header>

          <section className="resume-paper-section" aria-labelledby="summary-heading">
            <h2 id="summary-heading">Professional Summary</h2>
            <p className="resume-summary">{atsResume.summary}</p>
          </section>

          <section className="resume-paper-section" aria-labelledby="competencies-heading">
            <h2 id="competencies-heading">Core Competencies</h2>
            <p className="resume-keywords">{atsResume.coreCompetencies.join(", ")}</p>
          </section>

          <section className="resume-paper-section" aria-labelledby="experience-heading">
            <h2 id="experience-heading">Professional Experience</h2>
            {atsResume.experience.map((job) => (
              <article className="resume-item resume-job" key={`${job.company}-${job.period}`}>
                <div className="resume-item-heading">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="resume-company">{job.company}</p>
                  </div>
                  <p className="resume-period">{job.period}</p>
                </div>
                {job.location && <p className="resume-location">{job.location}</p>}
                <ul>
                  {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </section>

          <section className="resume-paper-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading">Technical Skills</h2>
            <div className="resume-skills">
              {atsResume.technicalSkills.map((group) => (
                <div className="resume-skill-row" key={group.category}>
                  <h3>{group.category}</h3>
                  <p>{group.skills.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-paper-section" aria-labelledby="education-heading">
            <h2 id="education-heading">Education</h2>
            {atsResume.education.map((education) => (
              <article className="resume-item resume-education" key={education.degree}>
                <div className="resume-item-heading">
                  <div>
                    <h3>{education.degree}</h3>
                    <p className="resume-company">{education.school}</p>
                  </div>
                  <p className="resume-period">{education.period}</p>
                </div>
                <p>{education.department}</p>
                <p>{education.location}</p>
              </article>
            ))}
          </section>

          <section className="resume-paper-section resume-projects-section" aria-labelledby="projects-heading">
            <h2 id="projects-heading">Selected Technical Projects</h2>
            {selectedProjects.map((project) => (
              <article className="resume-item resume-project" key={project.slug}>
                <div className="resume-item-heading">
                  <h3>{project.title}</h3>
                  <p className="resume-period">{project.category}</p>
                </div>
                <p className="resume-project-tools"><strong>Tools:</strong> {project.tools.join(", ")}</p>
                <p>{project.overview}</p>
              </article>
            ))}
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
