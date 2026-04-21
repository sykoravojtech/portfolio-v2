"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { bio } from "@/content/bio";
import { cn } from "@/lib/utils";

export function ContactMenu({
  children,
  contentClassName,
  align = "start",
}: {
  children: React.ReactNode;
  contentClassName?: string;
  align?: "start" | "center" | "end";
}) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(bio.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align={align}
          className={cn(
            "bg-bone border border-border rounded-xl shadow-[0_10px_40px_rgba(18,54,36,0.18)] p-2 flex flex-col min-w-[240px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            contentClassName
          )}
        >
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-semibold text-ink hover:bg-bg3 transition-colors"
          >
            <span>LinkedIn</span>
            <span className="text-muted text-[11px] font-normal">↗</span>
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-semibold text-ink hover:bg-bg3 transition-colors text-left"
          >
            <span>{copied ? "Copied ✓" : "Email"}</span>
            <span className="text-muted text-[10px] font-normal truncate ml-3 max-w-[160px]">
              {copied ? bio.email : `${bio.email} (copy)`}
            </span>
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
