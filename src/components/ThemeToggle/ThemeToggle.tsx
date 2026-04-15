"use client";

import { useCallback, useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.scss";

function getThemeSnapshot(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return (
    (document.documentElement.getAttribute("data-theme") as "dark" | "light") ??
    "light"
  );
}

function getThemeServerSnapshot(): "light" {
  return "light";
}

function subscribeToTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      <span className={styles.track} data-dark={isDark ? "true" : "false"}>
        <span className={styles.thumb}>
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <circle cx="12" cy="12" r="5" />
              <line
                x1="12"
                y1="1"
                x2="12"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="21"
                x2="12"
                y2="23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="4.22"
                y1="4.22"
                x2="5.64"
                y2="5.64"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="18.36"
                y1="18.36"
                x2="19.78"
                y2="19.78"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="1"
                y1="12"
                x2="3"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="21"
                y1="12"
                x2="23"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="4.22"
                y1="19.78"
                x2="5.64"
                y2="18.36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="18.36"
                y1="5.64"
                x2="19.78"
                y2="4.22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
