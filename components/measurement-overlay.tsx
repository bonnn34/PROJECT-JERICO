"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type MeasurementVariant = "horizontal" | "dimensions" | "corners";

type MeasurementOverlayProps = {
  variant: MeasurementVariant;
  delay?: number;
  guideOffset?: number;
  reuseExistingCorners?: boolean;
  targetSelector?: string;
};

type Measurement = {
  height: number;
  left: number;
  top: number;
  width: number;
};

const EMPTY_MEASUREMENT: Measurement = { height: 0, left: 0, top: 0, width: 0 };

export function MeasurementOverlay({
  variant,
  delay = 150,
  guideOffset = 12,
  reuseExistingCorners = false,
  targetSelector,
}: MeasurementOverlayProps) {
  const overlayRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(false);
  const [isActive, setActive] = useState(false);
  const [measurement, setMeasurement] = useState<Measurement>(EMPTY_MEASUREMENT);

  useEffect(() => {
    const overlay = overlayRef.current;
    const host = overlay?.parentElement;
    if (!overlay || !host) return;

    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!precisePointer.matches || reducedMotion.matches) return;

    let activationTimer = 0;
    let resizeObserver: ResizeObserver | null = null;

    const getTargets = () => {
      if (!targetSelector) return [host];
      return Array.from(host.querySelectorAll<HTMLElement>(targetSelector));
    };

    const measure = () => {
      const targets = getTargets();
      if (targets.length === 0) { setMeasurement(EMPTY_MEASUREMENT); return false; }

      const hostRect = host.getBoundingClientRect();
      const targetRects = targets.map((target) => target.getBoundingClientRect())
        .filter(rect => [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) && rect.width > 0 && rect.height > 0);
      if (!targetRects.length) { setMeasurement(EMPTY_MEASUREMENT); return false; }
      const left = Math.min(...targetRects.map((rect) => rect.left));
      const top = Math.min(...targetRects.map((rect) => rect.top));
      const right = Math.max(...targetRects.map((rect) => rect.right));
      const bottom = Math.max(...targetRects.map((rect) => rect.bottom));
      const next = {
        left: Math.round(left - hostRect.left),
        top: Math.round(top - hostRect.top),
        width: Math.round(right - left),
        height: Math.round(bottom - top),
      };

      setMeasurement((current) => (
        current.left === next.left &&
        current.top === next.top &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next
      ));
      return next.width > 0 && next.height > 0;
    };

    const observeCurrentTargets = () => {
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(host);
      getTargets().forEach((target) => {
        if (target !== host) resizeObserver?.observe(target);
      });
    };

    const activate = () => {
      const measured = measure();
      observeCurrentTargets();
      activeRef.current = measured;
      setActive(measured);
    };

    const onPointerEnter = () => {
      if (activationTimer) return;
      activationTimer = window.setTimeout(() => {
        activationTimer = 0;
        activate();
      }, delay);
    };

    const onPointerLeave = () => {
      if (activationTimer) window.clearTimeout(activationTimer);
      activationTimer = 0;
      resizeObserver?.disconnect();
      resizeObserver = null;
      activeRef.current = false;
      setActive(false);
    };

    const mutationObserver = new MutationObserver(() => {
      if (!activeRef.current) return;
      measure();
      observeCurrentTargets();
    });

    host.addEventListener("pointerenter", onPointerEnter, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });
    if (targetSelector) mutationObserver.observe(host, { childList: true, subtree: true });

    return () => {
      if (activationTimer) window.clearTimeout(activationTimer);
      activeRef.current = false;
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      host.removeEventListener("pointerenter", onPointerEnter);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [delay, targetSelector]);

  const hasMeasurement = Number.isFinite(measurement.width) && Number.isFinite(measurement.height) && measurement.width > 0 && measurement.height > 0;
  const style = {
    left: measurement.left,
    top: measurement.top,
    width: measurement.width,
    height: measurement.height,
    "--measurement-offset": `${guideOffset}px`,
  } as CSSProperties;

  return (
    <span
      ref={overlayRef}
      className={`measurement-overlay measurement-${variant} ${isActive && hasMeasurement ? "is-active" : ""}`}
      style={style}
      aria-hidden="true"
    >
      {hasMeasurement && (variant === "horizontal" || variant === "dimensions") && (
        <span className="measurement-axis measurement-axis-horizontal">
          <i className="measurement-line" />
          <i className="measurement-tick measurement-tick-start" />
          <i className="measurement-tick measurement-tick-end" />
          <span className="measurement-label">{variant === "horizontal" ? "WIDTH" : "W"} / {measurement.width} PX</span>
        </span>
      )}

      {hasMeasurement && variant === "dimensions" && (
        <span className="measurement-axis measurement-axis-vertical">
          <i className="measurement-line" />
          <i className="measurement-tick measurement-tick-start" />
          <i className="measurement-tick measurement-tick-end" />
          <span className="measurement-label">H / {measurement.height} PX</span>
        </span>
      )}

      {hasMeasurement && variant === "corners" && (
        <>
          {!reuseExistingCorners && (
            <span className="measurement-corner-set">
              <i className="measurement-corner measurement-corner-nw" />
              <i className="measurement-corner measurement-corner-ne" />
              <i className="measurement-corner measurement-corner-sw" />
              <i className="measurement-corner measurement-corner-se" />
            </span>
          )}
          <span className="measurement-card-label">W / {measurement.width} PX</span>
        </>
      )}
    </span>
  );
}
