"use client";

import { cn } from "@/lib/utils";
import { useOpenDetails } from "./details";

export function OpenDetailsButton({ id, label = "Read more", className }: { id: string; label?: string; className?: string }) {
  const open = useOpenDetails();
  return (
    <button
      type="button"
      onClick={() => open(id)}
      className={cn(
        "press group inline-flex items-center gap-2 h-11 px-4 border border-ink font-semibold text-[13px] hover:bg-ink hover:text-paper",
        className,
      )}
    >
      {label}
      <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
    </button>
  );
}
