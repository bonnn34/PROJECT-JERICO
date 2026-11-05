"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AGENTS } from "./construction-timeline";
import { createConstructionCoordinator, type ConstructionCoordinator } from "./construction-coordinator";
import { useConstructionPreferences } from "./construction-preferences";

/** Portalled to body so section transforms/overflow never clip the overlay. */
export function GlobalAgentOverlay() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<SVGSVGElement>(null);
  const coordinatorRef = useRef<ConstructionCoordinator | null>(null);
  const preferences = useConstructionPreferences();
  const completed = useRef(new Set<string>());
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || !overlayRef.current) return;
    const coordinator = createConstructionCoordinator(overlayRef.current, completed.current);
    coordinatorRef.current = coordinator;
    return () => { coordinator.destroy(); coordinatorRef.current = null; };
  }, [mounted]);
  useEffect(() => {
    coordinatorRef.current?.setPreferences(preferences);
  }, [mounted, preferences.ready, preferences.enabled, preferences.reducedMotion]); // Theme is deliberately unrelated.

  if (!mounted) return null;
  return createPortal(
    <svg ref={overlayRef} className="global-agent-overlay" aria-hidden="true" focusable="false" data-global-agent-overlay>
      {AGENTS.map((agent, index) => <g key={agent.name} data-global-agent={index} color={agent.color} opacity="0">
        <g data-agent-selection>
          <path data-agent-guides className="construction-guides" />
          <rect data-agent-box className="construction-selection" />
          {[0, 1, 2, 3].map(corner => <rect key={corner} data-agent-handle={corner} width="5" height="5" className="construction-handle" />)}
          <text data-agent-action className="construction-action-label" />
          <path data-agent-caret fill="none" stroke="currentColor" strokeWidth="1.5" />
          <g data-agent-check><circle r="7" fill="currentColor" /><path d="m-3 0 2 2 4-4" fill="none" stroke="var(--paper)" strokeWidth="1.3" /></g>
        </g>
        <g data-agent-pointer>
          <circle data-agent-click fill="none" stroke="currentColor" strokeWidth="1" />
          <path data-agent-arrow d="M0 0 1 20 6 15 11 24 15 22 10 13 19 12Z" fill="currentColor" stroke="var(--paper)" strokeWidth="1.2" />
          <g data-agent-tag><rect width="82" height="20" rx="2" fill="currentColor" /><text x="6" y="13" fill="#fff">{String(index + 1).padStart(2, "0")} / {agent.name}</text></g>
        </g>
      </g>)}
    </svg>, document.body,
  );
}
