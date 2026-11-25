"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Rises into place each time it scrolls into view (CSS .reveal / .in in globals.css), not only
 * the first time: the owner reads "motion only once" as broken animations.
 * `index` staggers siblings by 70 ms.
 */
export function Reveal({
  children,
  index = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // In when it enters, out again once it has fully left, so it plays every time it scrolls into view
        for (const e of entries) e.target.classList.toggle("in", e.isIntersecting);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal", className)}
      style={{ "--i": index } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
