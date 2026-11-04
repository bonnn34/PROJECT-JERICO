"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MeasurementOverlay } from "@/components/measurement-overlay";

const identities = [
  { label: "Creative Developer", lines: ["CREATIVE", "DEVELOPER"] },
  { label: "UI Systems Designer", lines: ["UI SYSTEMS", "DESIGNER"] },
  { label: "Workflow Builder", lines: ["WORKFLOW", "BUILDER"] },
] as const;

type Direction = "previous" | "next";

export function HeroIdentitySwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [hasChanged, setChanged] = useState(false);
  const activeIdentity = identities[activeIndex];

  const move = (step: -1 | 1) => {
    setChanged(true);
    setDirection(step === 1 ? "next" : "previous");
    setActiveIndex((current) => (current + step + identities.length) % identities.length);
  };

  return (
    <div className="hero-title-system">
      <div className="measurement-host hero-title-measurement-host">
        <div className="hero-title-viewport" aria-live="polite" aria-atomic="true">
          <h1
            id="hero-title"
            className={"hero-title" + (hasChanged ? " hero-title-" + direction : "")}
            key={`${activeIndex}-${direction}`}
          >
            {activeIdentity.lines.map((line) => <span key={line}>{line}</span>)}
          </h1>
        </div>
        <MeasurementOverlay variant="horizontal" targetSelector=".hero-title span" />
      </div>
      <div className="hero-title-controls" aria-label="Choose professional identity">
        <span className="hero-title-count" aria-label={`Title ${activeIndex + 1} of ${identities.length}`}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(identities.length).padStart(2, "0")}
        </span>
        <div className="hero-title-buttons">
          <button type="button" onClick={() => move(-1)} aria-label="Show previous professional identity">
            <ArrowLeft size={15} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Show next professional identity">
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <span className="hero-title-label">{activeIdentity.label}</span>
      </div>
    </div>
  );
}
