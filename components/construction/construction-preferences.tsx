"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "project-jerico-build-animation";
type Preferences = { ready: boolean; enabled: boolean; reducedMotion: boolean; toggle: () => void };
const PreferenceContext = createContext<Preferences>({ ready: false, enabled: false, reducedMotion: false, toggle: () => {} });

export function ConstructionPreferences({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preference, setPreference] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    try { setPreference(localStorage.getItem(STORAGE_KEY) !== "off"); } catch { /* Session preference still works. */ }
    setReducedMotion(media.matches);
    setReady(true);
    const changed = () => setReducedMotion(media.matches);
    const stored = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setPreference(event.newValue !== "off");
    };
    media.addEventListener("change", changed);
    window.addEventListener("storage", stored);
    return () => {
      media.removeEventListener("change", changed);
      window.removeEventListener("storage", stored);
    };
  }, []);
  const toggle = () => {
    if (reducedMotion) return;
    const next = !preference;
    setPreference(next);
    try { localStorage.setItem(STORAGE_KEY, next ? "on" : "off"); } catch { /* No storage is required. */ }
  };
  return <PreferenceContext.Provider value={{ ready, enabled: ready && preference && !reducedMotion, reducedMotion, toggle }}>{children}</PreferenceContext.Provider>;
}

export const useConstructionPreferences = () => useContext(PreferenceContext);

export function BuildAnimationControl() {
  const { ready, enabled, reducedMotion, toggle } = useConstructionPreferences();
  return <div className="build-animation-setting">
    <button type="button" role="switch" aria-checked={enabled} aria-label="Build animation" aria-describedby="build-animation-description" disabled={!ready || reducedMotion} onClick={toggle}>
      <span>BUILD ANIMATION</span><span className="build-setting-value">{enabled ? "ON" : "OFF"}<i aria-hidden="true" /></span>
    </button>
    <p id="build-animation-description">{reducedMotion ? "Off to respect your reduced-motion preference." : "Brief, simulated construction effects as you explore."}</p>
  </div>;
}
