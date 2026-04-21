"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { Check, Copy, ExternalLink } from "lucide-react";
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

  const linkedinHandle = bio.linkedin.replace(/\/$/, "").split("/").pop() ?? "";

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align={align}
          className={cn(
            "bg-bone border border-border rounded-xl shadow-[0_10px_40px_rgba(18,54,36,0.18)] p-1.5 flex flex-col w-[300px] z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            contentClassName
          )}
        >
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-md hover:bg-bg3 transition-colors"
          >
            <span className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-ink">LinkedIn</span>
              <span className="text-[12px] text-muted truncate">in/{linkedinHandle}</span>
            </span>
            <ExternalLink
              size={14}
              className="shrink-0 text-muted group-hover:text-ink transition-colors"
            />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label={copied ? "Email copied" : "Copy email to clipboard"}
            className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-md hover:bg-bg3 transition-colors text-left"
          >
            <span className="flex flex-col min-w-0">
              <span
                className={cn(
                  "text-[13px] font-semibold transition-colors",
                  copied ? "text-green-mid" : "text-ink"
                )}
              >
                {copied ? "Copied!" : "Email"}
              </span>
              <span className="text-[13px] text-muted truncate tabular-nums">
                {bio.email}
              </span>
            </span>
            <span className="relative w-[14px] h-[14px] shrink-0">
              <Copy
                size={14}
                aria-hidden
                className={cn(
                  "absolute inset-0 transition-all duration-200 text-muted group-hover:text-ink",
                  copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
                )}
              />
              <Check
                size={14}
                aria-hidden
                className={cn(
                  "absolute inset-0 transition-all duration-200 text-green-mid",
                  copied ? "opacity-100 scale-110" : "opacity-0 scale-50"
                )}
              />
            </span>
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
