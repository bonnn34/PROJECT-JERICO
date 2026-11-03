"use client";

import { useState } from "react";
import type { KeyboardEvent, MouseEvent, SVGProps } from "react";

type ProjectJericoMarkProps = SVGProps<SVGSVGElement> & {
  construction?: boolean;
  interactive?: boolean;
  precision?: boolean;
  title?: string;
};

type ProjectJericoWordmarkProps = {
  className?: string;
  label?: string;
  showMark?: boolean;
};

export function ProjectJericoMark({
  className = "",
  construction = false,
  interactive = false,
  onClick,
  onKeyDown,
  precision = false,
  title,
  ...props
}: ProjectJericoMarkProps) {
  const [isPrecisionActive, setPrecisionActive] = useState(false);
  const accessibleTitle = title ?? (interactive ? "Toggle Project Jerico precision guides" : undefined);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (interactive) setPrecisionActive((active) => !active);
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (interactive && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setPrecisionActive((active) => !active);
    }
    onKeyDown?.(event);
  };

  return (
    <svg
      className={`${className} ${precision ? "pj-precision-mark" : ""} ${isPrecisionActive ? "is-precision-active" : ""}`.trim()}
      viewBox="0 0 240 240"
      preserveAspectRatio="xMidYMid meet"
      role={interactive ? "button" : accessibleTitle ? "img" : undefined}
      aria-label={accessibleTitle}
      aria-hidden={accessibleTitle ? undefined : true}
      aria-pressed={interactive ? isPrecisionActive : undefined}
      focusable={interactive ? "true" : "false"}
      tabIndex={interactive ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {construction && (
        <g className="pj-construction" fill="none" stroke="currentColor" strokeWidth="0.7">
          <circle cx="120" cy="120" r="88" pathLength="1" vectorEffect="non-scaling-stroke" />
          <path d="M120 16 224 120 120 224 16 120Z" pathLength="1" vectorEffect="non-scaling-stroke" />
        </g>
      )}
      {precision && (
        <g className="pj-precision-elements">
          <circle className="pj-precision-ring" cx="120" cy="120" r="88" pathLength="1" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <g className="pj-precision-ticks" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path className="pj-precision-tick" d="M120 26v12" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick" d="M120 202v12" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick" d="M26 120h12" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick" d="M202 120h12" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick pj-precision-micro-tick" d="m54 50 8 8" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick pj-precision-micro-tick" d="m178 58 8-8" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick pj-precision-micro-tick" d="m54 190 8-8" vectorEffect="non-scaling-stroke" />
            <path className="pj-precision-tick pj-precision-micro-tick" d="m178 182 8 8" vectorEffect="non-scaling-stroke" />
          </g>
          <g className="pj-precision-center" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="120" cy="120" r="2.3" vectorEffect="non-scaling-stroke" />
            <path d="M113 120h14M120 113v14" vectorEffect="non-scaling-stroke" />
          </g>
          <g className="pj-precision-label" fill="currentColor" fontFamily="Courier New, monospace" textAnchor="end">
            <text x="220" y="216" fontSize="6.5" fontWeight="700" letterSpacing="0.7">PJ / 001</text>
            <text className="pj-precision-label-secondary" x="220" y="228" fontSize="5.5" letterSpacing="0.24">PROJECT JERICO / WEB / DESIGN / SYSTEMS</text>
          </g>
        </g>
      )}
      <g className="pj-glyph-frame" transform={construction ? "translate(38 38) scale(.82)" : "translate(20 20)"}>
        <g className="pj-glyph" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M30 32h62c27 0 43 16 43 43s-16 43-43 43H68v50H30V32Zm38 32v24h22c7 0 10-5 10-12s-3-12-10-12H68Z"
          />
          <path d="M128 32h42v90c0 31-19 49-50 49-29 0-47-17-47-46h37c0 11 3 16 11 16 5 0 7-4 7-17V32Z" />
        </g>
      </g>
    </svg>
  );
}

export function ProjectJericoWordmark({ className = "", label, showMark = true }: ProjectJericoWordmarkProps) {
  return (
    <span
      className={`project-jerico-wordmark ${className}`.trim()}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {showMark && <ProjectJericoMark className="project-jerico-wordmark-mark" />}
      <span className="project-jerico-wordmark-type" aria-hidden="true">
        <strong>PROJECT</strong>
        <strong>JERICO</strong>
      </span>
    </span>
  );
}
