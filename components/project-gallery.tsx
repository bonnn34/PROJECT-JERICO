"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/portfolio";
import { BlueprintSelectionFrame } from "@/components/blueprint-selection-frame";
import { MeasurementOverlay } from "@/components/measurement-overlay";

const filters: Array<"All" | ProjectCategory> = ["All", "Websites", "Google Sheets Automation", "UI/UX"];

export function ProjectGallery() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [previewProject, setPreviewProject] = useState<(typeof projects)[number] | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewFrame = useRef(0);
  const filtered = active === "All" ? projects : projects.filter((project) => project.category === active);

  useEffect(() => () => window.cancelAnimationFrame(previewFrame.current), []);

  const positionPreview = (event: ReactMouseEvent<HTMLDivElement>) => {
    const clientX = event.clientX;
    const clientY = event.clientY;
    window.cancelAnimationFrame(previewFrame.current);
    previewFrame.current = window.requestAnimationFrame(() => {
      const preview = previewRef.current;
      if (!preview) return;

      const rect = preview.getBoundingClientRect();
      const gap = 24;
      let x = clientX + gap;
      let y = clientY - rect.height / 2;

      if (x + rect.width > window.innerWidth - 16) x = clientX - rect.width - gap;
      x = Math.max(16, Math.min(x, window.innerWidth - rect.width - 16));
      y = Math.max(16, Math.min(y, window.innerHeight - rect.height - 16));

      preview.style.setProperty("--preview-x", `${x}px`);
      preview.style.setProperty("--preview-y", `${y}px`);
    });
  };

  return (
    <div className="project-gallery">
      <div className="project-filters" role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            onClick={() => { setActive(filter); setPreviewProject(null); }}
            className={`filter-button ${active === filter ? "active" : ""}`}
          >{filter}<span>{filter === "All" ? String(projects.length).padStart(2,"0") : String(projects.filter((p) => p.category === filter).length).padStart(2,"0")}</span></button>
        ))}
      </div>
      <div className="projects-grid" aria-live="polite">
        {filtered.map((project, index) => {
          const isLeadProject = active === "All" && index === 0;
          return (
          <Link
            href={`/projects/${project.slug}`}
            className={`project-card ${isLeadProject ? "project-card-wide project-card-featured" : ""}`}
            key={project.slug}
          >
            <div
              className={`project-visual blueprint-host tone-${project.color}`}
              style={project.imageAspectRatio ? { aspectRatio: project.imageAspectRatio } : undefined}
            >
              <Image src={project.image} alt={project.imageAlt} fill sizes={isLeadProject ? "(max-width: 760px) 100vw, 66vw" : "(max-width: 760px) 100vw, 50vw"} />
              <span className="project-open" aria-hidden="true"><ArrowUpRight size={22}/></span>
              <BlueprintSelectionFrame projectNumber={project.number} />
            </div>
            <div
              className="project-meta"
              onMouseEnter={(event) => { setPreviewProject(project); positionPreview(event); }}
              onMouseMove={positionPreview}
              onMouseLeave={() => setPreviewProject(null)}
            >
              <div>
                <p className="micro-label">{project.number} / {project.category}</p>
                <h3>{project.title}</h3>
              </div>
              <span className="project-card-tag">{project.yearLabel}</span>
            </div>
            {isLeadProject && (
              <div className="project-proof">
                <div><span>ROLE</span><p>{project.role}</p></div>
                <div><span>OUTCOME</span><p>{project.outcome}</p></div>
                <strong>VIEW CASE STUDY <ArrowRight size={15} aria-hidden="true" /></strong>
              </div>
            )}
            <MeasurementOverlay variant="corners" reuseExistingCorners />
          </Link>
        )})}
      </div>
      <div
        ref={previewRef}
        className={`editorial-project-preview ${previewProject ? "is-visible" : ""}`}
        aria-hidden="true"
      >
        {previewProject && (
          <div className="editorial-preview-media" key={previewProject.slug}>
            <Image src={previewProject.image} alt="" fill sizes="280px" />
            <span>{previewProject.number.padStart(3, "0")} / {previewProject.category}</span>
          </div>
        )}
      </div>
    </div>
  );
}
