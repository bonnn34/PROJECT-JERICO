"use client";

import { useEffect } from "react";

const SPOTLIGHT_SELECTOR = "[data-grid-spotlight]";

export function EditorialPointerInteractions() {
  useEffect(() => {
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeZone: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const clearActiveZone = () => {
      activeZone?.style.setProperty("--grid-spotlight-opacity", "0");
      activeZone = null;
    };

    const updateSpotlight = () => {
      frame = 0;
      if (!precisePointer.matches || reducedMotion.matches) {
        clearActiveZone();
        return;
      }

      const target = document.elementFromPoint(pointerX, pointerY);
      const nextZone = target?.closest(SPOTLIGHT_SELECTOR) as HTMLElement | null;

      if (nextZone !== activeZone) {
        clearActiveZone();
        activeZone = nextZone;
      }

      if (!activeZone) return;

      const rect = activeZone.getBoundingClientRect();
      const gridSize = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--grid-size"),
      ) || 36;
      const documentLeft = rect.left + window.scrollX;
      const documentTop = rect.top + window.scrollY;
      const gridOriginX = ((-documentLeft % gridSize) + gridSize) % gridSize;
      const gridOriginY = ((-documentTop % gridSize) + gridSize) % gridSize;

      activeZone.style.setProperty("--grid-spotlight-x", `${pointerX - rect.left}px`);
      activeZone.style.setProperty("--grid-spotlight-y", `${pointerY - rect.top}px`);
      activeZone.style.setProperty("--grid-origin-x", `${gridOriginX}px`);
      activeZone.style.setProperty("--grid-origin-y", `${gridOriginY}px`);
      activeZone.style.setProperty("--grid-spotlight-opacity", "1");
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSpotlight);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestUpdate();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) clearActiveZone();
    };

    const onPreferenceChange = () => {
      if (!precisePointer.matches || reducedMotion.matches) clearActiveZone();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", clearActiveZone);
    precisePointer.addEventListener("change", onPreferenceChange);
    reducedMotion.addEventListener("change", onPreferenceChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      clearActiveZone();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", clearActiveZone);
      precisePointer.removeEventListener("change", onPreferenceChange);
      reducedMotion.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return null;
}
