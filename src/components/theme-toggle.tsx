"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.classList.contains("dark");

/** Sun / moon switch. The choice is kept in localStorage "theme"; without one the system setting wins. */
export function ThemeToggle({ className }: { className?: string }) {
  // Reads the class on <html>; null on the server, so the first paint shows an empty button.
  const dark = useSyncExternalStore<boolean | null>(subscribe, isDark, () => null);

  const flip = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`press size-10 grid place-items-center border border-line hover:border-rule ${className ?? ""}`}
    >
      {dark === null ? (
        <span className="size-4" />
      ) : dark ? (
        <Sun key="sun" size={17} className="theme-icon" />
      ) : (
        <Moon key="moon" size={17} className="theme-icon" />
      )}
    </button>
  );
}
