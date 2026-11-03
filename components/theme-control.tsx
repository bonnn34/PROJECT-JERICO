"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ThemePreference = "light" | "dark";

const STORAGE_KEY = "project-jerico-theme";

function isThemePreference(value: string | undefined): value is ThemePreference {
  return value === "light" || value === "dark";
}

export function ThemeControl() {
  const [preference, setPreference] = useState<ThemePreference>("light");
  const transitionTimer = useRef(0);

  const applyTheme = (nextPreference: ThemePreference, animate = false) => {
    if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("theme-changing");
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-changing");
      }, 260);
    }

    document.documentElement.dataset.theme = nextPreference;
    document.documentElement.dataset.themePreference = nextPreference;
    document.documentElement.style.colorScheme = nextPreference;
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", nextPreference === "dark" ? "#0b0b0b" : "#f5f2eb");
    });
  };

  useEffect(() => {
    const initialPreference = isThemePreference(document.documentElement.dataset.themePreference)
      ? document.documentElement.dataset.themePreference
      : "light";
    setPreference(initialPreference);
    applyTheme(initialPreference);
    return () => {
      window.clearTimeout(transitionTimer.current);
      document.documentElement.classList.remove("theme-changing");
    };
  }, []);

  const toggleTheme = () => {
    const nextPreference: ThemePreference = preference === "light" ? "dark" : "light";
    setPreference(nextPreference);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      // The selection still applies when storage is unavailable.
    }
    applyTheme(nextPreference, true);
  };

  return (
    <div className="theme-control">
      <button
        type="button"
        className="theme-toggle"
        aria-label={preference === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={preference === "light" ? "Switch to dark mode" : "Switch to light mode"}
        onClick={toggleTheme}
      >
        <Moon className="theme-toggle-icon theme-switch-to-dark" size={16} aria-hidden="true" />
        <Sun className="theme-toggle-icon theme-switch-to-light" size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
