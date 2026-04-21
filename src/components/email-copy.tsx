"use client";

import { useState } from "react";
import { bio } from "@/content/bio";

export function EmailCopy({
  className,
  label = "Email",
}: {
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(bio.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // clipboard API blocked — fall back to selecting visible text
        }
      }}
      className={className}
      aria-label={`Copy ${bio.email} to clipboard`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
