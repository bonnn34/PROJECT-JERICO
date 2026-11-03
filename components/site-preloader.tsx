"use client";

import { useEffect, useState } from "react";
import { ProjectJericoMark } from "@/components/project-jerico-logo";

const SESSION_KEY = "project-jerico-preloader-seen";
const CONSTRUCTION_DURATION = 1450;
const COMPLETION_HOLD = 300;
const CURTAIN_DURATION = 620;
const SAFETY_TIMEOUT = 4500;

type PreloaderPhase = "constructing" | "complete" | "exiting";

export function SitePreloader() {
  const [isVisible, setVisible] = useState(true);
  const [isReady, setReady] = useState(false);
  const [phase, setPhase] = useState<PreloaderPhase>("constructing");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldSkip = reducedMotion || document.documentElement.classList.contains("preloader-skip");
    const siteContent = document.querySelector<HTMLElement>("[data-site-content]");

    if (shouldSkip) {
      setVisible(false);
      return;
    }

    let hasFinished = false;
    const timers = new Set<number>();
    const eventController = new AbortController();
    document.body.classList.add("preloader-active", "preloader-lock");
    if (siteContent) {
      siteContent.inert = true;
      siteContent.setAttribute("aria-hidden", "true");
    }

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const releaseSite = () => {
      document.body.classList.remove("preloader-lock");
      if (siteContent) {
        siteContent.inert = false;
        siteContent.removeAttribute("aria-hidden");
      }
    };

    const beginExit = () => {
      if (hasFinished) return;
      hasFinished = true;
      setReady(true);
      setPhase("complete");
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Storage may be unavailable in privacy-restricted browsing contexts.
      }

      schedule(() => {
        document.documentElement.classList.remove("preloader-pending");
        document.body.classList.remove("preloader-active");
        setPhase("exiting");
        schedule(() => {
          setVisible(false);
          releaseSite();
        }, CURTAIN_DURATION);
      }, COMPLETION_HOLD);
    };

    const waitForApplication = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true, signal: eventController.signal }));
      }

      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // Font readiness is helpful but must never block access.
        }
      }
      setReady(true);
    };

    const construction = new Promise<void>((resolve) => schedule(resolve, CONSTRUCTION_DURATION));
    const application = waitForApplication();
    void Promise.all([construction, application]).then(beginExit);
    schedule(beginExit, SAFETY_TIMEOUT);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      eventController.abort();
      document.documentElement.classList.remove("preloader-pending");
      document.body.classList.remove("preloader-active", "preloader-lock");
      releaseSite();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`site-preloader preloader-${phase}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={!isReady}
    >
      <div className="preloader-rail preloader-rail-top" aria-hidden="true">
        <span>PROJECT JERICO / 2026</span>
        <span>INDEPENDENT DIGITAL PRACTICE</span>
      </div>

      <div className="preloader-stage" aria-hidden="true">
        <svg className="preloader-target" viewBox="0 0 240 240" focusable="false">
          <path className="preloader-diamond" d="M120 16 224 120 120 224 16 120Z" pathLength="1" />
          <circle className="preloader-target-ring" cx="120" cy="120" r="88" pathLength="1" />
          <g className="preloader-alignment-guides">
            <path className="preloader-guide preloader-guide-horizontal" d="M26 120H214" pathLength="1" />
            <path className="preloader-guide preloader-guide-vertical" d="M120 26V214" pathLength="1" />
          </g>
          <g className="preloader-target-ticks">
            <path d="M120 24V39" />
            <path d="M120 201V216" />
            <path d="M24 120H39" />
            <path d="M201 120H216" />
            <path className="preloader-tick-diagonal" d="M55 53 64 62" />
            <path className="preloader-tick-diagonal" d="m176 62 9-9" />
            <path className="preloader-tick-diagonal" d="m55 187 9-9" />
            <path className="preloader-tick-diagonal" d="m176 178 9 9" />
          </g>
          <g className="preloader-center-mark">
            <circle cx="120" cy="120" r="2.4" />
            <path d="M112 120h16M120 112v16" />
          </g>
        </svg>
        <ProjectJericoMark className="preloader-monogram" />
        <span className="preloader-stage-code">PJ / 001</span>
      </div>

      <div className="preloader-status-panel">
        <div className="preloader-status-line">
          <span>{isReady ? "COMPOSITION COMPLETE" : "COMPOSITION IN PROGRESS"}</span>
          <span>{isReady ? "100%" : "—"}</span>
        </div>
        <div className={`preloader-progress ${isReady ? "is-complete" : ""}`} aria-hidden="true">
          <i />
        </div>
        <div className="preloader-status-meta" aria-hidden="true">
          <span>WEB / DESIGN / SYSTEMS</span>
          <span>{isReady ? "READY" : "SYNCHRONIZING"}</span>
        </div>
      </div>
    </div>
  );
}
