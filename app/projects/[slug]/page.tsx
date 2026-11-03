import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, profile } from "@/data/portfolio";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BlueprintSelectionFrame } from "@/components/blueprint-selection-frame";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  const canonical = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.overview,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${project.title} | ${profile.name}`,
      description: project.overview,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${profile.name}`,
      description: project.overview,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div id="top" className="case-page">
      <SiteHeader />
      <main id="main-content">
        <section className="shell case-hero" data-grid-spotlight>
          <Link href="/#work" className="back-link"><ArrowLeft size={16}/> All projects</Link>
          <div className="case-eyebrow"><span>PROJECT / {project.number}</span><span>{project.category} &nbsp; / &nbsp; {project.yearLabel}</span></div>
          <h1>{project.title}<span>.</span></h1>
          <p className="case-intro">{project.intro}</p>
          <div
            className="case-cover blueprint-host"
            style={project.imageAspectRatio ? { aspectRatio: project.imageAspectRatio } : undefined}
          ><Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 1200px" /><BlueprintSelectionFrame projectNumber={project.number} /></div>
        </section>
        <section className="shell case-details" data-grid-spotlight>
          <aside className="case-sidebar"><p className="section-eyebrow"><span>01</span> / PROJECT DETAILS</p><div><span>ROLE</span><p>{project.role}</p></div><div><span>TOOLS & SKILLS</span><div className="case-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">View live project <ArrowUpRight size={17}/></a>}{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-link">View source code <ArrowUpRight size={17}/></a>}</aside>
          <div className="case-story"><p className="section-eyebrow"><span>02</span> / OVERVIEW</p><h2>From idea to <em>execution.</em></h2><p className="case-lead">{project.overview}</p><div className="case-rule"/><h3>The approach</h3><p>{project.approach}</p><h3>Areas of focus</h3><ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><h3>What came out of it</h3><p>{project.outcome}</p></div>
        </section>
        <section className="next-project"><div className="shell"><p className="micro-label">NEXT PROJECT / {next.number}</p><Link href={`/projects/${next.slug}`}><span>{next.title}</span><ArrowUpRight size={40} strokeWidth={1.3}/></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
